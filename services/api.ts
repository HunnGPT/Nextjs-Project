let refreshPromise: Promise<boolean> | null = null;

export async function apiFetch(
    url: string,
    options: RequestInit = {}
) {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    const res = await fetch(fullUrl, {
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

        const retryRes = await fetch(fullUrl, {
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

export async function getApiError(res: Response): Promise<string> {
    const data = await res.json();
    if (data.errors) {
        const messages = Object.values(data.errors).flat();

        return messages.join(", ");
    }

    return data.detail || data.title || "Đã xảy ra lỗi";
}

async function refreshAccessToken(): Promise<boolean> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    console.log("Refresh status:", res.status);

    if (!res.ok) {
        return false;
    }

    return true;
}