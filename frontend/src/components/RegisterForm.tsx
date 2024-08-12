import {FormEvent, useState} from "react";
import {User} from "../types/User.ts";
import useUserStore from "../stores/useUserStore.ts";
import {Role} from "../types/Role.ts";
import "../styles/AppointmentForm.css"

type RegisterFormProps = {
    onClose: () => void;
}

export default function RegisterForm(props: Readonly<RegisterFormProps>) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<Role>(Role.CHILD);
    const [familyId, setFamilyId] = useState<string>("")
    const registerUser = useUserStore(state => state.registerUser);

    function submitRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newUser: User = {
            id: "",
            username: username,
            password: password,
            role,
            familyId: familyId,
        };
        registerUser(newUser);
        props.onClose();
    }

    return (
        <>
            <form className="user-form" onSubmit={submitRegister}>
                <label className="form-entries">
                    <p>Benutzername:</p>
                    <input
                        placeholder={""}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label className="form-entries">
                    <p>Passwort:</p>
                    <input value={password} placeholder={"Enter Password"} type={password}
                           onChange={e => setPassword(e.target.value)}/>
                </label>
                <label className="form-entries">
                    <p>Rolle:</p>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                    >
                        <option value={Role.ADULT}>Adult</option>
                        <option value={Role.CHILD}>Child</option>
                    </select>
                </label>
                <label className="form-entries">
                    <p>Familien Id:</p>
                    <input
                        placeholder={""}
                        type="text"
                        value={familyId}
                        onChange={(e) => setFamilyId(e.target.value)}
                    />
                </label>
                <div className="button-container">
                    <button onClick={props.onClose}>Abbrechen</button>
                    <button type="submit">Hinzufügen</button>
                </div>
            </form>
        </>
    );
}
