'use client'

import { useState, useEffect } from "react";
import { apiFetch, getApiError } from "../../../../services/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import RoleGuard from "../../../RoleGuard";
import styles from "./CreateEquipment.module.css";

const equipmentSchema = z.object({
    code: z.string()
        .min(1, "Mã thiết bị không được để trống")
        .max(50, "Mã thiết bị tối đa 50 ký tự"),

    name: z.string()
        .min(1, "Tên thiết bị không được để trống")
        .max(200, "Tên thiết bị tối đa 200 ký tự"),

    status: z.string()
        .min(1, "Trạng thái không được để trống"),

    categoryId: z.coerce.number()
        .int("Danh mục không hợp lệ")
        .positive("Vui lòng chọn danh mục")
});

type EquipmentForm = z.input<typeof equipmentSchema>;
type EquipmentFormOutput = z.output<typeof equipmentSchema>;

type Category = {
    id: number;
    name: string;
};

export default function CreateEquipmentPage() {
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<EquipmentForm, undefined, EquipmentFormOutput>({
        resolver: zodResolver(equipmentSchema)
    });

    useEffect(() => {
        async function fetchCategories() {
            const res = await apiFetch("/api/categories?pageNumber=1&pageSize=100");

            if (!res.ok) {
                return;
            }

            const data = await res.json();
            setCategories(data.items);
        }

        fetchCategories();
    }, []);

    async function onSubmit(data: EquipmentFormOutput) {
        const res = await apiFetch("/api/equipments", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            setShowSuccess(true);

            setTimeout(() => {
                router.push("/equipment");
            }, 1000);

            return;
        }

        const error = await getApiError(res);

        if (error.code === "VALIDATION_FAILED" && error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                setError(field as keyof EquipmentForm, {
                    type: "server",
                    message: messages.join("\n")
                });
            });

            return;
        }
        alert(error.message);
    }

    return (
        <RoleGuard role="Admin">
            {showSuccess && (
                <div className={styles.successToast}>
                    <div className={styles.successIcon}>
                        <i className="fa-solid fa-check"></i>
                    </div>

                    <span>
                        Thêm thiết bị thành công
                    </span>
                </div>
            )}

            <div className={styles.page}>
                <div className={styles.container}>

                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            Thêm thiết bị
                        </h1>

                        <p className={styles.subtitle}>
                            Nhập thông tin để thêm thiết bị mới vào hệ thống
                        </p>
                    </div>

                    <div className={styles.divider}></div>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Mã thiết bị
                                <span className={styles.required}>*</span>
                            </label>

                            <input
                                type="text"
                                placeholder="Nhập mã thiết bị"
                                {...register("code")}
                                className={`${styles.input} ${errors.code ? styles.inputError : ""} `}
                            />

                            {errors.code && (
                                <p className={styles.error}>
                                    {errors.code.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Tên thiết bị
                                <span className={styles.required}>*</span>
                            </label>

                            <input
                                type="text"
                                placeholder="Nhập tên thiết bị"
                                {...register("name")}
                                className={`${styles.input} ${errors.name ? styles.inputError : ""} `}
                            />

                            {errors.name && (
                                <p className={styles.error}>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Danh mục
                                <span className={styles.required}>*</span>
                            </label>

                            <select
                                {...register("categoryId")}
                                defaultValue=""
                                className={`${styles.input} ${errors.categoryId ? styles.inputError : ""}`}
                            >
                                <option value="" disabled>
                                    Chọn danh mục
                                </option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            {errors.categoryId && (
                                <p className={styles.error}>
                                    {errors.categoryId.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Trạng thái
                                <span className={styles.required}>*</span>
                            </label>

                            <select
                                {...register("status")}
                                defaultValue=""
                                className={`${styles.input} ${errors.status ? styles.inputError : ""} `}
                            >
                                <option value="" disabled>
                                    Chọn trạng thái
                                </option>

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

                            {errors.status && (
                                <p className={styles.error}>
                                    {errors.status.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                onClick={() => router.push("/equipment")}
                                className={styles.cancelButton}
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting || showSuccess}
                                className={`${styles.saveButton} ${isSubmitting ? styles.disabledButton : ""} `}
                            >
                                {isSubmitting || showSuccess ? "Đang lưu..." : "Lưu thiết bị"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </RoleGuard>
    );
}
