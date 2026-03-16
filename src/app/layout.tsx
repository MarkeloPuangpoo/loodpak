import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ใช้ Outfit เป็นฟอนต์หลัก ให้ความรู้สึก Modern, Geometric และ Friendly
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: 'swap',
});

// ใช้ JetBrains Mono หรือ Geist Mono สำหรับโค้ดห้อง
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Lood-Pak.io | Premium Party Game",
  description: "A real-time multiplayer party game where you try to catch others saying their forbidden words! Modern and gamified.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased bg-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}