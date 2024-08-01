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

const useAppointmentStore = create<AppointmentState>()((set) => ({
    appointments: [],
    getAppointments: () => {
        axios.get("api/calendar").then(response => {
            set({appointments: response.data})
        }).catch(error => console.log(error))
    },
    createAppointment: (newAppointment) => {
        axios.post("api/calendar/create", newAppointment).then(response => {
            set(state => ({
                appointments: [...state.appointments, response.data]
            }));
            alert("Termin erfolgreich erstellt.");
        })
            .catch(error => console.log(error))
    },
    deleteAppointment: (id) => {
        axios.delete(`api/calendar/${id}`)
            .then(() => {
                set(state => ({
                    appointments: state.appointments.filter(appointment => appointment.id !== id)
                }));
                alert("Termin gelöscht.")
            })
            .catch(error => console.log(error));
    },
    updateAppointment: (id, updatedAppointment) => {
        axios.put(`api/calendar/${id}`, updatedAppointment).then(response => {
            set((state) => ({
                appointments: state.appointments.map(appointment => appointment.id === id ? response.data : appointment)
            }));
            alert("Termin geändert!");
        })
            .catch(error => console.log("Error updating Appointment " + error))
    }
}))

export default useAppointmentStore;