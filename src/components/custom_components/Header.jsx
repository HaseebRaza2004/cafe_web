"use client"

import React, { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import Logo from './Logo';
import Link from 'next/link';
import CartSheet from './CartSheet/CartSheet';

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

          {/* Contact Number */}
          <div className="flex-1 flex justify-start">
            <a
              href="tel:0300-1234567"
              aria-label="Call Us"
              className="group bg-(--color-gold) hover:bg-(--color-gold-dark) text-black rounded-full md:rounded-md px-4 py-4 md:py-3 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center font-medium"
            >
              <div className="flex items-center gap-2 font-bold text-lg">
                <Phone className="w-5 h-5 fill-black" />
                <span className="hidden sm:inline tracking-wide">0300-1234567</span>
              </div>
            </a>
          </div>

          {/* Hanging Logo */}
          <div className={`absolute left-1/2 top-0 -translate-x-1/2 transition-all duration-500 z-50 ${isScrolled ? 'translate-y-2 scale-90' : 'translate-y-4 scale-100'
            }`}>
            <Link href="/" aria-label="Home">
              <div className="rounded-full p-2 bg-black/20 backdrop-blur-sm border border-gold/30 shadow-2xl cursor-pointer scale-80 hover:scale-85 transition-transform duration-300">
                <Logo />
              </div>
            </Link>
          </div>

          {/* Cart Icon */}
          <div className="flex-1 flex justify-end">
            <CartSheet />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header;
