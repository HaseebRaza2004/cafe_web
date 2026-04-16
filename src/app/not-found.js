import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 mt-30">
      <FileQuestion className="w-16 h-16 text-(--color-gold) mb-6 opacity-80" />
      <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-4">
        404
      </h1>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-300 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to our delicious menu.
      </p>
      <Link href="/">
        <Button className="bg-(--color-gold) text-black hover:bg-(--color-gold-dark) cursor-pointer">
          Return to Menu
        </Button>
      </Link>
    </div>
  );
};