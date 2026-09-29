'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, UserPlus, LogOut } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function handleAuthChange() {
        const token = localStorage.getItem("authToken");

        setIsLoggedIn(!!token);
    }

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            setIsLoggedIn(true);
        }

        window.addEventListener("authChanged", handleAuthChange);

        return () => {
            window.removeEventListener("authChanged", handleAuthChange);
        };
    }, []);

    async function handleLogout() {
        const refreshToken = localStorage.getItem("refreshToken");

        await fetch("http://localhost:5009/api/Auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        });

        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");

        window.dispatchEvent(new Event("authChanged"));

        router.replace("/login");
    }

    return (
        <nav className="auth-nav">
            {isLoggedIn ? (
                <button className="auth-button logout-button" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            ) : (
                <>
                    <Link href="/login" className="auth-button login-button">
                        <KeyRound size={18} />
                        <span>Login</span>
                    </Link>

                    <Link href="/register" className="auth-button register-button">
                        <UserPlus size={18} />
                        <span>Sign in</span>
                    </Link>
                </>
            )}
        </nav>
    );
}


