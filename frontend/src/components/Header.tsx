import AppointmentForm from "./AppointmentForm.tsx";
import {Appointment} from "../types/Appointment.ts";
import "../styles/Header.css"

type HeaderProps = {
    createAppointment: (newAppointment:Appointment) => void,
}


export default function Header(props: Readonly<HeaderProps>) {
    return (
        <div className="header-container">
            <h1 className="app-header">Familienkalender</h1>
            <AppointmentForm createAppointment={props.createAppointment}/>

        </div>
    );
}
