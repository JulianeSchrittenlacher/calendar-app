import AppointmentAddForm from "./AppointmentAddForm.tsx";
import {Appointment} from "../types/Appointment.ts";
import "../styles/Header.css"

type HeaderProps = {
    createAppointment: (newAppointment:Appointment) => void,
    updateAppointment: (id:string, updatedAppointment:Appointment) => void,
}


export default function Header(props: Readonly<HeaderProps>) {

    return (
        <>
        <div className="header-container">
            <div className="app-header">
                <h1>Familienkalender</h1>
                <h2>Mit Liebe geplant, mit Freude gelebt</h2>
                <h2>Termine für Herz und Seele</h2>
            </div>
            <div>
                <AppointmentAddForm createAppointment={props.createAppointment} updateAppointment={props.updateAppointment}/>
            </div>
        </div>
        </>
    );
}
