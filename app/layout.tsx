import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Navbar from "./components/Navbar";

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

            <Link href="/dashboard">Trang chủ</Link>
            <Link href="/departments">Phòng/ban</Link>
            <Link href="/equipment">Thiết bị</Link>
          </nav>

          <main className="content">
            <Navbar />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}