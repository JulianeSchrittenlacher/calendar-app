import { Appointment } from "../types/Appointment";
import AppointmentCard from "./AppointmentCard";
import "../styles/Gallery.css";

type GalleryProps = {
    appointments: Appointment[];
};

export default function Gallery(props: Readonly<GalleryProps>) {
    return (
        <div className="gallery">
            {props.appointments
                .sort((a, b) => {
                    const dateA = new Date(a.startTime).getTime();
                    const dateB = new Date(b.startTime).getTime();
                    return dateA - dateB;
                })
                .map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
            }
        </div>
    );
}
