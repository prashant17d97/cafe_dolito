import type { Metadata } from "next";
import { Fraunces, Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { SiteShell } from "@/components/layout/site-shell";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Café Dolitó — Slow-roasted coffee. Italy & India, one table.",
  description:
    "Specialty coffee café and kitchen — authentic Italian, Indian, and Italian-in-Indian-style fusion.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
          <Providers>
            <SiteShell>{children}</SiteShell>
          </Providers>
        </body>
    </html>
  );
}
