import {Family} from "../types/Family.ts";
import useFamilyStore from "../stores/useFamilyStore.ts";
import React, {useState} from "react";

type FamilyEditFormProps = {
    family: Family;
    onClose: () => void;
}
export default function FamilyEditForm(props: Readonly<FamilyEditFormProps>) {
    const {family, onClose} = props;
    const updateFamily: (id: string, updatedFamily: Family) => void = useFamilyStore(state => state.updateFamily);
    const [newName, setNewName] = useState<string>(family.name);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedFamily: Family = {
            id: family.id,
            name: newName,
        };

        updateFamily(family.id, updatedFamily);
        onClose();
    }

    return (
        <form className="appointment-form" onSubmit={handleSubmit}>
            <label className="form-entries">
                <p>Name:</p>
                <input
                    type="text"
                    placeholder={family.name}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}/>
            </label>
            <div className="button-container">
                <button onClick={onClose}>Abbrechen</button>
                <button type="submit">Fertig</button>
            </div>
        </form>
    );
}
