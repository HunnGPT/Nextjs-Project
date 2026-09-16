'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEquipmentPage() {
    const router = useRouter();
    const [equipment, setEquipment] = useState({
        id: "",
        name: "",
        status: ""
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEquipment({
            ...equipment,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!equipment.id || !equipment.name || !equipment.status) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const res = await fetch('/api/equipment', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(equipment)
        })

        if (res.ok) {
            alert("Thêm thiết bị thành công");
            router.push("/equipment");
        }
    }

    return <div>
        <form onSubmit={handleSubmit}>
            <h1 style={{ fontSize: "48px", fontWeight: "bold", textAlign: "center" }}>Thêm thiết bị</h1>
            <label style={{ fontSize: "24px", marginLeft: "500px" }}>Mã thiết bị</label>
            <input type="text" name="id" value={equipment.id} onChange={handleChange} style={{ marginLeft: "50px", border: "1px solid #ccc", padding: "2px", width: "300px" }} /> <br />

            <label style={{ fontSize: "24px", marginLeft: "500px" }}>Tên thiết bị</label>
            <input type="text" name="name" value={equipment.name} onChange={handleChange} style={{ marginLeft: "42px", border: "1px solid #ccc", padding: "2px", width: "300px" }} /> <br />

            <label style={{ fontSize: "24px", marginLeft: "500px" }}>Trạng thái</label>
            <input type="text" name="status" value={equipment.status} onChange={handleChange} style={{ marginLeft: "54px", border: "1px solid #ccc", padding: "2px", width: "300px" }} /> <br />

            <button type="submit" style={{ fontSize: "20px", marginLeft: "917px", marginTop: "10px", backgroundColor: "grey", padding: "0 4px", cursor: "pointer" }}>Lưu</button>
        </form>
    </div >
}