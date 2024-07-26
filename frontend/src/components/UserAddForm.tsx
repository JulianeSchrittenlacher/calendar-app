import {User} from "../types/User.ts";
import React, {useState} from "react";
import {Role} from "../types/Role.ts";

type UserAddFormProps = {
    createUser: (newUser: User) => void;
    onClose: () => void;
}

export default function UserAddForm(props: Readonly<UserAddFormProps>) {
    const {createUser, onClose} = props;
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
        createUser(newUser);
        onClose();
    }
    return (
        <>
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
                <div className="button-container">
                    <button onClick={onClose}>Abbrechen</button>
                    <button type="submit">Hinzufügen</button>
                </div>
            </form>
        </>
    );
}
