'use client'

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { usePagedList } from "../../../hooks/usePagedList";
import { apiFetch, getApiError } from "../../../../services/api";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
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
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const query = useMemo(
        () => ({ search: searchQuery }),
        [searchQuery]
    );
    const {
        items: equipmentList,
        totalCount,
        pageNumber,
        pageSize,
        isLoading: loading,
        error,
        setPagination,
        goToFirstPage,
        refetch,
        goToPreviousPage,
        sortBy,
        descending,
        setSorting
    } = usePagedList<Equipment>({
        endpoint: "/api/equipments",
        query: query,
        initialPageSize: 10
    });

    useEffect(() => {
        async function fetchRole() {
            try {
                const res = await apiFetch("/api/Auth/me");

                if (res.ok) {
                    const data = await res.json();
                    setRole(data.role);
                }
            } catch {
                setRole(null);
            }
        }

        fetchRole();
    }, []);

    function handleSearch() {
        setSearchQuery(search.trim());
        goToFirstPage();
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
            if (equipmentList.length === 1 && pageNumber > 1) {
                goToPreviousPage();
            } else {
                refetch();
            }

            setOpenDelete(false);
            setSelectedId(null);
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
            }, 1500);

            setIsDeleting(false);
            return;
        }

        const deleteError = await getApiError(res);

        if (deleteError.code === "FORBIDDEN") {
            alert("Bạn không có quyền thực hiện thao tác này.");
            setIsDeleting(false);
            return;
        }

        alert(deleteError.message);
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

    const rows = equipmentList.map((equipment, index) => ({
        ...equipment,
        stt: (pageNumber - 1) * pageSize + index + 1
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


    const paginationModel = useMemo(
        () => ({
            page: pageNumber - 1,
            pageSize
        }),
        [pageNumber, pageSize]
    );

    const sortModel = useMemo(
        () => [
            {
                field: sortBy,
                sort: descending ? "desc" as const : "asc" as const
            }
        ],
        [sortBy, descending]
    );


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
                {error && (
                    <div className={styles.emptyState}>
                        <p>{error}</p>
                        <button onClick={refetch}>
                            Thử lại
                        </button>
                    </div>
                )}

                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    slots={{
                        noRowsOverlay: () => (
                            <div className={styles.noRowsOverlay}>
                                {searchQuery
                                    ? "Không tìm thấy thiết bị phù hợp."
                                    : "Chưa có thiết bị nào."}
                            </div>
                        )
                    }}
                    pageSizeOptions={[5, 10, 25, 100]}
                    paginationMode="server"
                    sortingMode="server"
                    rowCount={totalCount}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(model) => {
                        setPagination(model.page + 1, model.pageSize);
                    }}
                    sortModel={sortModel}
                    onSortModelChange={(model) => {
                        const item = model[0];

                        if (!item || !item.sort) {
                            setSorting("name", false);
                            return;
                        }

                        setSorting(item.field, item.sort === "desc");
                    }}
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