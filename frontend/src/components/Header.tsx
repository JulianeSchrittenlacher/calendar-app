import "../styles/Header.css"
import {useState} from "react";
import Modal from "./Modal.tsx";
import UserAddForm from "./UserAddForm.tsx";
import {NavLink, useLocation} from "react-router-dom";
import AppointmentAddForm from "./AppointmentAddForm.tsx";
import useUserStore from "../stores/useUserStore.ts";

export default function Header() {

    const [modalOpen, setModalOpen] = useState(false);
    const currentUser = useUserStore(state => state.currentUser);
    const setCurrentUser = useUserStore(state => state.setCurrentUser);
    const location = useLocation();


    const handleClick = () => {
        setModalOpen(true);
    }
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const renderForm = () => {
        if (location.pathname === '/') {
            return <UserAddForm onClose={handleCloseModal}/>;
        } else if (location.pathname === '/shared-calendar') {
            return <AppointmentAddForm onClose={handleCloseModal}/>;
        }
        return null;
    };

    const getButtonText = () => {
        if (location.pathname === "/") {
            return "Familienmitglied hinzufügen";
        }
        if (currentUser && (location.pathname === `/${currentUser.id}/shared-calendar` || location.pathname === `/${currentUser.id}/my-calendar`)) {
            return "Termin hinzufügen";
        }
        return "Hinzufügen";
    };

    const handleLogout = () => {
        setCurrentUser(null);
    }

    return (
        <>
            <div className="header-container">
                <div className="app-header">
                    <h1>Familienkalender</h1>
                    <h2>Mit Liebe geplant, mit Freude gelebt</h2>
                    <h2>Termine für Herz und Seele</h2>
                </div>
                <div className="header-buttons">
                    <button onClick={handleClick}>{getButtonText()}</button>
                    {currentUser && <button onClick={handleLogout}>Du bist {currentUser.name}! Logout?</button>}
                </div>
            </div>

            <nav className="App-nav">
                <ul>
                    <li>
                        <NavLink to="/" className={({isActive}) => (isActive ? "active-link" : "")}>
                            Home
                        </NavLink>
                    </li>
                    {currentUser && (
                        <>
                            <li>
                                <NavLink to={`/${currentUser.id}/my-calendar`}
                                         className={({isActive}) => (isActive ? "active-link" : "")}>
                                    Mein Kalender
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`/${currentUser.id}/shared-calendar`}
                                         className={({isActive}) => (isActive ? "active-link" : "")}>
                                    Unser Kalender
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            <Modal show={modalOpen} onClose={handleCloseModal}>
                <>
                    {renderForm()}
                </>
            </Modal>
        </>
    );
}
