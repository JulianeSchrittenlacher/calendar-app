import Header from "./components/Header.tsx";
import AppointmentGallery from "./components/AppointmentGallery.tsx";
import "./App.css"
import {Route, Routes} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage.tsx";
import useAppointmentStore from "./stores/useAppointmentStore.ts";
import {useEffect} from "react";

export default function App() {
    const getAppointments: () => void = useAppointmentStore(state => state.getAppointments);

    useEffect(() => {
        getAppointments();
    }, []);

    return (
        <>
            <Routes>
                <Route path="/welcome" element={<WelcomePage/>}></Route>
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
