'use client'

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { apiFetch } from "../../services/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";

type Equipment = {
    id: number;
    name: string;
    status: string;
}

export default function EquipmentList() {
    const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setRole(localStorage.getItem("userRole"));

        async function fetchEquipments() {
            const res = await apiFetch("http://localhost:5009/api/equipments");

            const data = await res.json();

            setEquipmentList(data);
            setFilteredEquipments(data);
            setLoading(false);
        }

        fetchEquipments();
    }, []);

    function handleSearch() {
        if (search.trim() === "") {
            setFilteredEquipments(equipmentList);
            return;
        }

        const result = equipmentList.filter(equipment =>
            equipment.name.toLowerCase().includes(search.toLowerCase())
        );

        setFilteredEquipments(result);
    }

    async function handleDelete(id: number) {
        const res = await apiFetch(
            `http://localhost:5009/api/equipments/${id}`,
            {
                method: "DELETE"
            }
        );

        if (res.ok) {
            setEquipmentList(prev =>
                prev.filter(equipment => equipment.id !== id)
            );

            setFilteredEquipments(prev =>
                prev.filter(equipment => equipment.id !== id)
            );

            alert("Xóa thiết bị thành công");
        }
    }


    function handleOpenDelete(id: number) {
        setSelectedId(id);
        setOpenDelete(true);
    }


    async function handleConfirmDelete() {
        if (selectedId === null) {
            return;
        }

        await handleDelete(selectedId);

        setOpenDelete(false);
        setSelectedId(null);
    }

    const rows = filteredEquipments.map((equipment, index) => ({
        ...equipment,
        stt: index + 1
    }));

    const columns: GridColDef[] = [
        {
            field: "stt",
            headerName: "STT",
            width: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "name",
            headerName: "Tên thiết bị",
            width: 300,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Link href={`/equipment/${params.row.id}`}>
                    {params.row.name}
                </Link>
            )
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 250,
            headerAlign: "center",
            align: "center"
        }
    ];

    if (role === "Admin") {
        columns.push({
            field: "action",
            headerName: "Thao tác",
            width: 190,
            headerAlign: "center",
            align: "center",
            sortable: false,
            renderCell: (params) => (
                <div
                    style={{
                        display: "flex",
                        gap: "50px",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%"
                    }}
                >
                    <Link href={`/equipment/${params.row.id}/edit`}>
                        <button
                            style={{
                                backgroundColor: "#1976d2",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                padding: "0 12px",
                                cursor: "pointer",
                                height: "35px",
                                lineHeight: "35px"
                            }}
                        >
                            Sửa
                        </button>
                    </Link>

                    <button
                        onClick={() => handleOpenDelete(params.row.id)}
                        style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            width: "40px",
                            height: "35px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <DeleteForeverIcon />
                    </button>
                </div>
            )
        });
    }


    const gridHeight = Math.max(
        180,
        filteredEquipments.length * 52 + 110
    );


    return (
        <div style={{ width: "100%" }}>

            <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
                Danh sách thiết bị
            </h1>

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "15px"
                }}
            >
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nhập tên thiết bị..."
                    style={{
                        width: "250px",
                        padding: "8px 10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        fontSize: "14px",
                        outline: "none"
                    }}
                />

                <button
                    onClick={handleSearch}
                    style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "8px 15px",
                        cursor: "pointer"
                    }}
                >
                    Tìm kiếm
                </button>

                {role === "Admin" && (
                    <Link href="/equipment/create">
                        <button
                            style={{
                                backgroundColor: "#1976d2",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                padding: "8px 15px",
                                cursor: "pointer"
                            }}
                        >
                            + Thêm thiết bị
                        </button>
                    </Link>
                )}
            </div>

            <div
                style={{
                    width: "100%",
                    height: gridHeight
                }}
            >
                {loading ? (
                    <p>Đang tải thiết bị...</p>
                ) : equipmentList.length == 0 ? (
                    <p>Chưa có thiết bị nào.</p>
                ) : filteredEquipments.length == 0 ? (
                    <p>Không tìm thấy thiết bị phù hợp.</p>
                ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25, 100]}
                        disableRowSelectionOnClick
                    />
                )}
            </div>

            <Dialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
            >
                <DialogTitle>
                    Xác nhận xóa
                </DialogTitle>

                <DialogContent>
                    Bạn có chắc chắn muốn xóa thiết bị này không?
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenDelete(false)}
                    >
                        Hủy
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleConfirmDelete}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}