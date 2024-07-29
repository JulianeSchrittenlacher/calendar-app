import {User} from "../types/User.ts";
import useUserStore from "../stores/useUserStore.ts";

type UserCardProps = {
    user: User;
}
export default function UserCard(props: Readonly<UserCardProps>) {
    const deleteUser: (id: string) => void = useUserStore(state => state.deleteUser);

    return (
        <article className="appointment-card">
            <p>{props.user.name}</p>
            <p>{props.user.role}</p>
            <div className="card-button-container">
                <button onClick={() => deleteUser(props.user.id)}>Löschen</button>
            </div>
        </article>
    );
}
