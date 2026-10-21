'use client';

import { apiFetch, getApiError } from "../services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryToken, setRetryToken] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let ignore = false;

        async function checkAuth() {
            setLoading(true);
            setError(null);

            try {
                const res = await apiFetch("/api/Auth/me", {
                    signal: controller.signal
                });

                if (res.status === 401) {
                    router.push("/login");
                    return;
                }

                if (!res.ok) {
                    if (!ignore) {
                        setError((await getApiError(res)).message);
                    }

                    return;
                }

                if (!ignore) {
                    setLoading(false);
                }
            } catch {
                if (!ignore && !controller.signal.aborted) {
                    setError(
                        "Không kết nối được server. Kiểm tra API đã chạy chưa."
                    );
                }
            }
        }

        checkAuth();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [router, retryToken]);

    if (error) {
        return (
            <div>
                <p>{error}</p>

                <button onClick={() => setRetryToken(prev => prev + 1)}>
                    Thử lại
                </button>
            </div>
        );
    }

    if (loading) {
        return <div>Đang xác thực tài khoản...</div>;
    }
    return <>{children}</>;
}