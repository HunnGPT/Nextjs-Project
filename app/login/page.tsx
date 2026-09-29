'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        const res = await fetch("http://localhost:5009/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await res.json();

        console.log(data);

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userRole", data.role);

        window.dispatchEvent(new Event("authChanged"));

        router.push("/dashboard");
    }

    return (
        <div className={styles.page}>
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
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
}