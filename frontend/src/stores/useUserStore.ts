import {create} from "zustand";
import axios from "axios";
import {User} from "../types/User.ts";

interface UserState {
    users: User[];
    createUser: (newUser: User) => void;
}

const useUserStore = create<UserState>()((set) => ({
    users: [],
    createUser: (newUser) => {
        axios.post("api/user/create", newUser).then(response => {
            set(state => ({
                users: [...state.users, response.data]
            }));
        })
            .then(() => {
                alert("User erfolgreich erstellt.");
            }).catch(error => console.log(error))
    }
}))
export default useUserStore;