import useUserStore from "../stores/useUserStore.ts";
import UserCard from "./UserCard.tsx";
import {User} from "../types/User.ts";
import "../styles/Gallery.css";
import {useEffect} from "react";
import useFamilyStore from "../stores/useFamilyStore.ts";

export default function UserGallery() {
    const getUsers = useUserStore(state => state.getUsers);
    const currentFamily = useFamilyStore(state => state.currentFamily);
    const users: User[] = useUserStore(state => state.users);

    useEffect(() => {
        currentFamily && getUsers(currentFamily.id)
    }, []);
    return (
        <div className="gallery">
            {users
                .map(user => (
                    <UserCard key={user.id} user={user}/>
                ))
            }
        </div>
    );
}
