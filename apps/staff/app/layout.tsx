import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { getStaffEnv } from "@/src/env";
import "./globals.css";

// Validate env on every server boot / request boundary
void getStaffEnv();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blackford Staff",
  description: "Blackford CRM and onboarding — staff workspace (modules A, B, C, F)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
