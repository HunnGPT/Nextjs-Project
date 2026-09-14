'use client'

import React, { useState } from "react";
import Link from "next/link";

export default function EquipmentList() {
    const equipments = [{ id: 1, name: 'Thiết bị 1' },
    { id: 2, name: 'Thiết bị 2' },
    { id: 3, name: 'Thiết bị 3' },
    { id: 4, name: 'Thiết bị 4' },
    { id: 5, name: 'Thiết bị 5' },

    ];
    const [filteredEquipments, setFilteredEquipments] = useState(equipments);

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;

        const filteredEquipments = equipments.filter(equipment => equipment.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredEquipments(filteredEquipments);
    }

    return <div>
        <input type="text" onChange={handleInput} />
        <ul>
            {filteredEquipments.map((equipment, index) => (
                <li key={index}>
                    <Link href={`/equipment/${equipment.id}`}>{equipment.name}</Link>
                </li>
            ))}
        </ul>
    </div >
}