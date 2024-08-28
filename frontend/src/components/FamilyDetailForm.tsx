import {Family} from "../types/Family.ts";
import useFamilyStore from "../stores/useFamilyStore.ts";
import {useState} from "react";
import useUserStore from "../stores/useUserStore.ts";

type FamilyAddFromProps = {
    onClose: () => void;
}
export default function FamilyDetailForm(props: Readonly<FamilyAddFromProps>) {
    const {onClose} = props;
    const createFamily: (newFamily: Family) => void = useFamilyStore(state => state.createFamily);
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

            createFamily(updatedFamily);
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
                <button type="submit">Ok</button>
            </div>
        </form>
    );
}