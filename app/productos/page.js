'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CardRemera from '@/components/CardRemera';
import ModalDetalles from '@/components/ModalDetalles';
import SkeletonCard from '@/components/SkeletonCard';

function CatalogoContenido() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODOS');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1. Carga de datos desde MongoDB APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/productos'),
          fetch('/api/categorias')
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        // MongoDB usa _id en lugar de id
        if (Array.isArray(prodData)) setProductos(prodData);
        if (Array.isArray(catData)) setCategorias(catData);
      } catch (error) {
        console.error("Error al cargar el catálogo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Sincronización con la URL (Categoría)
  useEffect(() => {
    const catUrl = searchParams.get('categoria');
    if (catUrl) setCategoriaSeleccionada(catUrl.toUpperCase());
    else setCategoriaSeleccionada('TODOS');
  }, [searchParams]);

  // 3. Control del Modal mediante _id en la URL
  useEffect(() => {
    const idUrl = searchParams.get('id');
    if (idUrl && productos.length > 0) {
      // Importante: Buscamos por _id (formato MongoDB)
      const encontrado = productos.find(p => p._id === idUrl);
      if (encontrado) setSelectedProduct(encontrado);
    }
  }, [searchParams, productos]);

  // Filtrado de productos (Case insensitive)
  const productosFiltrados = productos.filter(p => {
    const titulo = p.titulo?.toLowerCase() || '';
    const coincideBusqueda = titulo.includes(busqueda.toLowerCase());
    const coincideCategoria = 
      categoriaSeleccionada === 'TODOS' || 
      p.categoria?.toUpperCase() === categoriaSeleccionada.toUpperCase();
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <main className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER Y BUSCADOR */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-raw text-4xl md:text-5xl uppercase text-white italic tracking-tighter leading-none">
              Catálogo
            </h1>
            <p className="text-[#C6FF33] text-[9px] font-black uppercase tracking-[0.3em] mt-2 italic opacity-70">
              Colección 2026 / L&A Remeras
            </p>
          </div>
          <input 
            type="text" 
            placeholder="BUSCAR ARTÍCULO..." 
            className="w-full md:w-72 bg-white/5 border border-white/10 p-4 text-white uppercase text-[10px] font-bold outline-none focus:border-[#C6FF33] transition-all"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* FILTROS DE CATEGORÍA */}
        <div className="mb-12 flex flex-wrap gap-3">
          <button
            onClick={() => { 
              setCategoriaSeleccionada('TODOS'); 
              router.push('/productos', { scroll: false }); 
            }}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
              categoriaSeleccionada === 'TODOS' 
                ? 'bg-[#C6FF33] text-black border-[#C6FF33]' 
                : 'text-white/40 border-white/10 hover:border-white/30'
            }`}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat._id}
              onClick={() => {
                setCategoriaSeleccionada(cat.nombre.toUpperCase());
                router.push(`/productos?categoria=${cat.nombre.toLowerCase()}`, { scroll: false });
              }}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                categoriaSeleccionada === cat.nombre.toUpperCase() 
                  ? 'bg-[#7D39EB] text-white border-[#7D39EB]' 
                  : 'text-white/40 border-white/10 hover:border-white/30'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
          {loading ? (
            Array.from({ length: 10 }).map((_, n) => <SkeletonCard key={n} />)
          ) : (
            productosFiltrados.map((remera, index) => (
              <CardRemera 
                key={remera._id} 
                {...remera} 
                id={remera._id} // Pasamos _id explícitamente para los componentes hijos
                index={index} 
                onVerDetalles={() => {
                  setSelectedProduct(remera);
                  router.push(`/productos?id=${remera._id}`, { scroll: false });
                }} 
              />
            ))
          )}
        </div>

        {/* ESTADO VACÍO */}
        {!loading && productosFiltrados.length === 0 && (
          <div className="text-center py-40 border border-dashed border-white/5">
            <p className="text-white/20 font-raw uppercase italic tracking-[0.2em]">
              No se encontraron productos
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE DETALLES CON LIGHTBOX */}
      {selectedProduct && (
        <ModalDetalles 
          producto={selectedProduct} 
          onClose={() => { 
            setSelectedProduct(null); 
            router.push('/productos', { scroll: false }); 
          }} 
        />
      )}
    </main>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CatalogoContenido />
    </Suspense>
  );
}