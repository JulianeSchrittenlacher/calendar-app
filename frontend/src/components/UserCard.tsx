import {User} from "../types/User.ts";

type UserCardProps = {
    user: User;
}
export default function UserCard(props: Readonly<UserCardProps>) {
    return (
        <div className="appointment-card">
            <p>{props.user.name}</p>
            <p>{props.user.role}</p>
        </div>
    );
}
