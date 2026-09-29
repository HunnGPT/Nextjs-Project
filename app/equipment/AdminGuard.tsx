'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            const res = await fetch("http://localhost:5009/api/Auth/me", {
                credentials: "include"
            });

            if (!res.ok) {
                router.replace("/login");
                return;
            }

            const data = await res.json();

            if (data.role !== "Admin") {
                router.replace("/equipment");
                return;
            }

            setChecking(false);
        }

        checkAdmin();
    }, [router]);

    if (checking) {
        return null;
    }

    return <>{children}</>;
}