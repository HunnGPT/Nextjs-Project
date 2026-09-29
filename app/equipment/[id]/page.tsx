export default async function EquipmentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const res = await fetch(`http://localhost:5009/api/equipments/${id}`);
    const equipment = await res.json();

    return (
        <div>
            <h1>Chi tiết thiết bị</h1>

            <p>ID: {equipment.id}</p>
            <p>Mã: {equipment.code}</p>
            <p>Tên: {equipment.name}</p>
            <p>Trạng thái: {equipment.status}</p>
        </div>
    );
}