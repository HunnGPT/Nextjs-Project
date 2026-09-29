'use client';

import { apiFetch } from "../../services/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const res = await apiFetch("http://localhost:5009/api/Auth/me", {
                credentials: "include"
            });

            if (!res.ok) {
                router.push("/login");
            }
        }

        checkAuth();
    }, [router]);

    return <>{children}</>;
}