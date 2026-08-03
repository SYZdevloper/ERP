import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { transportationSite } from "@/config/transportation";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(transportationSite.identity.domain),
  title: {
    default: "Transportation Market Research & Industry Insights",
    template: `%s — ${transportationSite.identity.name}`,
  },
  description: transportationSite.identity.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: transportationSite.identity.name,
    title: "Transportation Market Research & Industry Insights",
    description: transportationSite.identity.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Transportation Market Research & Industry Insights",
    description: transportationSite.identity.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
