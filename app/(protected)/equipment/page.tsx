import EquipmentList from "./EquipmentList/page";
import AuthGuard from "../../AuthGuard";

export default function EquipmentPage() {
    return (
        <AuthGuard>
            <EquipmentList />
        </AuthGuard>
    );
}