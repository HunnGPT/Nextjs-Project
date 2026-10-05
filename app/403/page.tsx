export default function ForbiddenPage() {
    return (
        <div className="forbidden-page">
            <div className="forbidden-card">
                <div className="forbidden-icon">🔒</div>

                <div className="forbidden-code">403</div>

                <h1>Không có quyền truy cập</h1>

                <p>
                    Bạn không có quyền truy cập vào trang này.
                    <br />
                    Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một lỗi.
                </p>

                <a href="/dashboard" className="back-button">
                    ← Quay về trang chủ
                </a>
            </div>
        </div>
    );
}