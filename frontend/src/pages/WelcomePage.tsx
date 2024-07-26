import {User} from "../types/User.ts";
import Header from "../components/Header.tsx";
import UserGallery from "../components/UserGallery.tsx";
import {Appointment} from "../types/Appointment.ts";

type WelcomePageProps = {
    createUser: (newUser: User) => void,
    createAppointment: (newAppointment: Appointment) => void,
    updateAppointment: (id: string, updatedAppointment: Appointment) => void,
};

export default function WelcomePage(props: Readonly<WelcomePageProps>) {
    const {createUser, createAppointment, updateAppointment} = props;
    return (
        <>
            <Header createAppointment={createAppointment} updateAppointment={updateAppointment}></Header>
            <UserGallery></UserGallery>
        </>
    );
}

