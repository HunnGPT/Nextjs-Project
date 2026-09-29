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
        const role = localStorage.getItem("userRole");

        if (role !== "Admin") {
            router.replace("/equipment");
            return;
        }

        setChecking(false);
    }, [router]);

    if (checking) {
        return null;
    }

    return <>{children}</>;
}