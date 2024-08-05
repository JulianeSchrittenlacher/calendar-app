import React, {useState} from "react";
import {Appointment} from "../types/Appointment";
import {format, parseISO} from 'date-fns';
import {toZonedTime} from 'date-fns-tz';
import "../styles/AppointmentForm.css"
import useAppointmentStore from "../stores/useAppointmentStore.ts";
import useUserStore from "../stores/useUserStore.ts";
import {User} from "../types/User.ts";
import UserSelector from "./UserSelector.tsx";

type AppointmentAddFormProps = {
    onClose: () => void;
}

export default function AppointmentAddForm(props: Readonly<AppointmentAddFormProps>) {

    const createAppointment: (newAppointment: Appointment) => void = useAppointmentStore(state => state.createAppointment);
    const users: User[] = useUserStore(state => state.users);

    const [description, setDescription] = useState<string>("");
    const [startTime, setStartTime] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    const [endTime, setEndTime] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const startDate = parseISO(startTime);
        const endDate = parseISO(endTime);

        const zonedStartTime = toZonedTime(startDate, timeZone);
        const zonedEndTime = toZonedTime(endDate, timeZone);

        if (zonedStartTime >= zonedEndTime) {
            alert("Die Endzeit muss nach der Startzeit liegen!");
            return;
        }

        const newAppointment: Appointment = {
            id: "",
            description,
            startTime: zonedStartTime,
            endTime: zonedEndTime,
            userIds: selectedUserIds,
        };

        createAppointment(newAppointment);
        props.onClose();
    };


    return (
        <form className="appointment-form" onSubmit={handleSubmit}>
            <label className="form-entries">
                <p>Termin:</p>
                <input
                    placeholder={""}
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <label className="form-entries">
                <p>Start:</p>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </label>
            <label className="form-entries">
                <p> Ende:</p>
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </label>
            <UserSelector
                users={users}
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
            />
            <div className="button-container">
                <button onClick={props.onClose}>Abbrechen</button>
                <button type="submit">Hinzufügen</button>
            </div>

        </form>
    );
}
