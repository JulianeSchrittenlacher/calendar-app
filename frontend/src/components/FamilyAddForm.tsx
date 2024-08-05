import {Family} from "../types/Family.ts";
import useFamilyStore from "../stores/useFamilyStore.ts";
import {useState} from "react";

type FamilyAddFromProps = {
    onClose: () => void;
}
export default function FamilyAddForm(props: Readonly<FamilyAddFromProps>) {
    const {onClose} = props;
    const createFamily: (newFamily: Family) => void = useFamilyStore(state => state.createFamily);
    const [name, setName] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newFamily: Family = {
            id: "",
            name,
        }
        createFamily(newFamily);
        onClose();
    }
    return (
        <form className="user-form" onSubmit={handleSubmit}>
            <label className="form-entries">
                <p>Name:</p>
                <input
                    placeholder={""}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
            </label>
            <div className="button-container">
                <button onClick={onClose}>Abbrechen</button>
                <button type="submit">Hinzufügen</button>
            </div>
        </form>
    );
}
