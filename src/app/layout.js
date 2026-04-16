import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import ClientLayout from "@/components/layout/ClientLayout";
import { GoogleAnalytics } from "@next/third-parties/google";

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
  title: "Cafe Online | Luxury Dining Experience",
  description: "Experience the best luxury dining with our premium cafe menu.",
  keywords: ["cafe", "luxury dining", "coffee", "restaurant"],
  openGraph: {
    title: "Cafe Online | Premium Menu",
    description: "Order fresh and hot meals directly to your door.",
    url: "https://cafe-web-p93y.vercel.app/",
    siteName: "Cafe Online",
    images: [
      {
        url: "https://cafe-web-p93y.vercel.app/heroSecImage.webp",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_PK",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        {/* Global Background Image */}
        <div className="fixed inset-0 z-10">
          <Image
            src="/marbleImage.webp"
            alt="Marble luxury Background"
            fill
            quality={75}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Client Logic Wrapper */}
        <ClientLayout>{children}</ClientLayout>
      </body>

      {/* Google Analytics */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    </html>
  );
}
