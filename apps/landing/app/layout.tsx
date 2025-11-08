import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

import { Metadata } from "next";
import Nav from "@/components/nav";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://onbored.io/"),
  title: "Onbored | Know who will churn, before they do",
  description:
    "Identify which users are slipping away, where they drop off, before it's too late",
  keywords: [
    "SaaS churn prevention",
    "onboarding analytics platform",
    "churn prediction software",
    "reduce SaaS churn fast",
    "fix SaaS onboarding drop-offs",
    "increase SaaS retention",
    "improve onboarding",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://onbored.io",
  },
  openGraph: {
    title: "Onbored | Know who will churn, before they do",
    description:
      "Identify which users are slipping away, where they drop off, before it's too late",
    url: "https://onbored.io/",
    siteName: "Onbored",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onbored | Know who will churn, before they do",
    description:
      "Identify which users are slipping away, where they drop off, before it's too late",
    creator: "@momito",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${outfit.variable} ${inter.variable} antialiased font-['Inter']`}
      >
        <Nav />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
