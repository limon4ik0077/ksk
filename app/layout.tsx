import type { Metadata, Viewport } from "next";
import { Montserrat, Space_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksk-shop.vercel.app";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  variable: "--font-heading",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KSK Shop",
    template: "%s | KSK Shop",
  },
  description: "Брендовый магазин женской одежды KSK Shop: каталог, корзина, оформление заказа и личный кабинет.",
  applicationName: "KSK Shop",
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KSK Shop",
    description: "Каталог женской одежды, оформление заказа и личный кабинет.",
    type: "website",
    url: siteUrl,
    siteName: "KSK Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "KSK Shop",
    description: "Каталог женской одежды, оформление заказа и личный кабинет.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff4500",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} ${spaceMono.variable} bg-paper text-ink antialiased`}>{children}</body>
    </html>
  );
}
