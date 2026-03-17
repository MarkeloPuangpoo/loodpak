import type { Metadata } from "next";
import { Anuphan, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ใช้ Anuphan เป็นฟอนต์หลัก ให้ความรู้สึก Modern และรองรับภาษาไทยได้สวยงาม
const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["latin", "thai"],
  display: 'swap',
});

// ใช้ JetBrains Mono หรือ Geist Mono สำหรับโค้ดห้อง
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "หลุดปาก (Lood-Pak) | เกมปาร์ตี้สุดเริด",
  description: "เกมปาร์ตี้มัลติเพลเยอร์แบบเรียลไทม์ที่คุณต้องจับผิดเพื่อนตอนพูดคำต้องห้าม! สนุก เร้าใจ และทันสมัย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${anuphan.variable} ${jetbrainsMono.variable} font-sans antialiased bg-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}