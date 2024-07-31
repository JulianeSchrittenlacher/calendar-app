import {create} from "zustand";
import axios from "axios";
import {User} from "../types/User.ts";

interface UserState {
    users: User[];
    currentUser: User | null;
    getUsers: () => void;
    createUser: (newUser: User) => void;
    deleteUser: (id: string) => void;
    updateUser: (id: string, updatedUser: User) => void;
    setCurrentUser: (user: User | null) => void;
}

const useUserStore = create<UserState>()((set) => ({
    users: [],
    currentUser: null,
    getUsers: () => {
        axios.get("api/user").then(response => {
            set({users: response.data});
        }).catch(error => console.log(error))
    },
    createUser: (newUser) => {
        axios.post("api/user/create", newUser).then(response => {
            set(state => ({
                users: [...state.users, response.data]
            }));
            alert("User erfolgreich erstellt.");
        })
            .catch(error => console.log(error))
    },
    deleteUser: (id: string) => {
        axios.delete(`api/user/${id}`)
            .then(() => {
                set(state => ({
                    users: state.users.filter(user => user.id !== id)
                }));
                alert("User gelöscht.");
            })
            .catch(error => console.log(error));
    },
    updateUser: (id, updatedUser) => {
        axios.put(`api/user/${id}`, updatedUser).then(response => {
            set(state => {
                const updatedUsers: User[] = state.users.map(user => user.id === id ? response.data : user);
                return {users: updatedUsers};
            });
            alert("User geändert!");
        })
            .catch(error => console.log("Error updating user " + error))
    },
    setCurrentUser: (user) => set({currentUser: user}),
}))
export default useUserStore;