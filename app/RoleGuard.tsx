'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/services/api";

export default function RoleGuard({
    children,
    role
}: {
    children: React.ReactNode;
    role: string;
}) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        async function checkRole() {
            const res = await apiFetch("/api/Auth/me", {
                credentials: "include"
            });

            if (res.status === 401) {
                router.replace("/login");
                return;
            }

            const data = await res.json();

            if (data.role !== role) {
                router.replace("/403");
                return;
            }

            setChecking(false);
        }

        checkRole();
    }, [router, role]);

    if (checking) {
        return null;
    }

    return <>{children}</>;
}