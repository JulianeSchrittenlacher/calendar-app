import AppointmentCard from "./AppointmentCard";
import "../styles/Gallery.css";
import {Appointment} from "../types/Appointment.ts";
import useAppointmentStore from "../stores/useAppointmentStore.ts";

export default function AppointmentGallery() {
    const appointments: Appointment[] = useAppointmentStore(state => state.appointments);

    return (
        <div className="gallery">
            {appointments
                .sort((a, b) => {
                    const dateA = new Date(a.startTime).getTime();
                    const dateB = new Date(b.startTime).getTime();
                    return dateA - dateB;
                })
                .map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment}/>
                ))
            }
        </div>
    );
}
