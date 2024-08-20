import useUserStore from "../stores/useUserStore.ts";
import {Navigate, Outlet} from "react-router-dom";

export default function ProtectedRoute() {
    const currentUser = useUserStore(state => state.currentUser);
    return (
        <>
            {currentUser && currentUser.username !== "anonymousUser" ? <Outlet/> : <Navigate to={"/"}/>}
        </>
    );
}
