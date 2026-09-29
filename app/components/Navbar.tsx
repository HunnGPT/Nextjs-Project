'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, UserPlus, LogOut } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    async function handleAuthChange() {
        const res = await fetch("http://localhost:5009/api/Auth/me", {
            credentials: "include"
        });

        setIsLoggedIn(res.ok);
    }

    useEffect(() => {
        handleAuthChange();

        window.addEventListener("authChanged", handleAuthChange);

        return () => {
            window.removeEventListener("authChanged", handleAuthChange);
        };
    }, []);

    async function handleLogout() {
        await fetch("http://localhost:5009/api/Auth/logout", {
            method: "POST",
            credentials: "include"
        });

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


