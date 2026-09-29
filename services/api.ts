export async function apiFetch(
    url: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("authToken");

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });

    console.log("API status:", res.status);

    if (res.status === 401) {
        const refreshed = await refreshAccessToken();

        if (!refreshed) {
            return res;
        }

        const newToken = localStorage.getItem("authToken");

        const retryRes = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${newToken}`
            }
        });

        return retryRes;
    }

    return res;
}

async function refreshAccessToken(): Promise<boolean> {
    console.log("Đang refresh token...");

    const refreshToken = localStorage.getItem("refreshToken");

    const res = await fetch("http://localhost:5009/api/Auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refreshToken: refreshToken
        })
    });

    console.log("Refresh status:", res.status);

    if (!res.ok) {
        return false;
    }

    const data = await res.json();

    console.log("Refresh thành công:", data);

    localStorage.setItem("authToken", data.token);

    return true;
}