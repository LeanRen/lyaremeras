import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/5 py-20 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-4 gap-16 relative z-10">
        
        {/* BRANDING */}
        <div className="md:col-span-2 space-y-6 text-center md:text-left">
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-raw uppercase tracking-tighter leading-none italic">
            L<span className="text-[#7D39EB]">&</span>A <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)' }}>REMERAS</span>
          </h2>
          <div className="space-y-3">
            <p className="text-[10px] font-clean font-black text-[#C6FF33] uppercase tracking-[0.4em]">
              Calidad Premium & DTF High Definition.
            </p>
            <p className="text-[9px] font-clean font-bold text-white/40 uppercase tracking-[0.2em]">
              Ramos Mejía, Buenos Aires, Argentina.
            </p>
          </div>
        </div>

        {/* INFO CONTACTO - Fuente font-clean */}
        <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left border-t border-white/5 pt-12 md:pt-0 md:border-none">
          <h4 className="text-xs font-raw text-[#7D39EB] tracking-[0.4em] uppercase italic">Contacto</h4>
          <div className="space-y-3">
            <a 
              href="https://wa.me/541140486522" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-[12px] font-clean font-bold text-white/60 hover:text-[#C6FF33] tracking-widest uppercase transition-colors"
            >
              WA: 11-4048-6522
            </a>
            <p className="text-[11px] font-clean font-bold text-white/40 tracking-widest uppercase">info@laremeras.com</p>
          </div>
        </div>

        {/* HORARIOS - Fuente font-clean */}
        <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left border-t border-white/5 pt-12 md:pt-0 md:border-none">
          <h4 className="text-xs font-raw text-[#7D39EB] tracking-[0.4em] uppercase italic">Horarios</h4>
          <div className="space-y-3">
            <p className="text-[11px] font-clean font-bold text-white/60 tracking-widest uppercase italic underline decoration-[#C6FF33] underline-offset-4">Atención Online</p>
            <p className="text-[11px] font-clean font-bold text-white/40 tracking-widest uppercase">LUN-VIE: 08:00 - 18:00</p>
          </div>
        </div>
      </div>

      {/* COPYRIGHT FINAL */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[9px] font-clean font-black text-white/40 tracking-[0.5em] text-center md:text-left uppercase">
          © {currentYear} L&A REMERAS - FABRICACIÓN NACIONAL
        </p>
        <div className="flex gap-6">
          <span className="text-[10px] font-raw text-[#C6FF33] tracking-widest uppercase italic">Hecho en Argentina</span>
        </div>
      </div>
    </footer>
  );
}