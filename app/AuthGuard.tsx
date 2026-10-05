'use client';

import { apiFetch } from "../services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const res = await apiFetch("/api/Auth/me", {
                credentials: "include"
            });

            if (res.status === 401) {
                router.push("/login");
                return;
            }

            setLoading(false);
        }

        checkAuth();
    }, [router]);

    if (loading) {
        return <div>Đang xác thực tài khoản...</div>;
    }
    return <>{children}</>;
}