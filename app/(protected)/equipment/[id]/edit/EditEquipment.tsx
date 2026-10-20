'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../../services/api";
import styles from "./EditEquipment.module.css";

type Equipment = {
    id: number;
    code: string;
    name: string;
    status: string;
    categoryId: number;
};

type Category = {
    id: number;
    name: string;
};

export default function EditEquipment({ equipment }: { equipment: Equipment }) {
    const router = useRouter();

    const [form, setForm] = useState({
        code: equipment.code,
        name: equipment.name,
        status: equipment.status,
        categoryId: equipment.categoryId
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchCategories() {
            const res = await apiFetch(
                "/api/categories?pageNumber=1&pageSize=100"
            );

            if (!res.ok) return;

            const data = await res.json();
            setCategories(data.items);
        }

        fetchCategories();
    }, []);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "categoryId" ? Number(value) : value
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);

        const res = await apiFetch(
            `/api/equipments/${equipment.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            }
        );

        if (res.ok) {
            setShowSuccess(true);

            setTimeout(() => {
                router.push("/equipment");
            }, 1000);

            return;
        }

        setIsSubmitting(false);

        const error = await res.text();
        console.error("Update equipment failed:", res.status, error);

        alert(`Cập nhật thất bại (${res.status}): ${error}`);
    }

    return (
        <>
            {showSuccess && (
                <div className={styles.successToast}>
                    <div className={styles.successIcon}>
                        <i className="fa-solid fa-check"></i>
                    </div>

                    <span>
                        Cập nhật thiết bị thành công
                    </span>
                </div>
            )}

            <div className={styles.page}>
                <div className={styles.container}>

                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            Chỉnh sửa thiết bị
                        </h1>

                        <p className={styles.subtitle}>
                            Cập nhật thông tin thiết bị trong hệ thống
                        </p>
                    </div>

                    <div className={styles.divider}></div>

                    <form onSubmit={handleSubmit}>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Mã thiết bị
                                <span className={styles.required}>*</span>
                            </label>

                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="Nhập mã thiết bị"
                                className={styles.input}
                                disabled={isSubmitting || showSuccess}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Tên thiết bị
                                <span className={styles.required}>*</span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nhập tên thiết bị"
                                className={styles.input}
                                disabled={isSubmitting || showSuccess}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Danh mục
                                <span className={styles.required}>*</span>
                            </label>

                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                className={styles.input}
                                disabled={isSubmitting || showSuccess}
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Trạng thái
                                <span className={styles.required}>*</span>
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className={styles.input}
                                disabled={isSubmitting || showSuccess}
                            >
                                <option value="Đang sử dụng">
                                    Đang sử dụng
                                </option>

                                <option value="Đang bảo trì">
                                    Đang bảo trì
                                </option>

                                <option value="Không sử dụng">
                                    Không sử dụng
                                </option>
                            </select>
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                onClick={() => router.push("/equipment")}
                                className={styles.cancelButton}
                                disabled={isSubmitting || showSuccess}
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting || showSuccess}
                                className={`${styles.saveButton} ${isSubmitting || showSuccess
                                    ? styles.disabledButton
                                    : ""
                                    }`}
                            >
                                {isSubmitting || showSuccess
                                    ? "Đang lưu..."
                                    : "Lưu thay đổi"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}