'use client'

import React, { useState } from "react";
import Link from "next/link";

type Equipment = {
    id: number;
    name: string;
}

type EquipmentListProp = {
    equipments: Equipment[];
}

export default function EquipmentList({ equipments }: EquipmentListProp) {
    const [filteredEquipments, setFilteredEquipments] = useState(equipments);

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;

        const result = equipments.filter(equipment => equipment.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredEquipments(result);
    }

    return <div>
        <input type="text" onChange={handleInput} />
        <ul>
            {filteredEquipments.map((equipment) => (
                <li key={equipment.id}>
                    <Link href={`/equipment/${equipment.id}`}>{equipment.name}</Link>
                </li>
            ))}
        </ul>
    </div >
}