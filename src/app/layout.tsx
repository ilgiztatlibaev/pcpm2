import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Закупки организации",
  description: "План-график закупок",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />
              Public Cloud Procurement Machine
            </div>
            <nav className="flex items-center gap-3 text-sm">
              <a href="/" className="rounded px-3 py-1.5 hover:bg-gray-100">План-график</a>
              <a href="/dashboard" className="rounded px-3 py-1.5 hover:bg-gray-100">Дашборд</a>
              <a href="/signin" className="rounded px-3 py-1.5 hover:bg-gray-100">Вход</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
