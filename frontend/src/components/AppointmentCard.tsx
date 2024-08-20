import {Appointment} from "../types/Appointment";
import "../styles/AppointmentCard.css";
import Modal from './Modal';
import AppointmentEditForm from './AppointmentEditForm';
import {useState} from "react";
import useAppointmentStore from "../stores/useAppointmentStore.ts";
import useUserStore from "../stores/useUserStore.ts";
import {User} from "../types/User.ts";

function isIsoDateString(value: string): boolean {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))?$/;
    return isoDatePattern.test(value);
}

type AppointmentCardProps = {
    appointment: Appointment;
}

export default function AppointmentCard(props: Readonly<AppointmentCardProps>) {
    const deleteAppointment: (id: string) => void = useAppointmentStore(state => state.deleteAppointment);
    const users: User[] | null = useUserStore(state => state.users);


    const [modalOpen, setModalOpen] = useState(false);

    const parseDate = (date: string | Date): Date => {
        return typeof date === 'string' && isIsoDateString(date) ? new Date(date) : new Date(date.toString());
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
    };

    const startDate = parseDate(props.appointment.startTime);
    const endDate = parseDate(props.appointment.endTime);

    const handleEdit = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <article className="appointment-card">
            <p className="appointment-text">{props.appointment.description}</p>
            <p className="appointment-text">{formatDate(startDate)} bis {formatDate(endDate)}</p>
            <p className="appointment-text">Teilnehmer: {users && users.filter(user => props.appointment.userIds.includes(user.id))
                .map(user => user.username)
                .join(', ')}</p>
            <div className="card-button-container">
                <button onClick={() => deleteAppointment(props.appointment.id)}>Löschen</button>
                <button onClick={handleEdit}>Bearbeiten</button>
            </div>

            <Modal show={modalOpen} onClose={handleCloseModal}>
                <AppointmentEditForm
                    appointment={props.appointment}
                    onClose={handleCloseModal}
                />
            </Modal>
        </article>
    );
}
