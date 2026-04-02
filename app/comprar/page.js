'use client';
import React from 'react';
import Link from 'next/link';

export default function ComprarPage() {
  const pasos = [
    { num: '01', title: 'Selección', desc: 'Explora el catálogo y elegí tus prendas. No olvides revisar la tabla de talles en la ficha de cada producto.' },
    { num: '02', title: 'Carrito', desc: 'Agregá los items. Podés gestionar talles y cantidades desde el panel lateral antes de confirmar.' },
    { num: '03', title: 'WhatsApp', desc: 'Al finalizar, se generará un pedido automático. Serás redirigido a nuestro WhatsApp para coordinar.' },
    { num: '04', title: 'Despacho', desc: 'Confirmado el pago (Transferencia/Efectivo), preparamos tu pedido para envío inmediato.' },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-24 md:pt-40 pb-20 px-4 md:px-6 selection:bg-[#C6FF33] selection:text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER EDITORIAL */}
        <header className="mb-20 md:mb-32 relative">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-[1px] w-12 bg-[#7D39EB]" />
            <span className="text-[#7D39EB] text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] block">
              Guía de Usuario
            </span>
          </div>
          <h1 className="text-[10vw] md:text-[7vw] font-raw italic uppercase tracking-tighter leading-[0.8] break-words">
            ¿Cómo<br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Comprar?</span>
          </h1>
        </header>

        {/* PASOS - GRID DINÁMICO */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-0 mb-32 border-white/10 md:border">
          {pasos.map((paso, index) => (
            <div 
              key={paso.num} 
              className={`p-8 md:p-12 bg-[#050505] hover:bg-[#0A0A0A] transition-all duration-700 group relative overflow-hidden
                ${index !== pasos.length - 1 ? 'md:border-r border-white/10' : ''} 
                ${index > 1 ? 'md:border-t border-white/10 lg:border-t-0' : ''}
                border border-white/10 md:border-none`}
            >
              {/* Número de fondo */}
              <span className="absolute -right-4 -bottom-8 text-[120px] font-raw italic text-white/[0.02] group-hover:text-[#C6FF33]/[0.05] transition-colors leading-none">
                {paso.num}
              </span>

              <span className="text-3xl md:text-4xl font-raw text-[#C6FF33] block mb-8 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                {paso.num}
              </span>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.2em] mb-4 text-white group-hover:text-[#C6FF33] transition-colors">
                {paso.title}
              </h3>
              <p className="text-white/40 text-[11px] md:text-12px font-bold uppercase tracking-widest leading-relaxed">
                {paso.desc}
              </p>
            </div>
          ))}
        </section>

        {/* INFO LOGÍSTICA - ESTILO FICHA TÉCNICA */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 border-t border-white/5 pt-20">
          
          {/* ENVÍOS */}
          <div className="space-y-8">
            <div className="flex items-end gap-4">
               <h2 className="text-4xl md:text-6xl font-raw italic uppercase tracking-tighter text-white">Logística</h2>
               <span className="text-[#C6FF33] text-[10px] font-black mb-2 tracking-widest uppercase italic">// Envíos</span>
            </div>
            <div className="space-y-6">
              <p className="text-sm md:text-base text-white/60 font-medium leading-relaxed max-w-md">
                Despachamos a todo el país vía <span className="text-white underline decoration-[#7D39EB] decoration-2 underline-offset-4">Correo Argentino</span>. 
                En AMBA contamos con mensajería privada para entregas en 24/48hs.
              </p>
              <div className="inline-block bg-[#7D39EB]/10 border border-[#7D39EB]/30 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7D39EB]">
                  Costo de envío a cargo del comprador.
                </p>
              </div>
            </div>
          </div>

          {/* DEVOLUCIONES */}
          <div className="space-y-8">
            <div className="flex items-end gap-4">
               <h2 className="text-4xl md:text-6xl font-raw italic uppercase tracking-tighter text-white">Políticas</h2>
               <span className="text-white/40 text-[10px] font-black mb-2 tracking-widest uppercase italic">// Cambios</span>
            </div>
            <div className="space-y-6">
              <p className="text-sm md:text-base text-white/60 font-medium leading-relaxed max-w-md">
                Cambios únicamente por <span className="text-white">fallas de fabricación</span> reportadas dentro de las 48hs de recibido.
              </p>
              <div className="border-l-2 border-white/20 pl-6 py-2">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/30 leading-relaxed">
                  Los costos logísticos por cambios de talle o preferencia corren por cuenta del cliente. Recomendamos chequear la tabla de medidas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTÓN FINAL */}
        <div className="mt-32 md:mt-48 text-center border-t border-white/5 pt-20">
          <Link href="/productos" className="group relative inline-flex items-center justify-center px-12 py-6 md:px-20 md:py-8 bg-[#C6FF33] overflow-hidden transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 w-0 bg-white transition-all duration-500 group-hover:w-full" />
            <span className="relative z-10 text-black font-raw text-2xl md:text-4xl uppercase italic tracking-tighter group-hover:scale-110 transition-transform">
              Ir Al Catálogo
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}