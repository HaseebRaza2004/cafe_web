import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <>
            <main className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/heroSecImage.webp"
                        alt="Delicious Cafe Food"
                        fill
                        quality={75}
                        preload={true}
                        fetchPriority="high" 
                        loading="eager"
                        sizes="100vw"
                        className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 text-center mt-20 md:mt-24">

                    {/* Tagline / Welcome Text */}
                    <h2 className="text-(--color-gold) uppercase tracking-[0.3em] text-sm md:text-lg font-semibold mb-4 animate-fade-in-up">
                        • Welcome to Cafe Online •
                    </h2>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-xl">
                        EXPERIENCE <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-(--color-gold) to-(--color-gold-dark)">
                            LUXURY DINING
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl mb-6 leading-relaxed font-light">
                        Premium coffee, handcrafted flavors, and an unforgettable ambiance.
                        Taste the perfection in every bite.
                    </p>

                    {/* CTA Buttons  */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <Button
                            aria-label="Explore Menu"
                            asChild
                            size="lg"
                            className="w-64 h-14! bg-(--color-gold) text-black hover:bg-(--color-gold-dark) text-lg rounded-md uppercase tracking-widest font-bold transition-all duration-400 hover:scale-105 cursor-pointer"
                        >
                            <a href="#menu">
                                Explore Menu
                            </a>
                        </Button>

                        <Button
                            aria-label="View Hot Deals"
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-64 h-14! border-2 border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold) hover:text-black text-lg rounded-md uppercase tracking-widest font-bold transition-all duration-400 hover:scale-105 cursor-pointer"
                        >
                            <Link href="/deals">
                                View Hot Deals <ArrowRight className="ml-2 w-6 h-6" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </>
    )
};

export default HeroSection;