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
    const fallback: ApiErrorResponse = {
        code: "UNEXPECTED_ERROR",
        message: "Đã xảy ra lỗi. Vui lòng thử lại.",
        traceId: "",
        timestamp: new Date().toISOString()
    };

    try {
        const body = await res.text();

        if (!body) {
            return fallback;
        }

        const contentType = res.headers.get("content-type") ?? "";

        if (contentType.includes("application/json")) {
            const data: unknown = JSON.parse(body);

            if (
                typeof data !== "object" ||
                data === null ||
                !("code" in data) ||
                typeof data.code !== "string" ||
                !data.code.trim() ||
                !("message" in data) ||
                typeof data.message !== "string" ||
                !data.message.trim()
            ) {
                return fallback;
            }

            return {
                code: data.code,
                message: data.message,
                traceId:
                    "traceId" in data && typeof data.traceId === "string"
                        ? data.traceId
                        : "",
                timestamp:
                    "timestamp" in data &&
                        typeof data.timestamp === "string"
                        ? data.timestamp
                        : new Date().toISOString()
            };
        }

        return {
            ...fallback,
            message: body
        };
    } catch {
        return fallback;
    }
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

export function toQueryString(
    params: Record<string, unknown>
): string {
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            continue;
        }

        search.set(key, String(value));
    }

    const result = search.toString();

    return result ? `?${result}` : "";
}