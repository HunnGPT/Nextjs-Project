import EditEquipment from "./EditEquipment";
import { cookies } from "next/headers";

export default async function EditEquipmentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const cookieStore = await cookies();

    const res = await fetch(`http://localhost:5009/api/equipments/${id}`, {
        headers: {
            Cookie: cookieStore.toString()
        }
    });

    if (!res.ok) {
        return <div>Không thể tải thiết bị. Status: {res.status}</div>;
    }

    const equipment = await res.json();

    return <EditEquipment equipment={equipment} />;
}