import {FormEvent, useState} from "react";
import {User} from "../types/User.ts";
import useUserStore from "../stores/useUserStore.ts";
import {Role} from "../types/Role.ts";
import "../styles/AppointmentForm.css"
import useFamilyStore from "../stores/useFamilyStore.ts";
import {Family} from "../types/Family.ts";

type RegisterFormProps = {
    onClose: () => void;
}

export default function RegisterForm(props: Readonly<RegisterFormProps>) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<Role>(Role.CHILD);
    const [familyId, setFamilyId] = useState<string>("");
    const [familyName, setFamilyName] = useState<string>("");
    const [state, setState] = useState<string>("");
    const registerUser = useUserStore(state => state.registerUser);
    const createFamily = useFamilyStore(state => state.createFamily);

    async function submitRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newUser: User = {
            id: "",
            username: username,
            password: password,
            role,
            familyId: familyId,
        };

        let registeredUser: User | undefined; // Declare it here with an initial value

        try {
            registeredUser = await registerUser(newUser);
            console.log("Registered User: ", registeredUser);
        } catch (error) {
            console.error("Registration failed: ", error);
            // Handle the error and potentially return or exit the function if necessary
            return; // You might want to return early if registration fails
        }

        console.log("FamilyName: ", familyName);

        // Now registeredUser is accessible here
        if (registeredUser && familyName) { // Check if registeredUser is defined
            const newFamily: Family = {
                familyId: registeredUser.familyId,
                familyName: familyName,
                state: state,
            };
            console.log("Neue Familie ", newFamily)

            createFamily(newFamily); // Assuming createFamily is async
        }


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
                <label className="form-entries">
                    <p>Neue Familie erstellen:</p>
                    <input
                        placeholder={""}
                        type="text"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                    />
                </label>
                <label className="form-entries">In welchem Bundesland wohnt ihr (für die korrekten Feiertage)
                    <select
                        className="form-select"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    >
                        <option value="">Bitte wählen...</option>
                        <option value="bw">Baden-Württemberg</option>
                        <option value="by">Bayern</option>
                        <option value="be">Berlin</option>
                        <option value="bb">Brandenburg</option>
                        <option value="hb">Bremen</option>
                        <option value="hh">Hamburg</option>
                        <option value="he">Hessen</option>
                        <option value="mv">Mecklenburg-Vorpommern</option>
                        <option value="ni">Niedersachsen</option>
                        <option value="nw">Nordrhein-Westfalen</option>
                        <option value="rp">Rheinland-Pfalz</option>
                        <option value="sl">Saarland</option>
                        <option value="sn">Sachsen</option>
                        <option value="st">Sachsen-Anhalt</option>
                        <option value="sh">Schleswig-Holstein</option>
                        <option value="th">Thüringen</option>
                    </select>
                </label>
                <div className="button-container">
                    <button onClick={props.onClose}>Abbrechen</button>
                    <button type="submit">Hinzufügen</button>
                </div>
            </form>
        </>
    );
}
