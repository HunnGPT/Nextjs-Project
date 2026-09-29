let refreshPromise: Promise<boolean> | null = null;

export async function apiFetch(
    url: string,
    options: RequestInit = {}
) {
    const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            ...options.headers,
        }
    });

    console.log("API status:", res.status);

    if (res.status === 401) {
        if (!refreshPromise) {
            refreshPromise = refreshAccessToken().finally(() => {
                refreshPromise = null;
            });
        }

        const refreshed = await refreshPromise;

        if (!refreshed) {
            return res;
        }

        const retryRes = await fetch(url, {
            ...options,
            credentials: "include",
            headers: {
                ...options.headers,
            }
        });

        return retryRes;
    }

    return res;
}

async function refreshAccessToken(): Promise<boolean> {
    console.log("Đang refresh token...");

    const res = await fetch("http://localhost:5009/api/Auth/refresh", {
        method: "POST",
        credentials: "include",
    });

    console.log("Refresh status:", res.status);

    if (!res.ok) {
        return false;
    }

    return true;
}