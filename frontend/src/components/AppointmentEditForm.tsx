import React, { useState } from "react";
import { Appointment } from "../types/Appointment";
import { toZonedTime} from 'date-fns-tz';
import "../styles/AppointmentForm.css"
import {Params, useNavigate, useParams} from "react-router-dom";

type AppointmentEditFormProps = {
    appointments: Appointment[];
    updateAppointment: (id:string, updatedAppointment:Appointment) => void,
};

export default function AppointmentEditForm(props: Readonly<AppointmentEditFormProps>) {

    const { updateAppointment, appointments } = props;
    const urlParams: Readonly<Params> =useParams();
    const urlId: string = urlParams.id || "";
    const currentAppointment: Appointment | undefined = appointments.find(appointment => appointment.id === urlId);
    const navigate = useNavigate();

    if (!currentAppointment) {
        return <div>Warnung: Termin nicht gefunden!</div>;
    }


    const [newDescription, setNewDescription] = useState<string>(currentAppointment.description);
    const [newStartTime, setNewStartTime] = useState<Date>(new Date(currentAppointment.startTime));
    const [newEndTime, setNewEndTime] = useState<Date>(new Date(currentAppointment.endTime));

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedStartTime = toZonedTime(newStartTime, timeZone);
    const zonedEndTime = toZonedTime(newEndTime, timeZone);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("bin im handleSubmit");

        if (zonedStartTime >= zonedEndTime) {
            alert("Die Endzeit muss nach der Startzeit liegen!");
            return;
        }

        const updatedAppointment: Appointment = {
            id: urlId,
            description: newDescription,
            startTime: newStartTime,
            endTime: newEndTime,
        };

        updateAppointment(urlId, updatedAppointment);
    };

    function handleCancel() {
        console.log("habe gecancled");
        navigate("/");
    }

    const formatDate = (date: Date) => {
        return date.toISOString().slice(0, 16);
    };

    return (

        <form className="appointment-form" onSubmit={handleSubmit}>
            <label className="form-entries">
                <p>Termin:</p>
                <input
                    type="text"
                    placeholder={currentAppointment.description}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                />
            </label>

            <label className="form-entries">
                <p>Start:</p>
                <input
                    type="datetime-local"
                    value={formatDate(zonedStartTime)}
                    onChange={(e) => setNewStartTime(new Date(e.target.value))}
                />
            </label>
            <label className="form-entries">
                <p> Ende:</p>
                <input
                    type="datetime-local"
                    value={formatDate(zonedEndTime)}
                    onChange={(e) => setNewEndTime(new Date(e.target.value))}
                />
            </label>

            <button type="submit">Fertig</button>
            <button onClick={handleCancel}>Abbrechen</button>
        </form>
)

}
