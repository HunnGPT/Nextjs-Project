import EquipmentList from "./EquipmentList";

export default async function EquipmentPage() {
    const res = await fetch('http://localhost:3000/api/equipment');
    const equipments = await res.json();

    return <div>
        <EquipmentList equipments={equipments} />
    </div>
}