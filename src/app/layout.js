import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "cafe Online",
  description: "A Next.js project with Cafe theme",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
        <main className="relative z-10 w-full min-h-screen container mx-auto">{children}</main>
      </body>
    </html>
  );
}
