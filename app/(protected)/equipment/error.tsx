'use client'

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                transform: "translateY(-100px)"
            }}
        >
            <h1>
                Không thể tải danh sách thiết bị.
            </h1>

            <button
                style={{
                    fontSize: "16px",
                    marginTop: "10px",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#1976d2",
                    padding: "5px 10px",
                    cursor: "pointer"
                }}
                onClick={() => window.location.reload()}
            >
                Thử lại
            </button>
        </div>
    );
}