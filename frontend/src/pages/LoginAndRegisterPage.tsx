import Modal from "../components/Modal.tsx";
import {useState} from "react";
import RegisterForm from "../components/RegisterForm.tsx";
import LoginForm from "../components/LoginForm.tsx";
import "../styles/LoginAndRegisterPage.css"


export default function LoginAndRegisterPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegister = () => {
        setIsRegistering(true);
        setModalOpen(true);
    };

    const handleLogin = () => {
        setIsRegistering(false);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <article>
            <div className="button-container-welcome">
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleRegister}>Registrieren</button>
            </div>

            <Modal show={modalOpen} onClose={handleCloseModal}>
                {isRegistering ? (
                    <RegisterForm onClose={handleCloseModal}/>
                ) : (
                    <LoginForm onClose={handleCloseModal}/>
                )}
            </Modal>

        </article>
    );
}
