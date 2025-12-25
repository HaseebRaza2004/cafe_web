"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Autoplay, EffectCreative, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { cn } from "@/lib/utils";
import Image from "next/image";

const Carousel_005 = ({
  images,
  className,
  showPagination = true,
  showNavigation = false,
  loop = true,
  autoplay = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn(
        "relative w-full overflow-hidden",
        "h-[60vh] md:h-[80vh] lg:h-screen",
        className
      )}
    >
      <Swiper
        modules={[EffectCreative, Pagination, Autoplay, Navigation]}
        spaceBetween={0}
        speed={1500}
        autoplay={
          autoplay
            ? {
              delay: 3000,
              disableOnInteraction: false,
            }
            : false
        }
        effect="creative"
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        loop={loop}
        pagination={
          showPagination
            ? {
              clickable: true,
              el: ".custom-pagination",
            }
            : false
        }
        navigation={
          showNavigation ? {
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          } : false
        }
        className="h-full w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="relative w-full h-full overflow-hidden">
            {/* Image with Parallax Scale Effect */}
            <div className="relative w-full h-full">
              <Image
                src={image.src}
                alt={image.alt || "Luxury Cafe Ambience"}
                fill
                priority={index === 0}
                className="object-cover transition-transform duration-[10s] ease-linear hover:scale-105"
                sizes="(max-width: 768px) 100vw, 100vw"
              />

              {/* 1. Dark Overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* 2. Bottom Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-black via-black/60 to-transparent" />
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Pagination container */}
        <div className="custom-pagination absolute! bottom-8! left-1/2! -translate-x-1/2! z-20! flex justify-center gap-3" />

        {/* Custom Navigation Arrows (Optional) */}
        {showNavigation && (
          <>
            <div className="custom-prev absolute left-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-(--color-gold) hover:text-black hover:border-(--color-gold)">
              <ChevronLeft className="h-6 w-6" />
            </div>
            <div className="custom-next absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-(--color-gold) hover:text-black hover:border-(--color-gold)">
              <ChevronRight className="h-6 w-6" />
            </div>
          </>
        )}
      </Swiper>
    </motion.div>
  );
};

export { Carousel_005 };