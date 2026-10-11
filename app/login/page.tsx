'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { getApiError, apiFetch } from "../../services/api";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    async function handleLogin() {
        try {
            setErrorMessage("");
            setIsSubmitting(true);

            const res = await apiFetch("/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
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

                if (error.code === "INVALID_CREDENTIALS") {
                    setErrorMessage("Tên đăng nhập hoặc mật khẩu không đúng");
                    return;
                }

                setErrorMessage(error.message);
                return;
            }

            window.dispatchEvent(new Event("authChanged"));

            setShowSuccess(true);

            setTimeout(() => {
                router.push("/dashboard");
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

                    <span>Đăng nhập thành công</span>
                </div>
            )}

            <form
                className={styles.page}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                <div className={styles.loginBox}>

                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            Đăng nhập
                        </h1>

                        <p className={styles.subtitle}>
                            Đăng nhập vào hệ thống quản lý thiết bị
                        </p>
                    </div>

                    <div className={styles.form}>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Tên tài khoản
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    setErrorMessage("")
                                }}
                                placeholder="Nhập tên tài khoản"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Mật khẩu
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrorMessage("")
                                }}
                                placeholder="Nhập mật khẩu"
                                className={styles.input}
                            />

                            {errorMessage && (
                                <p className={styles.errorMessage}>
                                    {errorMessage}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles.button}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}