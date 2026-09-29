'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("http://localhost:5009/api/Auth/register", {
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

        if (!res.ok) {
            alert(data);
            return;
        }

        alert("Đăng ký thành công");
        router.push("/login");
    }

    return (
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

                    <button
                        type="submit"
                        className={styles.button}
                    >
                        Đăng ký
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
    );
}