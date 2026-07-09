'use client';
import React, { useState, useEffect } from 'react';

export default function CardRemera({ id, titulo, precio, imagen, stock, categoria, onVerDetalles, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const hayStock = stock ? Object.values(stock).some(s => s > 0) : false;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      // USAMOS ONCLICK DIRECTO Y CURSOR POINTER FORZADO
      onClick={(e) => {
        e.preventDefault();
        if (onVerDetalles) onVerDetalles();
      }} 
      className={`group flex flex-col h-full bg-[#080808] border border-white/[0.05] hover:border-[#C6FF33]/40 transition-all duration-700 relative overflow-hidden transform cursor-pointer active:scale-95
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ transitionDelay: `${index * 80}ms`, cursor: 'pointer' }}
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img 
          src={imagen} 
          alt={titulo}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
        />
        
        {/* Overlay que indica que es clickeable */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <span className="bg-white text-black text-[9px] font-black px-4 py-2 uppercase tracking-widest">
             Ver Detalle
           </span>
        </div>

        {!hayStock && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 uppercase italic">
            Sin Stock
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow gap-4">
        <div>
          <p className="text-[#C6FF33] text-[8px] font-black uppercase tracking-[0.3em] italic mb-1 opacity-60">
            {categoria}
          </p>
          <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.1em] line-clamp-2 leading-tight group-hover:text-[#C6FF33] transition-colors">
            {titulo}
          </h3>
        </div>
        <p className="text-white font-raw text-3xl italic tracking-tighter leading-none">
          ${precio?.toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  );
}