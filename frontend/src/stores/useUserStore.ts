import {create} from "zustand";
import axios from "axios";
import {User} from "../types/User.ts";

interface UserState {
    users: User[];
    getUsers: () => void;
    createUser: (newUser: User) => void;
    deleteUser: (id: string) => void;
}

const useUserStore = create<UserState>()((set, get) => ({
    users: [],
    getUsers: () => {
        axios.get("api/user").then(response => {
            set(({users: response.data}))
        }).catch(error => console.log(error))
    },
    createUser: (newUser) => {
        axios.post("api/user/create", newUser).then(response => {
            set(state => ({
                users: [...state.users, response.data]
            }));
        })
            .then(() => {
                get().getUsers();
                alert("User erfolgreich erstellt.");
            }).catch(error => console.log(error))
    },
    deleteUser: (id: string) => {
        axios.delete(`api/user/${id}`)
            .then(() => {
                get().getUsers();
                alert("User gelöscht.")
            })
            .catch(error => console.log(error));
    }
}))
export default useUserStore;