import { Appointment } from "../types/Appointment";
import { DateOptions } from "../types/DateOptions";
import "../styles/AppointmentCard.css";
import Modal from './Modal';
import AppointmentEditForm from './AppointmentEditForm';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function isIsoDateString(value: string): boolean {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))?$/;
    return isoDatePattern.test(value);
}

type AppointmentCardProps = Appointment & {
    deleteAppointment: (id: string) => void;
    updateAppointment: (id: string, updatedAppointment: Appointment) => void;
}

export default function AppointmentCard(props: Readonly<AppointmentCardProps>) {
    const { id, description, startTime, endTime, deleteAppointment, updateAppointment } = props;

    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const parseDate = (date: string | Date): Date => {
        return typeof date === 'string' && isIsoDateString(date) ? new Date(date) : new Date(date.toString());
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleString('de-DE', DateOptions);
    };

    const startDate = parseDate(startTime);
    const endDate = parseDate(endTime);

    const handleEdit = () => {
        setModalOpen(true);
        navigate(`/edit/${id}`);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        navigate('/');
    };

    return (
        <article className="appointment-card">
            <p className="appointment-description">{description}</p>
            <p>Beginn: {formatDate(startDate)}</p>
            <p>Ende: {formatDate(endDate)}</p>
            <div className="card-button-container">
                <button onClick={() => deleteAppointment(id)}>Löschen</button>
                <button onClick={handleEdit}>Bearbeiten</button>
            </div>

            <Modal show={modalOpen} onClose={handleCloseModal}>
                <AppointmentEditForm
                    appointment={props}
                    updateAppointment={updateAppointment}
                    onClose={handleCloseModal}
                />
            </Modal>
        </article>
    );
}
