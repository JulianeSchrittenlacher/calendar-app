import {Family} from "../types/Family.ts";
import {create} from "zustand";
import axios from "axios";

interface FamilyState {
    currentFamily: Family | null;
    getAndSetCurrentFamily: (familyId: string) => void;
    clearCurrentFamily: () => void;
    createFamily: (newFamily: Family) => void;
    deleteFamily: (id: string) => void;
    updateFamily: (id: string, updatedFamily: Family) => void;
}

const useFamilyStore = create<FamilyState>()((set) => ({
    currentFamily: JSON.parse(localStorage.getItem('currentFamily') || 'null'),
    clearCurrentFamily: () => {
        set({currentFamily: null});
        localStorage.removeItem('currentFamily');
    },
    getAndSetCurrentFamily: (familyId: string) => {
        axios.get(`/api/family/${familyId}`).then(response => {
            const family = response.data;
            set({currentFamily: family});
            localStorage.setItem('currentFamily', JSON.stringify(family));
        }).catch(error => {
            console.error("Error fetching family data:", error);
        });
    },
    createFamily: (newFamily: Family) => {
        axios.post("/api/family/create", newFamily).then(() => {
            alert("Familie angelegt..")
        }).catch(error => console.log(error))
    },
    deleteFamily: (id: string) => {
        axios.delete(`/api/family/${id}`).then(() => {
            alert("Familie gelöscht.")
            set({currentFamily: null});
            localStorage.removeItem('currentFamily');
        }).catch(error => console.log(error));
    },
    updateFamily: (id: string, updatedFamily: Family) => {
        axios.put(`/api/family/${id}`, updatedFamily).then(() => {
            alert("Familieninformationen geändert.")
        }).catch(error => console.log(error))
    },
}))
export default useFamilyStore;