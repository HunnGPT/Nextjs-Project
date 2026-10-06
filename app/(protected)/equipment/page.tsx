import EquipmentList from "./EquipmentList/EquipmentList";
import AuthGuard from "../../AuthGuard";

export default function EquipmentPage() {
    return (
        <AuthGuard>
            <EquipmentList />
        </AuthGuard>
    );
}