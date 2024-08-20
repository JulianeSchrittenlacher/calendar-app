import AppointmentCard from "./AppointmentCard";
import "../styles/Gallery.css";
import {Appointment} from "../types/Appointment.ts";
import useAppointmentStore from "../stores/useAppointmentStore.ts";
import useUserStore from "../stores/useUserStore.ts";
import {User} from "../types/User.ts";
import {useEffect, useState} from "react";
import AppointmentAddForm from "./AppointmentAddForm.tsx";
import Modal from "./Modal.tsx";

type AppointmentGalleryProps = {
    day: string;
}

export default function AppointmentGallery(props: Readonly<AppointmentGalleryProps>) {
    const appointments: Appointment[] = useAppointmentStore(state => state.appointments);
    const currentUser: User | null = useUserStore(state => state.currentUser);
    const getAppointments = useAppointmentStore(state => state.getAppointments);
    const [modalOpen, setModalOpen] = useState(false);

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getActualAppointments = (appointments: Appointment[], day: string): Appointment[] => {
        if (!currentUser) {
            return [];
        }

        const appointmentsForDay = appointments.filter(appointment => {
            const appointmentDate = formatDate(new Date(appointment.startTime));
            return appointmentDate === day;
        });

        return appointmentsForDay.sort((a, b) => {
            const dateA = new Date(a.startTime).getTime();
            const dateB = new Date(b.startTime).getTime();
            return dateA - dateB;
        });
    };

    const handleClick = () => {
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
    };


    useEffect(() => {
        currentUser && getAppointments(currentUser.familyId)
    }, []);

    return (
        <>
            <div className="gallery">
                <button onClick={handleClick}>Termin hinzufügen</button>
                {getActualAppointments(appointments, props.day).map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment}/>
                ))}
            </div>
            <Modal show={modalOpen} onClose={handleCloseModal}>
                <AppointmentAddForm onClose={handleCloseModal} day={props.day}/>
            </Modal>
        </>
    );
}
