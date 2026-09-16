import { equipments } from '../../lib/equipments';

export async function GET() {
    return Response.json(equipments);
}

export async function POST(request: Request) {
    const equipment = await request.json();
    equipments.push(equipment);

    return Response.json(equipment);
}
