import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { APP_NAME } from "@/lib/config";
import "./globals.css";

// next/font descarga las fuentes en el build y las sirve desde el propio sitio.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${APP_NAME} · Entradas para eventos`, template: `%s · ${APP_NAME}` },
  description: "Comprá entradas para recitales, teatro y festivales. Reservá, pagá y entrá con tu QR.",
};

/** Layout raíz: envuelve todas las páginas con la barra superior y el pie. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
