import type { Metadata } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seaworthouse.com"),
  title: "SEAWORTH HOUSE | Catálogo Anime",
  description:
    "Ropa, figuras y posters de anime. Catálogo oficial Seaworth House.",
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  openGraph: {
    title: "SEAWORTH HOUSE",
    description: "Ropa, figuras y posters de anime. Catálogo oficial Seaworth House.",
    type: "website",
    images: [
      {
        url: "https://seaworthouse.com/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "SEAWORTH HOUSE — Ropa, figuras y posters de anime",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEAWORTH HOUSE",
    description: "Ropa, figuras y posters de anime. Catálogo oficial Seaworth House.",
    images: ["https://seaworthouse.com/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${orbitron.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
