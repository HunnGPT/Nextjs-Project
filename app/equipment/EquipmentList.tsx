'use client'

import { useState } from "react";
import Link from "next/link";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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

type EquipmentListProp = {
    equipments: Equipment[];
}

export default function EquipmentList({ equipments }: EquipmentListProp) {
    const [equipmentList, setEquipmentList] = useState(equipments);
    const [filteredEquipments, setFilteredEquipments] = useState(equipments);
    const [search, setSearch] = useState("");
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

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
        const res = await fetch(`/api/equipment/${id}`, {
            method: "DELETE",
        });

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


    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            width: 100
        },
        {
            field: "name",
            headerName: "Tên thiết bị",
            width: 200,
            renderCell: (params) => (
                <Link href={`/equipment/${params.row.id}`}>
                    {params.row.name}
                </Link>
            )
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 200
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <button
                    onClick={() => handleOpenDelete(params.row.id)}
                    style={{
                        backgroundColor: "grey",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0 12px",
                        cursor: "pointer",
                        height: "35px",
                        lineHeight: "35px"
                    }}
                >
                    Xóa
                </button>
            )
        }
    ];


    const gridHeight = Math.max(
        180,
        filteredEquipments.length * 52 + 110
    );


    return (
        <div style={{ width: "100%" }}>

            <h1 style={{ marginBottom: "15px" }}>
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
            </div>

            <div
                style={{
                    width: "100%",
                    height: gridHeight
                }}
            >
                <DataGrid
                    rows={filteredEquipments}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                />
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