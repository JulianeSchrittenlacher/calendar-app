import React, { useState } from "react";
import { Appointment } from "../types/Appointment";
import { toZonedTime} from 'date-fns-tz';
import "../styles/AppointmentForm.css"
import { useNavigate } from "react-router-dom";
import {format, parseISO} from "date-fns";

type AppointmentEditFormProps = {
    appointment: Appointment;
    updateAppointment: (id: string, updatedAppointment: Appointment) => void;
    onClose: () => void;
};
export default function AppointmentEditForm(props: Readonly<AppointmentEditFormProps>) {

    const { appointment, updateAppointment, onClose } = props;
    const navigate = useNavigate();

    function formatDate(inputDate?: Date): string {
        if (!inputDate) {
            inputDate = new Date();
        }
        return format(inputDate, "yyyy-MM-dd'T'HH:mm");
    }

    const [newDescription, setNewDescription] = useState<string>(appointment ? appointment.description : "");
    const [newStartTime, setNewStartTime] = useState<string>(appointment ? formatDate(appointment.startTime): formatDate(new Date()));
    const [newEndTime, setNewEndTime] = useState<string>(appointment ? formatDate(appointment.endTime): formatDate(new Date()));

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const startDate = parseISO(newStartTime);
        const endDate = parseISO(newEndTime);
        const zonedStartTime = toZonedTime(startDate, timeZone);
        const zonedEndTime = toZonedTime(endDate, timeZone);

        if (newStartTime >= newEndTime) {
            alert("Die Endzeit muss nach der Startzeit liegen!");
            return;
        }

        const updatedAppointment: Appointment = {
            id: appointment.id,
            description: newDescription,
            startTime: zonedStartTime,
            endTime: zonedEndTime,
        };

        updateAppointment(appointment.id, updatedAppointment);
        onClose();
        navigate("/");
    };

    if (!appointment) {
        return <div>Warnung: Termin nicht gefunden!</div>;
    }

    return (

        <form className="appointment-form" onSubmit={handleSubmit}>
            <label className="form-entries">
                <p>Termin:</p>
                <input
                    type="text"
                    placeholder={appointment.description}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                />
            </label>

            <label className="form-entries">
                <p>Start:</p>
                <input
                    type="datetime-local"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                />
            </label>
            <label className="form-entries">
                <p> Ende:</p>
                <input
                    type="datetime-local"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                />
            </label>

            <div className="button-container">
                <button onClick={onClose}>Abbrechen</button>
                <button type="submit">Fertig</button>
            </div>


        </form>
    )

}
