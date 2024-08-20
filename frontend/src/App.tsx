import Header from "./components/Header.tsx";
import "./App.css"
import {Route, Routes} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage.tsx";
import MyFamilyPage from "./pages/MyFamilyPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx"
import CalendarTable from "./components/CalendarTable.tsx";

export default function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<WelcomePage/>}></Route>
                <Route element={<ProtectedRoute/>}>
                    <Route path={`/my-family-page`} element={<MyFamilyPage/>}></Route>
                    <Route path={"/calendar"} element={
                        <>
                            <Header/>
                            <CalendarTable/>
                        </>
                    }></Route>
                </Route>
            </Routes>
        </>
    )
}
