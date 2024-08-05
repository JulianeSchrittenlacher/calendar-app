import Header from "./components/Header.tsx";
import AppointmentGallery from "./components/AppointmentGallery.tsx";
import "./App.css"
import {Route, Routes} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage.tsx";
import useAppointmentStore from "./stores/useAppointmentStore.ts";
import {useEffect} from "react";
import useUserStore from "./stores/useUserStore.ts";
import MyFamilyPage from "./pages/MyFamilyPage.tsx";
import useFamilyStore from "./stores/useFamilyStore.ts";

export default function App() {
    const getAppointments: () => void = useAppointmentStore(state => state.getAppointments);
    const getUsers: () => void = useUserStore(state => state.getUsers);
    const getFamilies: () => void = useFamilyStore(state => state.getFamilies);
    const currentUser = useUserStore(state => state.currentUser);
    const currentFamily = useFamilyStore(state => state.currentFamily);


    useEffect(() => {
        getAppointments();
        getUsers();
        getFamilies()
    }, []);

    console.log(currentUser?.id);

    return (
        <>
            <Routes>
                <Route path="/" element={<WelcomePage/>}></Route>
                {currentFamily &&
                    <Route path={`/${currentFamily.id}/my-family-page`} element={<MyFamilyPage/>}></Route>}
                {currentUser && (
                    <>
                        <Route path={`/${currentUser.id}/shared-calendar`} element={
                            <>
                                <Header/>
                                <AppointmentGallery/>
                            </>
                        }></Route>
                        <Route path={`/${currentUser.id}/my-calendar`} element={
                            <>
                                <Header/>
                                <AppointmentGallery/>
                            </>
                        }></Route>
                    </>
                )}
            </Routes>
        </>
    )
}
