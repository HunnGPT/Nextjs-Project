export default async function EquipmentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <div>
        <h1>Chi tiết thiết bị {id}</h1>
    </div>
}