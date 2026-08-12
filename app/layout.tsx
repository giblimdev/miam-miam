// app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Miam Miam - Épicerie fine en ligne",
  description: "Découvrez nos produits artisanaux et de qualité livrés chez vous",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-jakarta">
        {children}
          <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  ); 
}