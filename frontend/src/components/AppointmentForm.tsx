import { useState } from "react";
import { Appointment } from "../types/Appointment.ts";

type AppointmentFormProps = {
    createAppointment: (newAppointment: Appointment) => void,
}

export default function AppointmentForm(props: Readonly<AppointmentFormProps>)  {
    const [description, setDescription] = useState<string>("");
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date());

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newAppointment: Appointment = {
            id: "",
            description,
            startTime,
            endTime,
        };

        props.createAppointment(newAppointment);
    }

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
                    value={startTime.toISOString().slice(0, 16)}
                    onChange={(e) => setStartTime(new Date(e.target.value))}
                />
            </label>
            <br />
            <label>
                Ende:
                <input
                    type="datetime-local"
                    value={endTime.toISOString().slice(0, 16)}
                    onChange={(e) => setEndTime(new Date(e.target.value))}
                />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
}
