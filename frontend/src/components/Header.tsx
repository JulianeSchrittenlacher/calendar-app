import AppointmentAddForm from "./AppointmentAddForm.tsx";
import "../styles/Header.css"

export default function Header() {

    return (
        <>
            <div className="header-container">
                <div className="app-header">
                    <h1>Familienkalender</h1>
                    <h2>Mit Liebe geplant, mit Freude gelebt</h2>
                    <h2>Termine für Herz und Seele</h2>
                </div>
                <div>
                    <AppointmentAddForm/>
                </div>
            </div>
        </>
    );
}
