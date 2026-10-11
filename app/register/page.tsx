'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import { getApiError, apiFetch } from "../../services/api";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const res = await apiFetch("/api/Auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!res.ok) {
                const error = await getApiError(res);

                if (error.code === "VALIDATION_FAILED") {
                    setErrorMessage("Vui lòng nhập đầy đủ thông tin");
                    return;
                }

                if (error.code === "USERNAME_ALREADY_EXISTS") {
                    setErrorMessage("Tên tài khoản đã tồn tại");
                    return;
                }

                setErrorMessage(error.message);
                return;
            }

            setShowSuccess(true);

            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch {
            setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            {showSuccess && (
                <div className={styles.successToast} role="status">
                    <div className={styles.successIcon}>
                        <i className="fa-solid fa-check"></i>
                    </div>

                    <span>Đăng ký thành công</span>
                </div>
            )}

            <div className={styles.page}>
                <div className={styles.registerBox}>

                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            Tạo tài khoản
                        </h1>

                        <p className={styles.subtitle}>
                            Đăng ký tài khoản để sử dụng hệ thống
                        </p>
                    </div>

                    <form
                        onSubmit={handleRegister}
                        className={styles.form}
                    >
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Tên tài khoản
                            </label>

                            <input
                                type="text"
                                placeholder="Nhập tên tài khoản"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Mật khẩu
                            </label>

                            <input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        {errorMessage && (
                            <p className={styles.errorMessage} role="alert">
                                {errorMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            className={styles.button}
                            disabled={isSubmitting || showSuccess}
                        >
                            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <span>Đã có tài khoản?</span>

                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className={styles.loginLink}
                        >
                            Đăng nhập
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}