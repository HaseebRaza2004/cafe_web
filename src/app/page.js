import Header from "@/components/custom components/Header";
import HeroSection from "@/components/custom components/HeroSection";
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2 relative cotainer">
      {/* Header */}
      <Header />

      {/* Carousel */}
      <Carousel_005
        className="w-full"
        images={images}
        showPagination={true}
        showNavigation={false}
        loop={true}
        autoplay={true}
      />

      {/* Hero Section */}
      <HeroSection/>
    </div>
  );
}
