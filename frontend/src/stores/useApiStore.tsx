import {create} from "zustand";
import axios from "axios";
import {Holiday} from "../types/Holiday.ts";

interface ApiState {
    holidaysOfCurrentYear: Holiday[];
    setHolidaysOfCurrentYear: (holidays: Holiday[]) => void;
    getHolidaysOfCurrentYear: (year: string, state: string) => void;
    currentState: string;
    setCurrentState: (newState: string) => void;
}

const useApiStore = create<ApiState>()((set) => ({
    holidaysOfCurrentYear: [],
    setHolidaysOfCurrentYear: (holidays: Holiday[]) => {
        set({holidaysOfCurrentYear: holidays})
    },
    getHolidaysOfCurrentYear: async (year: string, state: string) => {
        try {
            const response = await axios.get<Holiday[]>(`/api/holidays/${year}/${state}`);
            set({holidaysOfCurrentYear: response.data});
        } catch (error) {
            console.error("Failed to fetch holidays:", error);
        }
    },
    currentState: "sh",
    setCurrentState: (newState: string) => {
        set({currentState: newState})
    },
}))

export default useApiStore;