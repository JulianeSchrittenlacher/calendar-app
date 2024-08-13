import "../styles/Header.css"
import {useState} from "react";
import Modal from "./Modal.tsx";
import {NavLink, useLocation} from "react-router-dom";
import AppointmentAddForm from "./AppointmentAddForm.tsx";
import useUserStore from "../stores/useUserStore.ts";
import FamilyAddForm from "./FamilyAddForm.tsx";

export default function Header() {

    const [modalOpen, setModalOpen] = useState(false);
    const currentUser = useUserStore(state => state.currentUser);
    const location = useLocation();


    const handleClick = () => {
        setModalOpen(true);
    }
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const getButtonText = () => {
        if (location.pathname === '/my-family-page') {
            return "Familie bearbeiten";
        } else if (location.pathname === `/shared-calendar` || location.pathname === `/my-calendar`) {
            return "Termin hinzufügen";
        }
        return null;

    }

    const renderForm = () => {
        if (location.pathname === '/my-family-page') {
            return <FamilyAddForm onClose={handleCloseModal}/>;
        } else if (location.pathname === `/shared-calendar` || location.pathname === `/my-calendar`) {
            return <AppointmentAddForm onClose={handleCloseModal}/>;
        }
        return null;
    };

    return (
        <>
            <div className="header-container">
                <div className="app-header">
                    <h1>Familienkalender</h1>
                    <h2>Mit Liebe geplant, mit Freude gelebt</h2>
                    <h2>Termine für Herz und Seele</h2>
                </div>
                <div className="header-buttons">
                    <p>{currentUser && "Hallo " + currentUser.username + "!"}</p>
                    {location.pathname !== "/" && location.pathname !== "/my-family-page" && (
                        <button onClick={handleClick}>{getButtonText()}</button>
                    )}
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
                                <NavLink to={`/my-family-page`}
                                         className={({isActive}) => (isActive ? "active-link" : "")}>
                                    Meine Familie
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`/my-calendar`}
                                         className={({isActive}) => (isActive ? "active-link" : "")}>
                                    Mein Kalender
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`/shared-calendar`}
                                         className={({isActive}) => (isActive ? "active-link" : "")}>
                                    Unser Kalender
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`/calendar`}
                                         className={({isActive}) => (isActive ? "active-link" : "")}>
                                    Kalenderansicht
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
