import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Header from "@/components/custom_components/Header";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/custom_components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "cafe Online",
  description: "A Next.js project with Cafe theme",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        <div className="fixed inset-0 z-10">
          <Image
            src="/marble.jpg"
            alt="Marble luxury Background"
            fill
            quality={75}
            priority={true}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <CartProvider>
          <div className="relative z-50">
            <Header />
          </div>

          <main className="relative z-10 w-full min-h-screen">{children}</main>

          <div className="relative z-50">
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
