import axios from "axios";
import Header from "./components/Header.tsx";
import {Appointment} from "./types/Appointment.ts";
import Gallery from "./components/Gallery.tsx";
import {useEffect, useState} from "react";

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
                alert("Termin erfolgreich erstellt!");
                getAppointments();
            })
            .catch(error => console.log(error));
    }

  useEffect(() => {
    getAppointments()
  }, []);

    return (
        <>
            <Header createAppointment={createAppointment}></Header>
            <Gallery appointments={appointments}></Gallery>
        </>
    )

}
