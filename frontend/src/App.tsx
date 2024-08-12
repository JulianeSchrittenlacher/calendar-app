import Header from "./components/Header.tsx";
import AppointmentGallery from "./components/AppointmentGallery.tsx";
import "./App.css"
import {Route, Routes} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage.tsx";
import MyFamilyPage from "./pages/MyFamilyPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx"
import {useEffect} from "react";
import useUserStore from "./stores/useUserStore.ts";
import useAppointmentStore from "./stores/useAppointmentStore.ts";

export default function App() {
    const getUsers = useUserStore(state => state.getUsers);
    const currentUser = useUserStore(state => state.currentUser);
    const getAppointments = useAppointmentStore(state => state.getAppointments);
    useEffect(() => {
        currentUser && getUsers(currentUser.familyId);
        currentUser && getAppointments(currentUser.familyId)
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<WelcomePage/>}></Route>
                <Route element={<ProtectedRoute/>}>
                    <Route path={`/my-family-page`} element={<MyFamilyPage/>}></Route>
                    <Route path={`/shared-calendar`} element={
                        <>
                            <Header/>
                            <AppointmentGallery/>
                        </>
                    }></Route>
                    <Route path={`/my-calendar`} element={
                        <>
                            <Header/>
                            <AppointmentGallery/>
                        </>
                    }></Route>
                </Route>
            </Routes>
        </>
    )
}
