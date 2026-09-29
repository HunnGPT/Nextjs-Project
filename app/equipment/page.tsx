import EquipmentList from "./EquipmentList";
import AuthGuard from "./AuthGuard";

export default function EquipmentPage() {
    return (
        <AuthGuard>
            <EquipmentList />
        </AuthGuard>
    );
}