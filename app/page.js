'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CardRemera from '../components/CardRemera';
import ModalDetalles from '../components/ModalDetalles'; 

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productoSel, setProductoSel] = useState(null);

  useEffect(() => {
    async function fetchHome() {
      try {
        setLoading(true);
        // Llamamos a nuestras APIs de Next.js que conectan con MongoDB
        const [resProductos, resCategorias] = await Promise.all([
          fetch('/api/productos'),
          fetch('/api/categorias')
        ]);

        const dataProd = await resProductos.json();
        const dataCat = await resCategorias.json();

        if (Array.isArray(dataProd)) setProductos(dataProd);
        if (Array.isArray(dataCat)) setCategorias(dataCat);
        
      } catch (err) {
        console.error("Error cargando home:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHome();
  }, []);

  // Tomamos los últimos 4 productos para la sección Novedades
  const novedades = productos.slice(0, 4);

  if (loading) return (
    <div className="bg-black h-screen flex items-center justify-center text-[#C6FF33] font-raw text-xl md:text-3xl animate-pulse italic uppercase">
      Cargando L&A...
    </div>
  );

  return (
    <main className="bg-black text-white min-h-screen selection:bg-[#C6FF33] selection:text-black overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="h-[75vh] md:h-[95vh] relative flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img src="/portada.png" className="w-full h-full object-cover opacity-60" alt="L&A Remeras" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black" />
        </div>
        <div className="relative z-10 text-center px-6 md:px-12">
           <h1 className="text-[12vw] md:text-[7.5vw] font-raw italic uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
             BIENVENIDOS A<br/>
             <span className="text-[#C6FF33]">L&A REMERAS</span>
           </h1>
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-raw italic uppercase mb-16 border-l-4 border-[#C6FF33] pl-6">Colecciones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categorias.map((cat) => (
            <Link 
              key={cat._id} // MongoDB usa _id
              href={`/productos?categoria=${encodeURIComponent(cat.nombre)}`}
              className="group relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#0A0A0A] hover:border-[#C6FF33]/30 transition-all duration-500"
            >
              <img src={cat.imagen_url} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-all duration-1000" alt={cat.nombre} />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-transparent">
                <h3 className="text-3xl md:text-4xl font-raw italic uppercase leading-none">{cat.nombre}</h3>
                <div className="h-[3px] w-12 bg-[#C6FF33] mt-2 group-hover:w-full transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIÓN NOVEDADES */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto bg-[#050505] rounded-3xl md:rounded-[4rem] mb-10">
        <h3 className="font-raw text-4xl md:text-6xl italic uppercase mb-16 text-center">Novedades</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {novedades.map((p, idx) => (
            <CardRemera 
              key={p._id} // MongoDB usa _id
              {...p} 
              index={idx}
              onVerDetalles={() => setProductoSel(p)} 
            /> 
          ))}
        </div>
      </section>

      {/* REVENDEDOR */}
      <section className="py-24 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-[5vw] font-raw italic uppercase mb-20 tracking-tighter">¿Querés ser Revendedor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { t: 'Precios Mayoristas', d: 'Márgenes de ganancia competitivos para tu negocio.' },
              { t: 'Pack Emprendedor', d: 'Iniciá con curvas de talles y modelos a elección.' },
              { t: 'Calidad Superior', d: 'Algodón 24/1 premium con estampa DTF indestructible.' }
            ].map((item, i) => (
              <div key={`beneficio-${i}`} className="space-y-4">
                <p className="text-sm font-black text-[#C6FF33] tracking-widest uppercase italic font-raw">// {item.t}</p>
                <p className="text-[11px] font-clean leading-relaxed uppercase text-white/40 max-w-[200px] mx-auto">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DE DETALLES */}
      {productoSel && (
        <ModalDetalles 
          producto={productoSel} 
          onClose={() => setProductoSel(null)} 
        />
      )}
    </main>
  );
}