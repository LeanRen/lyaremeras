'use client';
import React from 'react';

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 md:pt-40 pb-20 px-4 md:px-6 selection:bg-[#7D39EB] selection:text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* COLUMNA IZQUIERDA: TEXTO & MANIFIESTO (7 COLS) */}
          <section className="lg:col-span-7 space-y-12 md:space-y-20">
            <header className="relative">
              <span className="text-[#C6FF33] text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] block mb-6 animate-pulse">
                // Nosotros
              </span>
              <h1 className="text-[20vw] lg:text-[12vw] font-raw italic uppercase tracking-tighter leading-[0.75] mb-4">
                L<span className="text-[#7D39EB]">&</span>A
              </h1>
              <div className="flex items-center gap-6">
                 <h2 className="text-4xl md:text-7xl font-raw italic uppercase tracking-tighter text-white/70 leading-none">
                   Remeras
                 </h2>
                 <div className="h-[2px] flex-1 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
              </div>
            </header>

            <div className="max-w-xl space-y-8">
              <p className="text-xl md:text-2xl font-raw italic uppercase tracking-tight text-white leading-tight">
                No somos solo una marca. Somos un <span className="text-[#C6FF33]">laboratorio textil</span> enfocado en la cultura urbana y la ingeniería de impresión.
              </p>
              
              <div className="space-y-6 text-sm md:text-base text-white/50 leading-relaxed font-medium uppercase tracking-wide">
                <p>
                  Nacimos en Ramos Mejía con la misión de fusionar tecnología de vanguardia <span className="text-white">DTF High Definition</span> con el fit perfecto del algodón Premium 24/1.
                </p>
                <p>
                  Cada prenda que sale de nuestro taller es una declaración de principios: durabilidad extrema, colores vibrantes y carácter callejero. Diseñamos lo que nosotros mismos queremos usar.
                </p>
              </div>

              <div className="pt-8 flex flex-wrap gap-4">
                <span className="px-4 py-2 border border-[#7D39EB]/30 bg-[#7D39EB]/5 text-[#7D39EB] text-[10px] font-black uppercase tracking-widest">
                  Est. 2026
                </span>
                <span className="px-4 py-2 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                  Buenos Aires, AR
                </span>
              </div>
            </div>

            {/* INFO TÉCNICA TIPO "SPECS" */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
              <div className="bg-black p-8 space-y-2">
                <span className="text-[#C6FF33] text-[9px] font-black tracking-widest uppercase">Material_Base</span>
                <p className="text-2xl font-raw italic uppercase tracking-tighter">Algodón 24.1 / 20.1</p>
              </div>
              <div className="bg-black p-8 space-y-2">
                <span className="text-[#C6FF33] text-[9px] font-black tracking-widest uppercase">Tecnología_Print</span>
                <p className="text-2xl font-raw italic uppercase tracking-tighter">DTF Premium HD</p>
              </div>
              <div className="bg-black p-8 space-y-2">
                <span className="text-[#C6FF33] text-[9px] font-black tracking-widest uppercase">Logística_Nacional</span>
                <p className="text-2xl font-raw italic uppercase tracking-tighter">Envíos a todo el país</p>
              </div>
              <div className="bg-black p-8 space-y-2">
                <span className="text-[#C6FF33] text-[9px] font-black tracking-widest uppercase">Garantía_Calidad</span>
                <p className="text-2xl font-raw italic uppercase tracking-tighter">Control de Calidad Final</p>
              </div>
            </div>
          </section>

          {/* COLUMNA DERECHA: VISUAL (5 COLS) */}
          <section className="lg:col-span-5 lg:sticky lg:top-40">
            <div className="relative group overflow-hidden border border-white/10 aspect-[3/4] md:aspect-square lg:aspect-[4/5] bg-[#0A0A0A]">
              
              {/* Overlay de diseño */}
              <div className="absolute inset-0 z-10 border-[20px] border-black/50 pointer-events-none" />

              {/* Imagen principal */}
              <img 
                src="/portada.png" 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-[2s] ease-out" 
                alt="L&A Remeras Taller" 
              />

              {/* Elemento Flotante */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-40 h-40 border-[1px] border-[#C6FF33]/30 backdrop-blur-sm rotate-45 flex items-center justify-center group-hover:rotate-[135deg] transition-transform duration-1000">
                  <div className="w-32 h-32 border-[1px] border-[#C6FF33] flex items-center justify-center">
                    <span className="text-4xl font-raw text-[#C6FF33] -rotate-45 group-hover:-rotate-[135deg] transition-transform duration-1000">L&A</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
        }
      `}</style>
    </main>
  );
}