import { Appointment } from "../types/Appointment";
import AppointmentCard from "./AppointmentCard";
import "../styles/Gallery.css";

type GalleryProps = {
    appointments: Appointment[];
    deleteAppointment: (id: string) => void;
};

export default function Gallery({appointments, deleteAppointment}: Readonly<GalleryProps>) {
    return (
        <div className="gallery">
            {appointments
                .sort((a, b) => {
                    const dateA = new Date(a.startTime).getTime();
                    const dateB = new Date(b.startTime).getTime();
                    return dateA - dateB;
                })
                .map(appointment => (
                    <AppointmentCard key={appointment.id}
                                     id={appointment.id}
                                    description={appointment.description}
                                    startTime={appointment.startTime}
                                    endTime={appointment.endTime}
                                    deleteAppointment={deleteAppointment}/>
                ))
            }
        </div>
    );
}
