import axios from "axios";
import Header from "./components/Header.tsx";
import {Appointment} from "./types/Appointment.ts";
import Gallery from "./components/Gallery.tsx";
import {useEffect, useState} from "react";
import "./App.css"
import {Route, Routes} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage.tsx";
import {User} from "./types/User.ts";

export default function App() {

    const [appointments, setAppointments] = useState<Appointment[]>([]);

    function getAppointments() {
        axios.get("/api/calender")
            .then(response => setAppointments(response.data))
            .catch(error => console.log(error))

    }

    function createAppointment(newAppointment: Appointment) {
        axios.post("/api/calender/create", newAppointment)
            .then(() => {
                alert("Termin erfolgreich erstellt.");
                getAppointments();
            })
            .catch(error => console.log(error));
    }

    function deleteAppointment(id: string) {
        axios.delete(`/api/calender/${id}`)
            .then(() => {
                alert("Termin gelöscht.")
                getAppointments();
            })
            .catch(error => console.log(error));
    }

    function updateAppointment(id: string, updatedAppointment: Appointment) {
        axios.put("/api/calender/" + id, updatedAppointment)
            .then(() => {
                alert("Termin geändert!");
                getAppointments();
            })
            .catch(error => console.log("Error updating Appointment " + error))
    }

    function createUser(newUser: User) {
        axios.post("/api/user/create", newUser)
            .then(() => {
                alert("User erfolgreich erstellt.");
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        getAppointments()
    }, []);

    return (
        <>
            <Routes>
                <Route path="/welcome" element={<WelcomePage createUser={createUser}></WelcomePage>}></Route>
                <Route path="/" element={
                    <>
                        <Header createAppointment={createAppointment} updateAppointment={updateAppointment}></Header>
                        <Gallery appointments={appointments} deleteAppointment={deleteAppointment}
                                 updateAppointment={updateAppointment}></Gallery>
                    </>
                }></Route>
            </Routes>
        </>
    )
}
