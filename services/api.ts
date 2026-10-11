let refreshPromise: Promise<ApiErrorResponse | null> | null = null;

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

        const refreshError = await refreshPromise;

        if (refreshError) {
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

export type ApiErrorResponse = {
    code: string;
    message: string;
    traceId: string;
    timestamp: string;
    errors?: Record<string, string[]>;
};

export async function getApiError(
    res: Response
): Promise<ApiErrorResponse> {
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
        return await res.json() as ApiErrorResponse;
    }

    return {
        code: "UNEXPECTED_ERROR",
        message: (await res.text()) || "Đã xảy ra lỗi",
        traceId: "",
        timestamp: new Date().toISOString()
    };
}

async function refreshAccessToken(): Promise<ApiErrorResponse | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    console.log("Refresh status:", res.status);

    if (!res.ok) {
        const error = await getApiError(res);
        return error;
    }

    return null;
}