import {Family} from "../types/Family.ts";
import useFamilyStore from "../stores/useFamilyStore.ts";
import {useState} from "react";
import useUserStore from "../stores/useUserStore.ts";
import {stateMap} from "../constants/states.ts";


type FamilyAddFromProps = {
    onClose: () => void;
}
export default function FamilyDetailForm(props: Readonly<FamilyAddFromProps>) {
    const {onClose} = props;
    const updateFamily: (familyId: string, newFamily: Family) => void = useFamilyStore(state => state.updateFamily);
    const currentFamily = useFamilyStore(state => state.currentFamily);
    const [newFamilyName, setNewFamilyName] = useState<string>(currentFamily?.familyName || "");
    const [newState, setNewState] = useState<string>(currentFamily?.state || "");
    const currentUser = useUserStore(state => state.currentUser);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (currentFamily) {
            const updatedFamily: Family = {
                familyId: currentFamily.familyId,
                familyName: newFamilyName,
                state: newState,
            };

            updateFamily(currentFamily.familyId, updatedFamily);
        }

        onClose();
    }

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewState(e.target.value);
    };

    const handleFamilyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFamilyName(e.target.value);
    };


    return (
        <form className="user-form" onSubmit={handleSubmit}>
            <label className="form-entries">Eure Familien Id: {currentUser?.familyId}</label>
            <label>
                Familienname:
                <input
                    type="text"
                    value={newFamilyName}
                    onChange={handleFamilyNameChange}
                    placeholder="Geben Sie den Familiennamen ein"
                />
            </label>
            <label className="form-entries">In welchem Bundesland wohnt ihr (für die korrekten Feiertage)
                <select
                    className="form-select"
                    value={newState}
                    onChange={handleStateChange}
                >
                    <option value="">Bitte wählen...</option>
                    {/* Verwende die stateMap, um die Optionen dynamisch zu generieren */}
                    {Object.entries(stateMap).map(([code, name]) => (
                        <option key={code} value={code}>
                            {name}
                        </option>
                    ))}
                </select>
            </label>
            <div className="button-container">
                <button onClick={onClose}>Abbrechen</button>
                <button type="submit">Ok</button>
            </div>
        </form>
    );
}