"use client"

import React, { useEffect, useState } from 'react'
import { Phone, ShoppingCart } from 'lucide-react'
import { Button } from '../ui/button';
import Logo from './Logo';
import Link from 'next/link';
import CartSheet from './CartSheet';


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent ${isScrolled
          ? 'h-20 bg-black/60 backdrop-blur-md border-white/10 shadow-xl'
          : 'h-24 bg-transparent'
          }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between relative">

          {/* LEFT: Contact Number */}
          <div className="flex-1 flex justify-start">
            <a
              href="tel:0300-1234567"
              className="group bg-(--color-gold) hover:bg-(--color-gold-dark) text-black rounded-full md:rounded-md px-4 py-3 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center font-medium"
            >
              <div className="flex items-center gap-2 font-bold text-lg">
                <Phone className="w-5 h-5 fill-black" />
                <span className="hidden sm:inline tracking-wide">0300-1234567</span>
              </div>
            </a>
          </div>

          {/* CENTER: Hanging Logo */}
          <div className={`absolute left-1/2 top-0 -translate-x-1/2 transition-all duration-500 z-50 ${isScrolled ? 'translate-y-2 scale-90' : 'translate-y-4 scale-100'
            }`}>
            <Link href="/">
              <div className="rounded-full p-2 bg-black/20 backdrop-blur-sm border border-gold/30 shadow-2xl cursor-pointer">
                <Logo />
              </div>
            </Link>
          </div>

          {/* RIGHT: Cart Icon */}
          {/* <div className="flex-1 flex justify-end">
            <Button
              variant="ghost"
              onClick={() => console.log("Open Cart")}
              className="relative w-14 h-14 rounded-full hover:bg-white/10 transition-all duration-300 group cursor-pointer"
            >
              <ShoppingCart className="w-6! h-6! text-white group-hover:text-(--color-gold) transition-colors" />

              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-6 h-6 bg-gold text-black text-sm font-bold flex items-center justify-center rounded-full animate-bounce shadow-lg border border-black">
                  {cartCount}
                </span>
              )}
            </Button>
          </div> */}
          <div className="flex-1 flex justify-end">
            <CartSheet />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header;
