import {Family} from "../types/Family.ts";
import useFamilyStore from "../stores/useFamilyStore.ts";
import FamilyCard from "./FamilyCard.tsx";

export default function FamilyGallery() {
    const families: Family[] = useFamilyStore(state => state.families);
    return (
        <div className="gallery">
            {families.map(family => (
                <FamilyCard key={family.familyId} family={family}/>
            ))}
        </div>
    );
}
