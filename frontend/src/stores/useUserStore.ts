import {create} from "zustand";
import axios from "axios";
import {User} from "../types/User.ts";

interface UserState {
    users: User[] | null;
    setUsers: (users: User[] | null) => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    getUsers: (familyId: string) => void;
    registerUser: (newUser: User) => void;
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
    currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
    setCurrentUser: (user) => {
        set({currentUser: user});
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    getUsers: (familyId: string) => {
        axios.get(`/api/user/` + familyId)
            .then(response => {
                const users = response.data;
                set({users});
                console.log(users);
            })
            .catch(error => console.log(error));
    },
    registerUser: (newUser) => {
        axios.post(`/api/user/register`, newUser).then(response => {
            set(state => ({
                users: state.users ? [...state.users, response.data] : [response.data]
            }));
            alert("User erfolgreich erstellt.");
        })
            .catch(error => console.log(error))
    },
    loginUser: (username, password) => {
        axios.post("/api/user/login", undefined, {auth: {username, password}})
            .then(response => {
                const user = response.data;
                set({setCurrentUser: user});
                localStorage.setItem('currentUser', JSON.stringify(user));
                console.log("User successfully logged in:", user);
            }).catch(error => console.log(error()));
    },
    logoutUser: () => {
        axios.get("/api/user/logout")
            .then(() => {
                const anonymousUser = null;
                set({currentUser: anonymousUser});
                localStorage.removeItem('currentUser');  // Entferne den Benutzer aus dem localStorage
                console.log("User successfully logged out");
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