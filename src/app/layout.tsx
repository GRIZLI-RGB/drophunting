import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import ClientLayout from "./ClientLayout";

import "./globals.css";
import "overlayscrollbars/overlayscrollbars.css";
import "../shared/styles/scrollbar.css";
import "../shared/styles/server-content.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return {
    title: "DropHunting - Find and Hunt Profitable Product Drops",
    description:
      "Track and discover profitable product drops, releases, and limited editions to maximize your e-commerce success.",
    keywords: "drop hunting, product drops, ecommerce, limited releases",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ overflow: "auto" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#101114]`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
