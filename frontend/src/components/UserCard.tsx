import {User} from "../types/User.ts";
import useUserStore from "../stores/useUserStore.ts";
import Modal from "./Modal.tsx";
import {useState} from "react";
import UserEditForm from "./UserEditForm.tsx";

type UserCardProps = {
    user: User;
}
export default function UserCard(props: Readonly<UserCardProps>) {
    const deleteUser: (id: string) => void = useUserStore(state => state.deleteUser);
    const setCurrentUser = useUserStore(state => state.setCurrentUser);
    const currentUser = useUserStore(state => state.currentUser);

    const [modalOpen, setModalOpen] = useState(false);

    const handleEdit = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleLogin = () => {
        setCurrentUser(props.user);
    };

    return (
        <article className="appointment-card">
            {!currentUser && <button className="login-button" onClick={handleLogin}>Login</button>}
            <p>{props.user.name}</p>
            <p>{props.user.role}</p>
            <p>Familien id: {props.user.familyId}</p>
            <div className="card-button-container">
                <button onClick={() => deleteUser(props.user.id)}>Löschen</button>
                <button onClick={handleEdit}>Bearbeiten</button>
            </div>

            <Modal show={modalOpen} onClose={handleCloseModal}>
                <UserEditForm
                    user={props.user}
                    onClose={handleCloseModal}
                />
            </Modal>
        </article>
    );
}
