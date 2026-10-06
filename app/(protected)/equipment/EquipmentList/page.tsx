'use client'

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { apiFetch } from "../../../../services/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import styles from "./EquipmentList.module.css";

type Equipment = {
    id: number;
    name: string;
    status: string;
};

export default function EquipmentList() {
    const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function fetchEquipments() {
            try {
                const meRes = await apiFetch("/api/Auth/me");

                if (!meRes.ok) {
                    setLoading(false);
                    return;
                }

                const meData = await meRes.json();
                setRole(meData.role);

                const equipmentRes = await apiFetch("/api/equipments");

                if (!equipmentRes.ok) {
                    setLoading(false);
                    return;
                }

                const data = await equipmentRes.json();

                setEquipmentList(data);
                setFilteredEquipments(data);
            } finally {
                setLoading(false);
            }
        }

        fetchEquipments();
    }, []);

    function handleSearch() {
        const keyword = search.trim().toLowerCase();

        if (keyword === "") {
            setFilteredEquipments(equipmentList);
            return;
        }

        const result = equipmentList.filter(equipment =>
            equipment.name.toLowerCase().includes(keyword)
        );

        setFilteredEquipments(result);
    }

    function handleOpenDelete(id: number) {
        setSelectedId(id);
        setOpenDelete(true);
    }

    async function handleConfirmDelete() {
        if (selectedId === null) {
            return;
        }

        setIsDeleting(true);

        const res = await apiFetch(
            `/api/equipments/${selectedId}`,
            {
                method: "DELETE"
            }
        );

        if (res.ok) {
            setEquipmentList(prev =>
                prev.filter(equipment => equipment.id !== selectedId)
            );

            setFilteredEquipments(prev =>
                prev.filter(equipment => equipment.id !== selectedId)
            );

            setOpenDelete(false);
            setSelectedId(null);
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
            }, 1500);
        }

        setIsDeleting(false);
    }

    function getStatusClass(status: string) {
        if (status === "Đang sử dụng") {
            return styles.statusUsing;
        }

        if (status === "Đang bảo trì") {
            return styles.statusMaintenance;
        }

        return styles.statusInactive;
    }

    const rows = filteredEquipments.map((equipment, index) => ({
        ...equipment,
        stt: index + 1
    }));

    const columns: GridColDef[] = [
        {
            field: "stt",
            headerName: "STT",
            width: 80,
            headerAlign: "center",
            align: "center",
            sortable: false
        },
        {
            field: "name",
            headerName: "Tên thiết bị",
            flex: 1,
            minWidth: 280,
            headerAlign: "left",
            align: "left"
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 220,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <span
                    className={`${styles.status} ${getStatusClass(params.value)}`}
                >
                    {params.value}
                </span>
            )
        }
    ];

    if (role === "Admin") {
        columns.push({
            field: "action",
            headerName: "Thao tác",
            width: 290,
            headerAlign: "center",
            align: "center",
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className={styles.actions}>
                    <Link href={`/equipment/${params.row.id}`}>
                        <button className={styles.detailButton}>
                            <VisibilityIcon fontSize="small" />
                            Chi tiết
                        </button>
                    </Link>

                    <Link href={`/equipment/${params.row.id}/edit`}>
                        <button className={styles.editButton}>
                            <EditIcon fontSize="small" />
                            Sửa
                        </button>
                    </Link>

                    <button
                        className={styles.deleteButton}
                        onClick={() => handleOpenDelete(params.row.id)}
                    >
                        <DeleteForeverIcon fontSize="small" />
                    </button>
                </div>
            )
        });
    } else {
        columns.push({
            field: "detail",
            headerName: "Thao tác",
            width: 150,
            headerAlign: "center",
            align: "center",
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className={styles.actions}>
                    <Link href={`/equipment/${params.row.id}`}>
                        <button className={styles.detailButton}>
                            <VisibilityIcon fontSize="small" />
                            Chi tiết
                        </button>
                    </Link>
                </div>
            )
        });
    }

    return (
        <div className={styles.page}>

            {showSuccess && (
                <div className={styles.successToast}>
                    <div className={styles.successIcon}>
                        <i className="fa-solid fa-check"></i>
                    </div>

                    <span>Xóa thiết bị thành công</span>
                </div>
            )}

            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        Danh sách thiết bị
                    </h1>

                    <p className={styles.subtitle}>
                        Quản lý và theo dõi các thiết bị trong hệ thống
                    </p>
                </div>
            </div>

            <div className={styles.searchArea}>
                <div className={styles.searchBox}>
                    <SearchIcon className={styles.searchIcon} />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        placeholder="Tìm kiếm theo tên thiết bị..."
                        className={styles.searchInput}
                    />
                </div>

                <button
                    onClick={handleSearch}
                    className={styles.searchButton}
                >
                    Tìm kiếm
                </button>

                {role === "Admin" && (
                    <Link
                        href="/equipment/create"
                        className={styles.addLink}
                    >
                        <button className={styles.addButton}>
                            <AddIcon fontSize="small" />
                            Thêm thiết bị
                        </button>
                    </Link>
                )}
            </div>

            <div className={styles.grid}>
                {loading ? (
                    <div className={styles.emptyState}>
                        <p>Đang tải thiết bị...</p>
                    </div>
                ) : equipmentList.length === 0 ? (
                    <div className={styles.emptyState}>
                        <i className="fa-solid fa-box-open"></i>
                        <p>Chưa có thiết bị nào.</p>
                    </div>
                ) : filteredEquipments.length === 0 ? (
                    <div className={styles.emptyState}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <p>Không tìm thấy thiết bị phù hợp.</p>
                    </div>
                ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25, 100]}
                        disableRowSelectionOnClick
                        disableColumnMenu
                        rowHeight={58}
                        autoHeight
                        sx={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",

                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#f8fafc",
                                borderBottom: "1px solid #e5e7eb"
                            },

                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: 700,
                                color: "#374151"
                            },

                            "& .MuiDataGrid-cell": {
                                borderBottom: "1px solid #f1f5f9"
                            },

                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#f8fafc"
                            },

                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "1px solid #e5e7eb"
                            }
                        }}
                    />
                )}
            </div>

            <Dialog
                open={openDelete}
                onClose={() => {
                    if (!isDeleting) {
                        setOpenDelete(false);
                    }
                }}
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: "12px"
                    }
                }}
            >
                <DialogTitle className={styles.dialogTitle}>
                    Xác nhận xóa
                </DialogTitle>

                <DialogContent className={styles.dialogContent}>
                    Bạn có chắc chắn muốn xóa thiết bị này không?
                    <br />
                    Hành động này không thể hoàn tác.
                </DialogContent>

                <DialogActions className={styles.dialogActions}>
                    <Button
                        onClick={() => setOpenDelete(false)}
                        disabled={isDeleting}
                    >
                        Hủy
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Đang xóa..." : "Xóa"}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}