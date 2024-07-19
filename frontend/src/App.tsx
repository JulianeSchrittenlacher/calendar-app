import './App.css'
import axios from "axios";
import Header from "./components/Header.tsx";
import {Appointment} from "./types/Appointment.ts";

export default function App() {

  function createAppointment(newAppointment:Appointment) {

    axios.post("/api/calender/create", newAppointment)
        .then(() => {
            alert("Termin erfolgreich erstellt!");
          {/*getAppointments();*/}
        })
        .catch(error => console.log(error));
  }

  return (
    <>
      <Header createAppointment={createAppointment}></Header>
    </>
  )
}
