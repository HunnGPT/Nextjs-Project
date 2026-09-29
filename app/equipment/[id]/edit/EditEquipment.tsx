'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../services/api";

type Equipment = {
    id: number;
    code: string;
    name: string;
    status: string;
};

export default function EditEquipment({ equipment }: { equipment: Equipment }) {
    const router = useRouter();
    const [form, setForm] = useState({
        code: equipment.code,
        name: equipment.name,
        status: equipment.status
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res = await apiFetch(
            `http://localhost:5009/api/equipments/${equipment.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        }
        );

        if (res.ok) {
            alert("Cập nhật thiết bị thành công");
            router.push(`/equipment`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 style={{ fontSize: "48px", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>Chỉnh sửa thiết bị</h1>

            <label style={{ fontSize: "24px", marginLeft: "396px" }}>Mã thiết bị</label>
            <input
                name="code"
                value={form.code}
                style={{ marginLeft: "50px", border: "1px solid #ccc", padding: "2px", width: "300px" }}
                onChange={handleChange}
            /> <br />

            <label style={{ fontSize: "24px", marginLeft: "388px" }}>Tên thiết bị</label>
            <input
                name="name"
                value={form.name}
                style={{ marginLeft: "50px", border: "1px solid #ccc", padding: "2px", width: "300px" }}
                onChange={handleChange}
            /> <br />

            <label style={{ fontSize: "24px", marginLeft: "400px" }}>Trạng thái</label>
            <input
                name="status"
                value={form.status}
                style={{ marginLeft: "50px", border: "1px solid #ccc", padding: "2px", width: "300px" }}
                onChange={handleChange}
            /> <br />

            <button type="submit"
                style={{
                    fontSize: "20px",
                    marginLeft: "798px",
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
        </form >
    );
}