import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import Provider from "@/components/providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://app.onbored.io/"),
  title: {
    template: "%s | Onbored",
    default: "Onbored",
  },
  description:
    "Identify which users are slipping away, where they drop off, before it's too late",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://app.onbored.io",
  },
  openGraph: {
    title: "Onbored",
    description:
      "Identify which users are slipping away, where they drop off, before it's too late",
    url: "https://app.onbored.io/",
    siteName: "Onbored",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onbored",
    description:
      "Identify which users are slipping away, where they drop off, before it's too late",
    creator: "@momito",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased min-h-screen w-full `}
      >
        <NuqsAdapter>
          <Provider>
            <main>{children}</main>
            <Toaster />
          </Provider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
