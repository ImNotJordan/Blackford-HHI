import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Serif_Display,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: {
    default: "Blackford Benefits Platform",
    template: "%s · Blackford",
  },
  description:
    "CRM and benefits enrollment for Blackford & Associates — staff, employers, and employees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${dmSerif.variable} ${plexMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full max-w-[100vw] flex-col overflow-x-hidden font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
