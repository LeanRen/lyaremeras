'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, isCartOpen, removeFromCart, addToCart, clearCart } from '../src/store/cart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CartDrawer = () => {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);
  const [customer, setCustomer] = useState({ name: '', city: '' });
  const [animate, setAnimate] = useState(false);
  
  const total = $cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  useEffect(() => {
    if ($isCartOpen) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [$isCartOpen]);

  const closeDrawer = () => {
    setAnimate(false);
    setTimeout(() => isCartOpen.set(false), 400);
  };

  const handleIncrease = (item) => {
    addToCart(item, 1, item.talle);
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      addToCart(item, -1, item.talle);
    } else {
      removeFromCart(item.id, item.talle);
    }
  };

  const handleCheckout = () => {
    if (!customer.name || !customer.city) return alert("POR FAVOR, COMPLETÁ TU NOMBRE Y LOCALIDAD.");
    if ($cartItems.length === 0) return alert("EL CARRITO ESTÁ VACÍO.");

    try {
      const doc = new jsPDF();
      const nroOrden = Math.floor(Math.random() * 90000) + 10000;

      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(198, 255, 51);
      doc.setFontSize(22);
      doc.text("L&A REMERAS - ORDEN DE COMPRA", 15, 25);
      
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      doc.text(`CLIENTE: ${customer.name.toUpperCase()}`, 15, 50);
      doc.text(`LOCALIDAD: ${customer.city.toUpperCase()}`, 15, 55);
      doc.text(`ORDEN: #${nroOrden}`, 15, 60);

      autoTable(doc, {
        startY: 70,
        head: [['PRODUCTO', 'TALLE', 'CANT', 'SUBTOTAL']],
        body: $cartItems.map(i => [
          i.titulo.toUpperCase(), 
          i.talle || 'N/A',
          i.quantity, 
          `$${(i.precio * i.quantity).toLocaleString('es-AR')}`
        ]),
        headStyles: { fillColor: [125, 57, 235], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
      });

      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.text(`TOTAL FINAL: $${total.toLocaleString('es-AR')}`, 15, finalY);

      doc.save(`Orden LYA ${nroOrden}.pdf`);

      const detalleWS = $cartItems
        .map(i => `%0A📦 *${i.titulo.toUpperCase()}*%0A      Talle: ${i.talle || 'S/T'} | Cant: ${i.quantity}%0A      Subtotal: $${(i.precio * i.quantity).toLocaleString('es-AR')}`)
        .join('%0A');

      const msg = `*NUEVO PEDIDO - L%26A REMERAS*%0A` +
                  `----------------------------------%0A` +
                  `👤 *CLIENTE:* ${customer.name.toUpperCase()}%0A` +
                  `📍 *LOCALIDAD:* ${customer.city.toUpperCase()}%0A` +
                  `🔢 *ORDEN:* %23${nroOrden}%0A` +
                  `----------------------------------%0A` +
                  `🛒 *DETALLE DEL PEDIDO:*${detalleWS}%0A%0A` +
                  `----------------------------------%0A` +
                  `💰 *TOTAL A PAGAR: $${total.toLocaleString('es-AR')}*%0A` +
                  `----------------------------------%0A` +
                  `_El cliente ya descargó su comprobante PDF._`;

      window.open(`https://wa.me/5491140486522?text=${msg}`, '_blank');

      clearCart();
      closeDrawer();
      setCustomer({ name: '', city: '' });

    } catch (err) {
      console.error("Error:", err);
      alert("HUBO UN PROBLEMA AL GENERAR EL PEDIDO.");
    }
  };

  if (!$isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex justify-end overflow-hidden">
      <div 
        className={`absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'}`} 
        onClick={closeDrawer} 
      />
      
      <div className={`relative w-full max-w-md bg-[#080808] border-l border-white/10 h-full flex flex-col shadow-2xl transform transition-transform duration-500 ease-out ${animate ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
          <div>
            <h2 className="font-raw text-3xl md:text-4xl uppercase tracking-tighter text-[#C6FF33] leading-none">Tu Carrito</h2>
            <p className="text-[8px] font-black text-white/40 tracking-[0.3em] mt-2 uppercase italic">L&A Remeras // Order System</p>
          </div>
          <button onClick={closeDrawer} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C6FF33] hover:border-[#C6FF33] hover:rotate-90 transition-all duration-500">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-[#080808]">
          {$cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <div className="w-10 h-10 border border-white/20 rotate-45 mb-4 animate-pulse" />
              <p className="font-black uppercase text-[10px] tracking-[0.3em] text-white">Vacío</p>
            </div>
          ) : (
            $cartItems.map((item) => (
              <div key={`${item.id}-${item.talle}`} className="flex gap-4 group relative border-b border-white/[0.03] pb-6 last:border-0">
                <div className="relative w-20 h-24 bg-[#0D0D0D] border border-white/10 overflow-hidden shrink-0 shadow-lg">
                  <img src={item.imagen} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.titulo} />
                </div>
                
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="text-[12px] font-black uppercase text-white tracking-tight leading-tight truncate pr-2">
                        {item.titulo}
                      </h4>
                      <p className="text-[#7D39EB] text-[11px] font-black uppercase tracking-widest mt-1 italic">
                        Talle: {item.talle || 'S/T'}
                      </p>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id, item.talle)} 
                      className="group/del flex items-center gap-1.5 text-white/40 hover:text-red-500 transition-all duration-300"
                    >
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover/del:opacity-80 transition-opacity">
                        Eliminar
                      </span>
                      <div className="w-8 h-8 border border-white/20 flex items-center justify-center group-hover/del:border-red-500/50 group-hover/del:bg-red-500/10 transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-white/10 bg-black scale-90 origin-left">
                      <button onClick={() => handleDecrease(item)} className="w-8 h-8 flex items-center justify-center text-[#C6FF33] hover:bg-[#C6FF33]/10 transition-colors">-</button>
                      <span className="text-[12px] font-black text-white w-8 text-center border-x border-white/10">{item.quantity}</span>
                      <button onClick={() => handleIncrease(item)} className="w-8 h-8 flex items-center justify-center text-[#C6FF33] hover:bg-[#C6FF33]/10 transition-colors">+</button>
                    </div>
                    <p className="text-[#C6FF33] text-xl font-raw italic">${(item.precio * item.quantity).toLocaleString('es-AR')}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`p-6 md:p-8 bg-[#0D0D0D] border-t border-white/10 space-y-5 transition-all duration-700 delay-200 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="space-y-3">
            <div className="relative">
               <input type="text" value={customer.name} placeholder="NOMBRE COMPLETO" className="w-full bg-black border border-white/10 p-3 text-[11px] text-white outline-none focus:border-[#C6FF33] transition-all uppercase font-black tracking-widest placeholder:text-white/20" onChange={e => setCustomer({...customer, name: e.target.value})} />
            </div>
            <div className="relative">
               <input type="text" value={customer.city} placeholder="LOCALIDAD" className="w-full bg-black border border-white/10 p-3 text-[11px] text-white outline-none focus:border-[#C6FF33] transition-all uppercase font-black tracking-widest placeholder:text-white/20" onChange={e => setCustomer({...customer, city: e.target.value})} />
            </div>
          </div>

          <div className="flex justify-between items-end pt-2">
            <span className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em]">Total</span>
            <span className="text-[#ffffff] font-raw text-5xl leading-none italic">${total.toLocaleString('es-AR')}</span>
          </div>

          <button 
            disabled={$cartItems.length === 0} 
            onClick={handleCheckout} 
            className="w-full bg-[#C6FF33] text-black py-5 font-raw text-2xl hover:bg-white disabled:bg-white/5 disabled:text-white/20 transition-all uppercase italic tracking-tighter shadow-[0_0_30px_rgba(198,255,51,0.1)] active:scale-[0.98]"
          >
            Confirmar Pedido
          </button>
          
          <button onClick={closeDrawer} className="w-full text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all text-center">
            ← Volver al catálogo
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #C6FF33; 
          box-shadow: 0 0 10px rgba(198, 255, 51, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: #d4ff66;
          box-shadow: 0 0 15px rgba(198, 255, 51, 0.7);
        }
        .font-raw { font-family: 'Impact', 'Arial Black', sans-serif; }
      `}</style>
    </div>
  );
};

export default CartDrawer;