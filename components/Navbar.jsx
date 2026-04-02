'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { cartItems, isCartOpen } from '../src/store/cart';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const $cartItems = useStore(cartItems);
  const pathname = usePathname();
  const totalItems = $cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'INICIO', href: '/' },
    { name: 'PRODUCTOS', href: '/productos' },
    { name: '¿CÓMO COMPRAR?', href: '/comprar' },
    { name: 'NOSOTROS', href: '/nosotros' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[160] transition-all duration-500 border-b border-white/5 
        bg-black/80 backdrop-blur-md ${isScrolled ? 'py-3' : 'py-5'}`}>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center gap-2">
          
          {/* LOGO CON ISOTIPO (EL ROMBO) */}
          <Link href="/" className="group flex items-center gap-4 shrink-0">
            <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center">
              <div className="absolute inset-0 border border-[#C6FF33] rotate-45 group-hover:rotate-[135deg] transition-all duration-700 ease-in-out" />
              <span className="text-[14px] md:text-[16px] font-raw italic text-[#C6FF33] relative z-10 group-hover:scale-110 transition-transform tracking-tighter">
                L&A
              </span>
            </div>
            <div className="hidden sm:block overflow-hidden">
               <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white/30 group-hover:text-white transition-colors duration-500">
                 Remeras
               </span>
            </div>
          </Link>
          
          {/* MENU DESKTOP */}
          <div className="hidden md:flex gap-4 lg:gap-10 items-center mx-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`text-[9px] lg:text-[10px] font-black tracking-[0.2em] lg:tracking-[0.4em] transition-all duration-300 relative group py-2 shrink-0
                  ${pathname === link.href ? 'text-[#C6FF33]' : 'text-white/80 hover:text-white'}`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#C6FF33] transition-all duration-500 shadow-[0_0_10px_#C6FF33]
                  ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`} 
                />
              </Link>
            ))}
          </div>

          {/* ACCIONES - CORREGIDO COLOR CARRITO */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button 
              onClick={() => isCartOpen.set(true)} 
              className="group flex items-center gap-2 bg-white/5 hover:bg-[#C6FF33] px-2 sm:px-4 py-2 border border-white/10 hover:border-[#C6FF33] transition-all duration-500 shadow-[0_0_20px_rgba(198,255,51,0)] hover:shadow-[0_0_25px_rgba(198,255,51,0.25)]"
            >
              <span className="text-[8px] sm:text-[10px] font-black tracking-widest uppercase text-white group-hover:text-black transition-colors duration-500 whitespace-nowrap">
                CARRITO
              </span>
              <div className="bg-[#7D39EB] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full group-hover:bg-black group-hover:text-[#C6FF33] transition-all duration-500">
                {totalItems}
              </div>
            </button>

            {/* BOTÓN HAMBURGUESA */}
            <button 
              className="md:hidden flex flex-col gap-1.5 p-2 relative z-[170] shrink-0" 
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div 
        className={`fixed inset-0 z-[155] bg-black/98 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col justify-center items-center ${
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-8 text-center w-full px-6">
          {navLinks.map((link, idx) => (
            <Link 
              key={link.name}
              href={link.href}
              className={`text-4xl font-raw italic uppercase tracking-tighter transition-all duration-500 
                ${pathname === link.href ? 'text-[#C6FF33]' : 'text-white/60'}`}
              style={{ 
                transitionDelay: isMobileMenuOpen ? `${idx * 50}ms` : '0ms',
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(30px)'
              }}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-12 border-t border-white/5 mt-6 max-w-[240px] mx-auto w-full flex justify-center">
            <div className="w-12 h-12 border border-white/10 rotate-45 flex items-center justify-center">
               <span className="text-white/20 text-xs font-raw -rotate-45">L&A</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}