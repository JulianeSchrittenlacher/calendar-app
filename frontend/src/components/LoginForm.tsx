import {FormEvent, useState} from "react";
import useUserStore from "../stores/useUserStore.ts";
import "../styles/AppointmentForm.css"
import {useNavigate} from "react-router-dom";
import useFamilyStore from "../stores/useFamilyStore.ts";

type LoginFormProps = {
    onClose: () => void;
}

export default function LoginForm(props: Readonly<LoginFormProps>) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const loginUser = useUserStore(state => state.loginUser);
    const getUsers = useUserStore(state => state.getUsers);
    const navigate = useNavigate();
    const currentUser = useUserStore(state => state.currentUser);
    const getAndSetCurrentFamily = useFamilyStore(state => state.getAndSetCurrentFamily);
    const currentFamily = useFamilyStore(state => state.currentFamily);

    async function submitLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const user = await loginUser(username, password);
            console.log("Aktuell eingeloggt user: ", user);
            const latestCurrentUser = useUserStore.getState().currentUser;
            console.log("Aktuell eingeloggt currentUser: ", latestCurrentUser);
            if (latestCurrentUser?.familyId) {
                getAndSetCurrentFamily(latestCurrentUser.familyId);
                console.log("aktuelle Familie: ", currentFamily)
            } else {
                console.error("FamilyId not found for the current user.");
            }
            props.onClose();
            navigate(`/my-family-page`);
        } catch (error) {
            console.error("Login failed:", error);
        }
        currentUser && getUsers(currentUser.familyId);
        currentUser && getAndSetCurrentFamily(currentUser.familyId);
    }


    return (
        <>
            <form className="user-form" onSubmit={submitLogin}>
                <label className="form-entries">
                    <p>Benutzername:</p>
                    <input value={username} placeholder={"Please enter your Username"} type={"text"}
                           onChange={e => setUsername(e.target.value)}/>
                </label>
                <label className="form-entries">
                    <p>Passwort:</p>
                    <input value={password} placeholder={"Please enter your Password"} type={"password"}
                           onChange={e => setPassword(e.target.value)}/>
                </label>
                <div className="button-container">
                    <button onClick={props.onClose}>Abbrechen</button>
                    <button>Login</button>
                </div>
            </form>
        </>
    );
}
