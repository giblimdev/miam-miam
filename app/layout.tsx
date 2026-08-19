import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// ============================================================
// Police
// ============================================================

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// ============================================================
// Metadata
// ============================================================

export const metadata: Metadata = {
  title: "Miam Miam - Épicerie fine en ligne",
  description:
    "Découvrez nos produits artisanaux et de qualité livrés chez vous",
};

// ============================================================
// Root Layout
// ============================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`h-full ${jakarta.variable} antialiased`}>
      <body className="min-h-full flex flex-col font-jakarta">
        {children}

        <Toaster position="top-right" richColors closeButton duration={3000} />
      </body>
    </html>
  );
}
