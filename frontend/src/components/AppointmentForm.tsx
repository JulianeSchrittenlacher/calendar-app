import React, { useState } from "react";
import { Appointment } from "../types/Appointment";
import { format, parseISO } from 'date-fns';
import { toZonedTime} from 'date-fns-tz';

type AppointmentFormProps = {
    createAppointment: (newAppointment: Appointment) => void,
};

export default function AppointmentForm(props: AppointmentFormProps) {
    const [description, setDescription] = useState<string>("");
    const [startTime, setStartTime] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    const [endTime, setEndTime] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const startDate = parseISO(startTime);
        const endDate = parseISO(endTime);

        const zonedStartTime = toZonedTime(startDate, timeZone);
        const zonedEndTime = toZonedTime(endDate, timeZone);

        // Validierung: Endzeit muss nach Startzeit liegen
        if (zonedStartTime >= zonedEndTime) {
            alert("Die Endzeit muss nach der Startzeit liegen!");
            return;
        }

        const newAppointment: Appointment = {
            id: "",
            description,
            startTime: zonedStartTime,
            endTime: zonedEndTime,
        };

        props.createAppointment(newAppointment);
    };

    return (
        <form className="appointment-form" onSubmit={handleSubmit}>
            <label>
                Termin:
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <br />
            <label>
                Start:
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </label>
            <br />
            <label>
                Ende:
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </label>
            <br />
            <button type="submit">Hinzufügen</button>
        </form>
    );
}
