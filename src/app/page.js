import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-[] min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 text-white">
        <h1 className="text-5xl font-bold tracking-wide">
          Welcome to Cafe Online
        </h1>

        <p className="text-white/80 max-w-md mx-auto">
          Experience premium coffee and handcrafted flavors.
        </p>

        <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
          Explore Menu
        </Button>
      </div>
    </main>
  );
}
