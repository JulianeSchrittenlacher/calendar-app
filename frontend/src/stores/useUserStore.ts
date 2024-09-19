import {create} from "zustand";
import axios from "axios";
import {User} from "../types/User.ts";
import useAppointmentStore from "./useAppointmentStore.ts";
import useFamilyStore from "./useFamilyStore.ts";

interface UserState {
    users: User[] | null;
    currentUser: User | null;
    getUsers: (familyId: string) => void;
    registerUser: (newUser: User) => Promise<User>;
    loginUser: (username: string, password: string) => void;
    logoutUser: () => void;
    deleteUser: (id: string) => void;
    updateUser: (id: string, updatedUser: User) => void;
}

const useUserStore = create<UserState>()((set) => ({
    users: [],
    currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null') as User | null,
    getUsers: (familyId: string) => {
        axios.get(`/api/user/` + familyId)
            .then(response => {
                const users = response.data;
                set({users});
            })
            .catch(error => console.log(error));
    },
    registerUser: (newUser: User): Promise<User> => {
        return axios.post(`/api/user/register`, newUser)
            .then(response => {
                set(state => ({
                    users: state.users ? [...state.users, response.data] : [response.data]
                }));
                if (newUser.familyId) {
                    alert(`User erfolgreich erstellt mit der FamilyId: ${newUser.familyId}`);
                } else {
                    alert("Neue Familie erstellt.")
                }

                return response.data;
            })
            .catch(error => {
                console.error(error);
                throw error;
            });
    },
    loginUser: async (username: string, password: string) => {
        try {
            const response = await axios.post("/api/user/login", undefined, {
                auth: {username, password},
                headers: {'Accept': 'application/json'}
            });

            if (response.headers['content-type'].includes('application/json')) {
                const user = response.data;
                set({currentUser: user});
                localStorage.setItem('currentUser', JSON.stringify(user));
                console.log("User successfully logged in:", user);
                return user;
            } else {
                console.error("Unexpected response format", response);
                return null;
            }
        } catch (error) {
            console.error("Login failed   pppp:", error);
            throw error;
        }
    },
    logoutUser: () => {
        axios.get("/api/user/logout")
            .then(() => {
                const anonymousUser = null;
                set({currentUser: anonymousUser});
                localStorage.removeItem('currentUser');
                console.log("User successfully logged out");
                const clearAppointments = useAppointmentStore.getState().clearAppointments;
                clearAppointments();
                const clearCurrentFamily = useFamilyStore.getState().clearCurrentFamily;
                clearCurrentFamily();
            })
            .catch(error => console.log(error));
    },
    deleteUser: (id: string) => {
        axios.delete(`/api/user/${id}`)
            .then(() => {
                set(state => ({
                    users: (state.users || []).filter(user => user.id !== id)
                }));
                const currentUser = localStorage.getItem('currentUser');
                if (currentUser) {
                    const parsedUser = JSON.parse(currentUser);
                    if (parsedUser.id === id) {
                        axios.get("/api/user/logout")
                            .then(() => {
                                const anonymousUser = null;
                                set({currentUser: anonymousUser});
                                localStorage.removeItem('currentUser');
                                console.log("User successfully logged out");

                                // Clear appointments or any other necessary cleanup
                                const clearAppointments = useAppointmentStore.getState().clearAppointments;
                                clearAppointments();
                                const clearCurrentFamily = useFamilyStore.getState().clearCurrentFamily;
                                clearCurrentFamily();

                                alert("Du hast deinen Account gelöscht und wurdest ausgeloggt.");
                            })
                            .catch(error => console.log("Error logging out: " + error));
                    } else {
                        alert("User gelöscht.");
                    }
                }
            })
            .catch(error => console.log("Error deleting user: " + error));
    },
    updateUser: (id, updatedUser) => {
        axios.put(`/api/user/${id}`, updatedUser).then(response => {
            set(state => {
                const updatedUsers: User[] = (state.users || []).map(user => user.id === id ? response.data : user);
                return {users: updatedUsers};
            });
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const parsedUser = JSON.parse(currentUser);
                if (parsedUser.id === id) {
                    set({currentUser: response.data});
                    localStorage.setItem('currentUser', JSON.stringify(response.data));
                }
            }
            alert("User geändert!");
        })
            .catch(error => console.log("Error updating user " + error))
    },
}))
export default useUserStore;