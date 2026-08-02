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
  title: "SEAWORTHOUSE | Catálogo Anime",
  description:
    "Ropa, figuras y posters de anime. Catálogo oficial Seaworthouse.",
  openGraph: {
    title: "SEAWORTHOUSE",
    description: "Ropa, figuras y posters de anime. Catálogo oficial Seaworthouse.",
    type: "website",
    images: [
      {
        url: "/logometa.jpg",
        width: 1200,
        height: 630,
        alt: "SEAWORTHOUSE — Ropa, figuras y posters de anime",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEAWORTHOUSE",
    description: "Ropa, figuras y posters de anime. Catálogo oficial Seaworthouse.",
    images: ["/logometa.jpg"],
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
