import useUserStore from "../stores/useUserStore.ts";
import UserCard from "./UserCard.tsx";
import {User} from "../types/User.ts";
import "../styles/Gallery.css";
import {useEffect} from "react";

export default function UserGallery() {
    const users: User[] | null = useUserStore(state => state.users);
    const currentUser = useUserStore(state => state.currentUser);
    const getUsers = useUserStore(state => state.getUsers);

    useEffect(() => {
        currentUser && getUsers(currentUser.familyId);
    }, []);

    return (
        <div className="gallery">
            {users === null ? (
                <p>Keine User vorhanden</p>
            ) : users.length === 0 ? (
                <p>Keine User gefunden</p>
            ) : (
                users.map(user => (
                    <UserCard key={user.id} user={user}/>
                ))
            )}
        </div>
    );
}
