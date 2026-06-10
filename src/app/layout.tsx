import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SG MOTORS | Conseil • Achat • Vente de véhicules",
  description:
    "SG MOTORS — Votre spécialiste de l'achat, la vente et le conseil automobile. Découvrez notre catalogue de véhicules sélectionnés avec soin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`} data-theme="light" style={{ colorScheme: "light" }}>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <ThemeProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
