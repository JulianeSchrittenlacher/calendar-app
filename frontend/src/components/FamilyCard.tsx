import {Family} from "../types/Family.ts";
import useFamilyStore from "../stores/useFamilyStore.ts";
import {useState} from "react";
import Modal from "./Modal.tsx";
import FamilyEditForm from "./FamilyEditForm.tsx";
import {useNavigate} from "react-router-dom";

type FamilyCardProps = {
    family: Family;
}
export default function FamilyCard(props: Readonly<FamilyCardProps>) {
    const deleteFamily: (id: string) => void = useFamilyStore(state => state.deleteFamily);
    const currentFamily: Family | null = useFamilyStore(state => state.currentFamily);
    const setCurrentFamily = useFamilyStore(state => state.setCurrentFamily);
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);

    const handleEdit = () => {
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
    }

    const handleLogin = () => {
        setCurrentFamily(props.family);
        currentFamily && navigate(`/${currentFamily.id}/my-family-page`)
    }
    return (
        <article className="appointment-card">
            {!currentFamily && <button className="login-button" onClick={handleLogin}>Login</button>}
            <p>{props.family.name}</p>
            <p>{props.family.id}</p>
            <div className="card-button-container">
                <button onClick={() => deleteFamily(props.family.id)}>Löschen</button>
                <button onClick={handleEdit}>Bearbeiten</button>
            </div>

            <Modal show={modalOpen} onClose={handleCloseModal}>
                <FamilyEditForm
                    family={props.family}
                    onClose={handleCloseModal}
                />
            </Modal>
        </article>
    );
}
