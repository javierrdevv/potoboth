import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pothobox.id"),
  title: "Pothobox, photobooth gratis di browser",
  description:
    "Photobooth gratis yang jalan di browser. Nyalakan kamera, ambil beberapa foto, jadi satu strip PNG. Tanpa aplikasi, tanpa akun, video tidak pernah meninggalkan perangkat.",
  openGraph: {
    title: "Pothobox, photobooth gratis di browser",
    description:
      "Nyalakan kamera, ambil beberapa foto, jadi satu strip. Gratis, tanpa akun, semuanya jalan lokal di browser.",
    url: "/",
    siteName: "Pothobox",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pothobox, photobooth gratis di browser",
    description: "Nyalakan kamera, ambil beberapa foto, jadi satu strip PNG.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}