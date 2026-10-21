'use client';

import "./AuthGuard.css";
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
    const [error, setError] = useState<string | null>(null);
    const [retryToken, setRetryToken] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let ignore = false;

        async function checkAuth() {
            setError(null);
            try {
                const res = await apiFetch("/api/Auth/me", {
                    signal: controller.signal
                });

                if (ignore) return;

                if (res.status === 401) {
                    router.push("/login");
                    return;
                }

                if (!res.ok) {
                    setError("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
                    return;
                }
            } catch {
                if (!ignore && !controller.signal.aborted) {
                    setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        checkAuth();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [router, retryToken]);

    if (loading) {
        return <div>Đang xác thực tài khoản...</div>;
    }


    if (error) {
        return (
            <div className="auth-error">
                <div className="auth-error__content">
                    <p className="auth-error__message">{error}</p>
                    <button
                        className="auth-error__retry"
                        onClick={() => {
                            setError(null);
                            setLoading(true);
                            setRetryToken(prev => prev + 1);
                        }}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}