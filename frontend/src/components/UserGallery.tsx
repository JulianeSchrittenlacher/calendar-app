import useUserStore from "../stores/useUserStore.ts";
import UserCard from "./UserCard.tsx";
import {User} from "../types/User.ts";

export default function UserGallery() {
    const users: User[] = useUserStore(state => state.users);

    return (
        <>
            {users
                .map(user => (
                    <UserCard key={user.id} user={user}/>
                ))
            }
        </>
    );
}
