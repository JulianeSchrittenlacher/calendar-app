import AppointmentCard from "./AppointmentCard";
import "../styles/Gallery.css";
import {Appointment} from "../types/Appointment.ts";
import useAppointmentStore from "../stores/useAppointmentStore.ts";
import useUserStore from "../stores/useUserStore.ts";
import {User} from "../types/User.ts";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";

export default function AppointmentGallery() {
    const appointments: Appointment[] = useAppointmentStore(state => state.appointments);
    const currentUser: User | null = useUserStore(state => state.currentUser);
    const location = useLocation();
    const getAppointments = useAppointmentStore(state => state.getAppointments);

    const getActualAppointments = (appointments: Appointment[]): Appointment[] => {
        if (!currentUser) {
            return [];
        } else if (location.pathname === `/${currentUser.id}/shared-calendar`) {
            return appointments
                .sort((a, b) => {
                    const dateA = new Date(a.startTime).getTime();
                    const dateB = new Date(b.startTime).getTime();
                    return dateA - dateB;
                });
        } else if (location.pathname === `/${currentUser.id}/my-calendar`) {
            return appointments
                .filter(appointment => appointment.userIds.includes(currentUser.id))
                .sort((a, b) => {
                    const dateA = new Date(a.startTime).getTime();
                    const dateB = new Date(b.startTime).getTime();
                    return dateA - dateB;
                });
        } else {
            return [];
        }
    };

    useEffect(() => {
        currentUser && getAppointments(currentUser.familyId)
    }, []);

    return (
        <div className="gallery">
            {getActualAppointments(appointments).map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment}/>
            ))}
        </div>
    );
}
