import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const sans = Montserrat({
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title: "Your Store | Guest Experience Survey",
    description: "A premium kiosk survey for fine wine and spirits retailers.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Help us raise the bar.",
      description: "A 3-question guest experience survey.",
      type: "website",
      images: [{ url: socialImage, width: 1730, height: 909, alt: "Your Store guest experience survey" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Help us raise the bar.",
      description: "A 3-question guest experience survey.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
