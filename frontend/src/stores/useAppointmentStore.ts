import {Appointment} from "../types/Appointment.ts";
import {create} from "zustand";
import axios from "axios";

interface AppointmentState {
    appointments: Appointment[];
    getAppointments: () => void;
    createAppointment: (newAppointment: Appointment) => void;
    deleteAppointment: (id: string) => void;
    updateAppointment: (id: string, updatedAppointment: Appointment) => void;
}

const useAppointmentStore = create<AppointmentState>()((set, get) => ({
    appointments: [],
    getAppointments: () => {
        axios.get("api/calender").then(response => {
            set(({appointments: response.data}))
        }).catch(error => console.log(error))
    },
    createAppointment: (newAppointment) => {
        axios.post("api/calender/create", newAppointment).then(response => {
            set(state => ({
                appointments: [...state.appointments, response.data]
            }));
        })
            .then(() => {
                get().getAppointments();
                alert("Termin erfolgreich erstellt.");
            }).catch(error => console.log(error))
    },
    deleteAppointment: (id) => {
        axios.delete(`api/calender/${id}`)
            .then(() => {
                alert("Termin gelöscht.")
            })
            .catch(error => console.log(error));
    },
    updateAppointment: (id, updatedAppointment) => {
        axios.put(`api/calender/${id}`, updatedAppointment).then(response => {
            set((state) => ({
                appointments: state.appointments.map(appointment => updatedAppointment.id === id ? response.data : appointment)
            }));
        })
            .then(() => {
                get().getAppointments();
                alert("Termin geändert!");
            })
            .catch(error => console.log("Error updating Appointment " + error))
    }
}))

export default useAppointmentStore;