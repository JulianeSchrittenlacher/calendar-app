import React, { useState } from "react";
import { Appointment } from "../types/Appointment";
import { toZonedTime} from 'date-fns-tz';
import "../styles/AppointmentForm.css"
import {Params, useNavigate, useParams} from "react-router-dom";
import {format, parseISO} from "date-fns";

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

    function formatDate(inputDate?: Date): string {
        if (!inputDate) {
            inputDate = new Date();
        }
        return format(inputDate, "yyyy-MM-dd'T'HH:mm");
    }

    const [newDescription, setNewDescription] = useState<string>(currentAppointment ? currentAppointment.description : "");
    const [newStartTime, setNewStartTime] = useState<string>(currentAppointment ? formatDate(currentAppointment.startTime): formatDate(new Date()));
    const [newEndTime, setNewEndTime] = useState<string>(currentAppointment ? formatDate(currentAppointment.endTime): formatDate(new Date()));

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
            id: urlId,
            description: newDescription,
            startTime: zonedStartTime,
            endTime: zonedEndTime,
        };

        updateAppointment(urlId, updatedAppointment);
        navigate("/");
    };

    function handleCancel() {
        navigate("/");
    }

    if (!currentAppointment) {
        return <div>Warnung: Termin nicht gefunden!</div>;
    }

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
                <button onClick={handleCancel}>Abbrechen</button>
                <button type="submit">Fertig</button>
            </div>


        </form>
    )

}
