import { Button } from "@/components/ui/button";
import { Carousel_005 } from "@/components/ui/skiper-ui/skiper51";

export default function Home() {
  const images = [
    {
      src: "/Bbq.jpg",
      alt: "Description 1",
    },
    {
      src: "/Biryani.jpg",
      alt: "Description 2",
    },
    {
      src: "/Burger2.jpg",
      alt: "Description 3",
    },
    {
      src: "/Wraps.jpg",
      alt: "Description 4",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 relative">
      <Carousel_005
        className={"mt-20 min-h-screen"}
        images={images}
        showPagination={true}
        loop={true}
        autoplay={true}
        spaceBetween={0}
      />

      <main className="flex items-center justify-center">
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
    </div>
  );
}
