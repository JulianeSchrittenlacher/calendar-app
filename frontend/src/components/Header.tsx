import "../styles/Header.css"
import {useState} from "react";
import Modal from "./Modal.tsx";
import UserAddForm from "./UserAddForm.tsx";
import {NavLink, useLocation} from "react-router-dom";
import AppointmentAddForm from "./AppointmentAddForm.tsx";

export default function Header() {

    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);

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

    return (
        <>
            <div className="header-container">
                <div className="app-header">
                    <h1>Familienkalender</h1>
                    <h2>Mit Liebe geplant, mit Freude gelebt</h2>
                    <h2>Termine für Herz und Seele</h2>
                </div>
                <button className="plus-button" onClick={handleClick}>Hinzufügen</button>
            </div>

            <nav className="App-nav">
                <ul>
                    <li>
                        <NavLink to="/" className={({isActive}) => (isActive ? "active-link" : "")}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/shared-calendar" className={({isActive}) => (isActive ? "active-link" : "")}>
                            Unser Kalender
                        </NavLink>
                    </li>
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
