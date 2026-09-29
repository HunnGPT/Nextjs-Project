import EditEquipment from "./EditEquipment";

export default async function EditEquipmentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const res = await fetch(`http://localhost:5009/api/equipments/${id}`);
    const equipment = await res.json();

    return <EditEquipment equipment={equipment} />;
}