'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { getApiError, apiFetch } from "../../services/api";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        try {
            setLoading(true);
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
                alert(error);
                return;
            }

            window.dispatchEvent(new Event("authChanged"));

            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    }

    return (
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
                            onChange={(e) => setUsername(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            className={styles.input}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </div>
            </div>
        </form>
    );
}