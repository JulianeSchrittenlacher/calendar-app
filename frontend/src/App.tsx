import Header from "./components/Header.tsx";
import AppointmentGallery from "./components/AppointmentGallery.tsx";
import "./App.css"
import {Route, Routes} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage.tsx";
import useAppointmentStore from "./stores/useAppointmentStore.ts";
import {useEffect} from "react";
import useUserStore from "./stores/useUserStore.ts";

export default function App() {
    const getAppointments: () => void = useAppointmentStore(state => state.getAppointments);
    const getUsers: () => void = useUserStore(state => state.getUsers);

    useEffect(() => {
        getAppointments();
        getUsers();
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<WelcomePage/>}></Route>
                <Route path="/shared-calendar" element={
                    <>
                        <Header/>
                        <AppointmentGallery/>
                    </>
                }>
                </Route>
            </Routes>
        </>
    )
}
