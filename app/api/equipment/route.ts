export async function GET() {
    const equipments = [{ id: 1, name: 'Thiết bị 1' },
    { id: 2, name: 'Thiết bị 2' },
    { id: 3, name: 'Thiết bị 3' },
    { id: 4, name: 'Thiết bị 4' },
    { id: 5, name: 'Thiết bị 5' },

    ];

    return Response.json(equipments);
}