import {create} from "zustand";
import axios from "axios";
import {User} from "../types/User.ts";

interface UserState {
    users: User[];
    setUsers: (users: User[] | null) => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    getUsers: (familyId: string) => void;
    createUser: (newUser: User, familyId: string) => void;
    deleteUser: (id: string) => void;
    updateUser: (id: string, updatedUser: User) => void;
}

const useUserStore = create<UserState>()((set) => ({
    users: [],
    setUsers: (users) => {
    },
    currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
    setCurrentUser: (user) => {
        set({currentUser: user});
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    getUsers: (familyId: string) => {
        axios.get(`/api/user/` + familyId)
            .then(response => {
                // Handle successful response
                console.log(response.data);
            })
            .catch(error => {
                if (error.response) {
                    // Server responded with a status other than 200 range
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                    console.error('Error headers:', error.response.headers);
                } else if (error.request) {
                    // No response was received
                    console.error('Error request:', error.request);
                } else {
                    // Something else happened while setting up the request
                    console.error('Error message:', error.message);
                }
                console.error('Error config:', error.config);
            });
    },
    createUser: (newUser) => {
        axios.post(`/api/user/create`, newUser).then(response => {
            set(state => ({
                users: [...state.users, response.data]
            }));
            alert("User erfolgreich erstellt.");
        })
            .catch(error => console.log(error))
    },
    deleteUser: (id: string) => {
        axios.delete(`/api/user/${id}`)
            .then(() => {
                set(state => ({
                    users: state.users.filter(user => user.id !== id)
                }));
                alert("User gelöscht.");
            })
            .catch(error => console.log(error));
    },
    updateUser: (id, updatedUser) => {
        axios.put(`/api/user/${id}`, updatedUser).then(response => {
            set(state => {
                const updatedUsers: User[] = state.users.map(user => user.id === id ? response.data : user);
                return {users: updatedUsers};
            });
            alert("User geändert!");
        })
            .catch(error => console.log("Error updating user " + error))
    },
}))
export default useUserStore;