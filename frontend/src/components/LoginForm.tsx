import {FormEvent, useState} from "react";
import useUserStore from "../stores/useUserStore.ts";
import "../styles/AppointmentForm.css"
import {useNavigate} from "react-router-dom";

type LoginFormProps = {
    onClose: () => void;
}

export default function LoginForm(props: Readonly<LoginFormProps>) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const loginUser = useUserStore(state => state.loginUser);
    const navigate = useNavigate();

    async function submitLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const user = await loginUser(username, password);
            console.log("Aktuell eingeloggt user: ", user);
            const latestCurrentUser = useUserStore.getState().currentUser;
            console.log("Aktuell eingeloggt currentUser: ", latestCurrentUser);
            props.onClose();
            navigate(`/my-family-page`);
        } catch (error) {
            console.error("Login failed:", error);
        }
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
