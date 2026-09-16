import { equipments } from '../../../lib/equipments';

export async function DELETE(request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const index = equipments.findIndex(equipment => {
        return equipment.id === Number(id)
    })

    equipments.splice(index, 1);

    return Response.json({ message: "Xoá thành công" });
}