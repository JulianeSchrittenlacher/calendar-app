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
    const [newName, setNewName] = useState<string>(family.familyName);
    const [newState, setNewState] = useState<string>(family.state);
    const getAndSetCurrentFamily = useFamilyStore(state => state.getAndSetCurrentFamily);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedFamily: Family = {
            familyId: family.familyId,
            familyName: newName,
            state: newState,
        };

        updateFamily(family.familyId, updatedFamily);
        getAndSetCurrentFamily(family.familyId)
        onClose();
    }

    return (
        <form className="appointment-form" onSubmit={handleSubmit}>
            <label className="form-entries">
                <p>Name:</p>
                <input
                    type="text"
                    placeholder={family.familyName}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}/>
            </label>
            <label className="form-entries">In welchem Bundesland wohnt ihr (für die korrekten Feiertage)
                <select
                    className="form-select"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
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
                <button onClick={onClose}>Abbrechen</button>
                <button type="submit">Fertig</button>
            </div>
        </form>
    );
}
