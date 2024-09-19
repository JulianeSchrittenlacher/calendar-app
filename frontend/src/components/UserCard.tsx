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

    const [modalOpen, setModalOpen] = useState(false);

    const handleEdit = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <article className="appointment-card">
            <p>{props.user.username}</p>
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
