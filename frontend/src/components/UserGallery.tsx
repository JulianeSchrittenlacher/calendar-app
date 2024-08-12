import useUserStore from "../stores/useUserStore.ts";
import UserCard from "./UserCard.tsx";
import {User} from "../types/User.ts";
import "../styles/Gallery.css";

export default function UserGallery() {
    const users: User[] | null = useUserStore(state => state.users);

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
