import type { Metadata } from "next";
import "@fontsource-variable/golos-text";
import "./globals.css";

export const metadata: Metadata = {
  title: "Конструктор исследования",
  description:
    "Рабочая среда для психологического исследования: тема, теория, дизайн, эксперимент, методы, анализ, этика и безопасное проектирование данных.",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
