import {create} from "zustand";
import axios from "axios";
import {User} from "../types/User.ts";
import useAppointmentStore from "./useAppointmentStore.ts";

interface UserState {
    users: User[] | null;
    setUsers: (users: User[] | null) => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    getUsers: (familyId: string) => void;
    registerUser: (newUser: User) => Promise<User>;
    loginUser: (username: string, password: string) => void;
    logoutUser: () => void;
    deleteUser: (id: string) => void;
    updateUser: (id: string, updatedUser: User) => void;
}

const useUserStore = create<UserState>()((set) => ({
    users: [],
    setUsers: (users) => {
        set({users});
    },
    currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null') as User | null,
    setCurrentUser: (user) => {
        set({currentUser: user});
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
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
                alert("User erfolgreich erstellt.");
                return response.data; // Return the registered user data
            })
            .catch(error => {
                console.error(error);
                throw error; // Rethrow the error so it can be handled by the caller
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
            })
            .catch(error => console.log(error));
    },
    deleteUser: (id: string) => {
        axios.delete(`/api/user/${id}`)
            .then(() => {
                set(state => ({
                    users: (state.users || []).filter(user => user.id !== id)
                }));
                alert("User gelöscht.");
            })
            .catch(error => console.log(error));
    },
    updateUser: (id, updatedUser) => {
        axios.put(`/api/user/${id}`, updatedUser).then(response => {
            set(state => {
                const updatedUsers: User[] = (state.users || []).map(user => user.id === id ? response.data : user);
                return {users: updatedUsers};
            });
            alert("User geändert!");
        })
            .catch(error => console.log("Error updating user " + error))
    },
}))
export default useUserStore;