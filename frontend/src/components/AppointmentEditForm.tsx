import React, {useState} from "react";
import {Appointment} from "../types/Appointment";
import {toZonedTime} from 'date-fns-tz';
import "../styles/AppointmentForm.css"
import {format, parseISO} from "date-fns";
import useAppointmentStore from "../stores/useAppointmentStore.ts";
import {User} from "../types/User.ts";
import useUserStore from "../stores/useUserStore.ts";
import UserSelector from "./UserSelector.tsx";

type AppointmentEditFormProps = {
    appointment: Appointment;
    onClose: () => void;
};
export default function AppointmentEditForm(props: Readonly<AppointmentEditFormProps>) {

    const {appointment, onClose} = props;

    const updateAppointment: (id: string, updatedAppointment: Appointment) => void = useAppointmentStore(state => state.updateAppointment);
    const users: User[] = useUserStore(state => state.users);

    function formatDate(inputDate?: Date): string {
        if (!inputDate) {
            inputDate = new Date();
        }
        return format(inputDate, "yyyy-MM-dd'T'HH:mm");
    }

    const [newDescription, setNewDescription] = useState<string>(appointment ? appointment.description : "");
    const [newStartTime, setNewStartTime] = useState<string>(appointment ? formatDate(appointment.startTime) : formatDate(new Date()));
    const [newEndTime, setNewEndTime] = useState<string>(appointment ? formatDate(appointment.endTime) : formatDate(new Date()));
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>(appointment.userIds);

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
            userIds: selectedUserIds,
        };

        updateAppointment(appointment.id, updatedAppointment);
        onClose();
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
            <UserSelector
                users={users}
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
            />
            <div className="button-container">
                <button type="button" onClick={onClose}>Abbrechen</button>
                <button type="submit">Fertig</button>
            </div>
        </form>
    )

}
