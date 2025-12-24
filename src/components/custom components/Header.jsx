import { Phone, UtensilsCrossed } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="w-full px-6 py-4 bg-transparent backdrop-blur-sm fixed top-0 left-0 z-50">
      <div className='flex items-center justify-between'>

        {/* Contact Number */}
        <Button className='bg-gold hover:bg-gold-dark text-black px-2 py-4 transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:shadow-[0_0_40px_rgba(197,160,89,0.5)] group'>
          <a
            href="tel:0300-1234567"
            className="flex items-center gap-2 transition-colors duration-300"
          >
            <Phone className="w-5 h-5" />
            <span className="hidden sm:inline">0300-1234567</span>
          </a>
        </Button>

        {/* Logo / Brand Name */}
        <Logo />
      </div>

    </header>
  )
}

export default Header;
