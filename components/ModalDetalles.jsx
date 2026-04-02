'use client';
import React, { useState, useEffect } from 'react';
import { addToCart, isCartOpen } from '@/src/store/cart';

export default function ModalDetalles({ producto, onClose }) {
  const [fotoActiva, setFotoActiva] = useState('');
  const [galeria, setGaleria] = useState([]);
  const [talleSel, setTalleSel] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (producto) {
      const fotosExtras = producto.imagenes_producto 
        ? producto.imagenes_producto.map(img => img.url) 
        : [];
      const nuevaGaleria = [...new Set([producto.imagen, ...fotosExtras])].filter(Boolean);
      setGaleria(nuevaGaleria);
      
      setFotoActiva(producto.imagen || nuevaGaleria[0] || '');
      
      const primerTalleDisponible = Object.keys(producto.stock || {}).find(t => producto.stock[t] > 0);
      setTalleSel(primerTalleDisponible || '');
    }
  }, [producto]);

  if (!producto) return null;

  const handleAdd = () => {
    if (!talleSel) return alert("POR FAVOR, SELECCIONÁ UN TALLE");
    addToCart(producto, cantidad, talleSel);
    onClose();
    isCartOpen.set(true);
  };

  // FUNCIÓN CORREGIDA: Ahora busca 'ancho' y 'largo' que es lo que guardás en el Admin
  const getMedidas = (talle) => {
    // 1. Intentamos sacar del objeto 'medidas' que viene de Supabase
    if (producto.medidas && producto.medidas[talle]) {
      return {
        ancho: producto.medidas[talle].ancho || '--',
        largo: producto.medidas[talle].largo || '--'
      };
    }
    
    // 2. Valores por defecto si no hay nada cargado
    const defaults = {
      'S': { ancho: '48', largo: '68' }, 
      'M': { ancho: '50', largo: '70' }, 
      'L': { ancho: '52', largo: '72' },
      'XL': { ancho: '54', largo: '74' }, 
      'XXL': { ancho: '56', largo: '76' }
    };
    return defaults[talle] || { ancho: '--', largo: '--' };
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#050505] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[120] w-10 h-10 bg-black border border-white/20 flex items-center justify-center text-white hover:bg-[#C6FF33] hover:text-black transition-all rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        {/* COLUMNA IZQUIERDA: GALERÍA */}
        <div className="w-full md:w-3/5 p-4 flex flex-col gap-4 bg-[#080808]">
          <div className="aspect-[3/4] bg-white/5 overflow-hidden relative group">
            {fotoActiva ? (
              <img 
                src={fotoActiva} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={producto.titulo} 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 animate-pulse">
                <span className="text-[10px] uppercase font-black text-white/20 tracking-widest">Cargando...</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {galeria.map((img, idx) => (
              img && (
                <button 
                  key={idx}
                  onClick={() => setFotoActiva(img)}
                  className={`w-20 h-24 flex-shrink-0 border-2 transition-all ${
                    fotoActiva === img ? 'border-[#C6FF33] opacity-100' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Vista ${idx}`} />
                </button>
              )
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: INFO */}
        <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 relative">
          <div>
            <p className="text-[#C6FF33] text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">
              {producto.categoria}
            </p>
            <h2 className="text-3xl md:text-5xl font-raw italic uppercase text-white leading-[0.9] mb-4 tracking-tighter">
              {producto.titulo}
            </h2>
            <p className="text-4xl font-raw text-[#C6FF33] mb-8 italic">
              ${producto.precio?.toLocaleString('es-AR')}
            </p>

            <div className="mb-8">
              <p className="text-[10px] font-black uppercase text-white/40 mb-4 tracking-widest">// Seleccionar Talle</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['S', 'M', 'L', 'XL', 'XXL'].map(talle => {
                  const stock = producto.stock?.[talle] || 0;
                  return (
                    <button
                      key={talle}
                      disabled={stock === 0}
                      onClick={() => setTalleSel(talle)}
                      className={`min-w-[55px] py-3 text-xs font-black border transition-all ${
                        stock === 0 ? 'opacity-10 cursor-not-allowed border-white/5' :
                        talleSel === talle ? 'bg-[#C6FF33] text-black border-[#C6FF33]' : 'text-white border-white/10 hover:border-white/40'
                      }`}
                    >
                      {talle}
                    </button>
                  );
                })}
              </div>

              {/* RENDERIZADO DE MEDIDAS CORREGIDO */}
              {talleSel && (
                <div className="p-4 bg-white/[0.02] border border-white/10 flex justify-around items-center animate-in slide-in-from-bottom-2 duration-500">
                    <div className="text-center">
                       <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Ancho</p>
                       <p className="text-[#7D39EB] font-raw italic text-2xl leading-none">
                         {getMedidas(talleSel).ancho}<span className="text-[10px] ml-1">CM</span>
                       </p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                       <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Largo</p>
                       <p className="text-[#7D39EB] font-raw italic text-2xl leading-none">
                         {getMedidas(talleSel).largo}<span className="text-[10px] ml-1">CM</span>
                       </p>
                    </div>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleAdd}
            className="w-full bg-[#C6FF33] text-black py-5 font-raw text-xl italic uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_30px_rgba(198,255,51,0.15)] active:scale-[0.98]"
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}