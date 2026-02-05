"use client";
import React from "react";
import Image from "next/image";

const DealImage = ({ image, title }) => {
    return (
        <div className="relative w-full md:w-[45%] h-48 md:h-full shrink-0 bg-black/50">
            <Image
                src={image || "/placeholder.jpg"}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={true}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-black/90" />
        </div>
    );
};

export default DealImage;