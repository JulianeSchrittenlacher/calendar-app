import {Appointment} from "../types/Appointment.ts";
import AppointmentCard from "./AppointmentCard.tsx";

type GalleryProps = {
    appointments: Appointment[];
}
export default function Gallery(props: Readonly<GalleryProps>) {
    return (
        <>
            <div className="gallery">
                {
                    props.appointments.map(appointment => (
                        <AppointmentCard key={appointment.id} appointment={appointment}/>
                    ))
                }
            </div>
        </>
    );
}
