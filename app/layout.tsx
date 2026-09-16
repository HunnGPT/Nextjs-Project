import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quản lý thiết bị",
  description: "Hệ thống quản lý thiết bị",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body>
        <div className="layout">
          <nav className="sidebar">
            <h2 className="logo">QUẢN LÝ</h2>

            <Link href="/dashboard">Dashboard</Link>
            <Link href="/departments">Phòng/ban</Link>
            <Link href="/equipment">Thiết bị</Link>
          </nav>

          <main className="content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}