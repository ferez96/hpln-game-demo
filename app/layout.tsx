import type { Metadata } from "next";
import { philosopher, notoSerif, beVietnamPro, dmMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tam Quốc Tranh Hùng",
  description: "A Three Kingdoms strategy game prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`h-full antialiased ${philosopher.variable} ${notoSerif.variable} ${beVietnamPro.variable} ${dmMono.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
