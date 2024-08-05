import {User} from "../types/User.ts";
import React, {useState} from "react";
import {Role} from "../types/Role.ts";
import useUserStore from "../stores/useUserStore.ts";
import {Family} from "../types/Family.ts";
import useFamilyStore from "../stores/useFamilyStore.ts";

type UserAddFormProps = {
    onClose: () => void;
}

export default function UserAddForm(props: Readonly<UserAddFormProps>) {
    const {onClose} = props;

    const createUser: (newUser: User, familyId: string) => void = useUserStore(state => state.createUser);
    const currentFamily: Family | null = useFamilyStore(state => state.currentFamily);

    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<Role>(Role.CHILD);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentFamily) {
            const newUser: User = {
                id: "",
                name,
                role,
                familyId: currentFamily.id,
            }
            createUser(newUser, currentFamily.id);
        }

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
                <div className="button-container">
                    <button onClick={onClose}>Abbrechen</button>
                    <button type="submit">Hinzufügen</button>
                </div>
            </form>
        </>
    );
}
