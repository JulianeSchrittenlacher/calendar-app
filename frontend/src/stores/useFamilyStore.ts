import {Family} from "../types/Family.ts";
import {create} from "zustand";
import axios from "axios";

interface FamilyState {
    families: Family[];
    currentFamily: Family | null;
    setCurrentFamily: (family: Family | null) => void;
    getFamilies: () => void;
    createFamily: (newFamily: Family) => void;
    deleteFamily: (id: string) => void;
    updateFamily: (id: string, updatedFamily: Family) => void;
}

const useFamilyStore = create<FamilyState>()((set) => ({
    families: [],
    currentFamily: JSON.parse(localStorage.getItem('currentFamily') || 'null'),
    setCurrentFamily: (family: Family | null) => {
        set({currentFamily: family});
        localStorage.setItem('currentFamily', JSON.stringify(family));
    },
    getFamilies: () => {
        axios.get("/api/family").then(response => {
            set({families: response.data});
        }).catch(error => console.log(error))
    },
    createFamily: (newFamily: Family) => {
        axios.post("/api/family/create", newFamily).then(response => {
            set(state => ({
                families: [...state.families, response.data]
            }));
            alert("Familie erfolgreich erstellt.")
        }).catch(error => console.log(error))
    },
    deleteFamily: (id: string) => {
        axios.delete(`/api/family/${id}`).then(() => {
            set(state => ({
                families: state.families.filter(family => family.id !== id)
            }));
            alert("Familie gelöscht.")
        }).catch(error => console.log(error));
    },
    updateFamily: (id: string, updatedFamily: Family) => {
        axios.put(`/api/family/${id}`, updatedFamily).then(response => {
            set(state => {
                const updatedFamilies: Family[] = state.families.map(family => family.id === id ? response.data : family);
                return {families: updatedFamilies};
            });
            alert("Familie geändert.")
        }).catch(error => console.log(error))
    },
}))
export default useFamilyStore;