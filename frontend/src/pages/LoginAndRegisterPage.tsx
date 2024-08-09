import Modal from "../components/Modal.tsx";
import {useState} from "react";
import RegisterForm from "../components/RegisterForm.tsx";
import LoginForm from "../components/LoginForm.tsx";
import "../styles/LoginAndRegisterPage.css"
import useUserStore from "../stores/useUserStore.ts";


export default function LoginAndRegisterPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const currentUser = useUserStore(state => state.currentUser);
    const logoutUser = useUserStore(state => state.logoutUser);

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

    const handleLogout = () => {
        logoutUser();
    }

    return (
        <article>
            <div className="button-container-welcome">
                {!currentUser && <button onClick={handleLogin}>Login</button>}
                {!currentUser && <button onClick={handleRegister}>Registrieren</button>}
                {currentUser && <button onClick={handleLogout}>Logout</button>}
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
