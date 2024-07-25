import {User} from "../types/User.ts";
import React, {useState} from "react";
import {Role} from "../types/Role.ts";

type WelcomePageProps = {
    createUser: (newUser: User) => void,
};

export default function WelcomePage(props: Readonly<WelcomePageProps>) {
    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<Role>(Role.CHILD);
    const [familyId, setFamilyId] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newUser: User = {
            id: "",
            name,
            role,
            familyId,
        }
        props.createUser(newUser);
    }

    return (
        <form className="user-form" onSubmit={handleSubmit}>
            <label className="form-entries">
                <p>Name:</p>
                <input
                    placeholder={""}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <p> FamilyId</p>
                <input
                    type="text"
                    value={familyId}
                    onChange={(e) => setFamilyId(e.target.value)}
                />
            </label>
            <button type="submit">Hinzufügen</button>
        </form>
    );
}

