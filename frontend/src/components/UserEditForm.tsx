import {User} from "../types/User.ts";
import useUserStore from "../stores/useUserStore.ts";
import React, {useState} from "react";
import {Role} from "../types/Role.ts";

type UserEditFormProps = {
    user: User;
    onClose: () => void;
}
export default function UserEditForm(props: Readonly<UserEditFormProps>) {
    const {user, onClose} = props;

    const updateUser: (id: string, updatedUser: User) => void = useUserStore(state => state.updateUser);
    const [newName, setNewName] = useState<string>(user.username);
    const [newRole, setNewRole] = useState<Role>(user.role);
    const [newFamilyId, setNewFamilyId] = useState<string>(user.familyId);
    const [newPassword, setNewPassword] = useState<string>(user.password);
    const [newFamilyName] = useState<string>(user.familyName);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedUser: User = {
            id: user.id,
            username: newName,
            password: newPassword,
            role: newRole,
            familyId: newFamilyId,
            familyName: newFamilyName
        };

        updateUser(user.id, updatedUser);
        onClose();
    }

    return (
        <form className="appointment-form" onSubmit={handleSubmit}>
            <label className="form-entries">
                <p>Name:</p>
                <input
                    type="text"
                    placeholder={user.username}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </label>
            <label className="form-entries">
                <p>Passwort:</p>
                <input
                    type="password"
                    placeholder={user.password}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </label>
            <label className="form-entries">
                <p>Rolle:</p>
                <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Role)}
                >
                    <option value={Role.ADULT}>Adult</option>
                    <option value={Role.CHILD}>Child</option>
                </select>
            </label>
            <label className="form-entries">
                <p> Familien-Id:</p>
                <input
                    type="text"
                    value={newFamilyId}
                    onChange={(e) => setNewFamilyId(e.target.value)}
                />
            </label>
            <div className="button-container">
                <button onClick={onClose}>Abbrechen</button>
                <button type="submit">Fertig</button>
            </div>
        </form>
    );
}
