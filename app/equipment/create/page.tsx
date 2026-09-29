'use client'

import { apiFetch } from "../../../services/api";
import { useRouter } from 'next/navigation';
import AdminGuard from "../AdminGuard";
import { useState } from 'react';

export default function CreateEquipmentPage() {
    const router = useRouter();
    const [equipment, setEquipment] = useState({
        code: "",
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

        if (!equipment.code || !equipment.name || !equipment.status) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const res = await apiFetch('http://localhost:5009/api/equipments', {
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

    return (
        <AdminGuard>
            <div>
                <form onSubmit={handleSubmit}>
                    <h1 style={{ fontSize: "48px", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>Thêm thiết bị</h1>
                    <label style={{ fontSize: "24px", marginLeft: "400px" }}>Mã thiết bị</label>
                    <input
                        type="text"
                        name="code"
                        value={equipment.code}
                        onChange={handleChange}
                        style={{ marginLeft: "50px", border: "1px solid #ccc", padding: "2px", width: "300px" }}
                    /> <br />

                    <label style={{ fontSize: "24px", marginLeft: "400px" }}>Tên thiết bị</label>
                    <input
                        type="text"
                        name="name"
                        value={equipment.name}
                        onChange={handleChange}
                        style={{ marginLeft: "42px", border: "1px solid #ccc", padding: "2px", width: "300px" }}
                    /> <br />

                    <label style={{ fontSize: "24px", marginLeft: "400px" }}>Trạng thái</label>
                    <input
                        type="text"
                        name="status"
                        value={equipment.status}
                        onChange={handleChange}
                        style={{ marginLeft: "54px", border: "1px solid #ccc", padding: "2px", width: "300px" }}
                    /> <br />

                    <button
                        type="submit"
                        style={{
                            fontSize: "20px",
                            marginLeft: "800px",
                            marginTop: "10px",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            backgroundColor: "#1976d2",
                            padding: "6px 12px",
                            cursor: "pointer"
                        }}>
                        Lưu
                    </button>
                </form>
            </div>
        </AdminGuard>
    );
}