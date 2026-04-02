'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';

export default function AdminPage() {
  const router = useRouter();
  
  // --- ESTADOS DE DATOS ---
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // --- ESTADOS DE FORMULARIO ---
  const initialForm = { 
    _id: null, titulo: '', precio: '', categoria: '', imagen: '', 
    imagenes_extras: [],
    stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0, PACK: 0 },
    medidas: { 
      S: { ancho: '', largo: '' }, 
      M: { ancho: '', largo: '' }, 
      L: { ancho: '', largo: '' }, 
      XL: { ancho: '', largo: '' }, 
      XXL: { ancho: '', largo: '' },
      PACK: { unidades: '' } 
    }
  };
  
  const initialCatForm = { _id: null, nombre: '', imagen_url: '' };

  const [form, setForm] = useState(initialForm);
  const [catForm, setCatForm] = useState(initialCatForm);

  useEffect(() => {
    if (localStorage.getItem('isLogged') !== 'true') {
      router.push('/login');
    } else {
      fetchData();
    }
  }, [router]);

  async function fetchData() {
    try {
      setLoading(true);
      const [resProd, resCat] = await Promise.all([
        fetch('/api/productos'),
        fetch('/api/categorias')
      ]);
      
      const prodData = await resProd.json();
      const catData = await resCat.json();
      
      setProductos(Array.isArray(prodData) ? prodData : []);
      setCategorias(Array.isArray(catData) ? catData : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isLogged');
    router.push('/login');
  };

  // --- GESTIÓN DE CATEGORÍAS ---
  const saveCategory = async () => {
    if (!catForm.nombre || !catForm.imagen_url) return alert("COMPLETÁ NOMBRE E IMAGEN");
    try {
      const body = { 
        nombre: catForm.nombre.toUpperCase().trim(), 
        imagen_url: catForm.imagen_url 
      };
      
      const res = await fetch('/api/categorias', {
        method: catForm._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm._id ? { id: catForm._id, ...body } : body)
      });

      if (res.ok) {
        alert("CATEGORÍA GUARDADA");
        setCatForm(initialCatForm);
        fetchData();
      }
    } catch (error) {
      alert("Error al guardar categoría");
    }
  };

  const deleteCategory = async (id, nombre) => {
    if (!confirm(`¿BORRAR CATEGORÍA ${nombre}?`)) return;
    const res = await fetch(`/api/categorias?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  // --- GESTIÓN DE PRODUCTOS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imagen) return alert("SUBÍ AL MENOS UNA IMAGEN");
    if (!form.categoria) return alert("SELECCIONÁ CATEGORÍA");
    
    setUploading(true);
    try {
      const body = {
        titulo: form.titulo.toUpperCase(),
        precio: parseFloat(form.precio),
        categoria: form.categoria.toUpperCase().trim(),
        stock: form.stock,
        medidas: form.medidas,
        imagen: form.imagen,
        imagenes_extras: form.imagenes_extras
      };

      const res = await fetch('/api/productos', {
        method: form._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form._id ? { id: form._id, ...body } : body),
      });

      if (res.ok) {
        alert("PRODUCTO GUARDADO");
        setForm(initialForm);
        fetchData();
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("¿BORRAR PRODUCTO?")) return;
    const res = await fetch(`/api/productos?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  if (loading) return <div className="bg-black h-screen flex items-center justify-center text-[#C6FF33] font-raw text-2xl animate-pulse italic uppercase">Cargando...</div>;

  return (
    <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <h2 className="text-4xl md:text-5xl font-raw italic uppercase text-[#C6FF33]">Panel Control</h2>
        <button onClick={handleLogout} className="group flex items-center gap-3 border border-white/10 px-5 py-2 hover:border-red-500/50 bg-white/[0.02]">
          <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-red-500">Cerrar Sesión</span>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
        </button>
      </div>

      {/* GESTIÓN CATEGORÍAS */}
      <section className="mb-20">
        <h3 className="text-xl font-raw italic uppercase mb-8 text-white/40">// Gestión Categorías</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end bg-[#050505] p-6 border border-white/5 mb-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold opacity-50 uppercase">{catForm._id ? "Editando Nombre" : "Nuevo Nombre"}</p>
            <input type="text" className="w-full bg-white/5 border border-white/10 p-4 text-xs outline-none focus:border-[#C6FF33] uppercase font-bold text-white" value={catForm.nombre} onChange={e => setCatForm({...catForm, nombre: e.target.value})} placeholder="EJ: OVERSIZE" />
          </div>

          <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result) => setCatForm({ ...catForm, imagen_url: result.info.secure_url })}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className="border border-dashed border-white/20 p-4 text-center h-[52px] flex items-center justify-center bg-white/[0.02] hover:border-[#C6FF33] transition-colors">
                <p className="text-[10px] font-black uppercase">{catForm.imagen_url ? "Imagen Lista ✓" : "Cargar Portada"}</p>
              </button>
            )}
          </CldUploadWidget>

          <div className="flex gap-2">
            <button onClick={saveCategory} className="flex-1 bg-[#C6FF33] text-black h-[52px] font-black uppercase text-[11px] hover:bg-white transition-all">{catForm._id ? "Actualizar" : "Guardar"}</button>
            {catForm._id && <button onClick={() => setCatForm(initialCatForm)} className="px-4 bg-white/10 text-white h-[52px] text-[10px] uppercase font-bold">X</button>}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categorias.map(cat => (
            <div key={cat._id} className="group relative aspect-square bg-[#080808] border border-white/5 overflow-hidden">
              <img src={cat.imagen_url} className="w-full h-full object-cover opacity-40 group-hover:opacity-60" alt={cat.nombre} />
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest">{cat.nombre}</p>
                <div className="flex gap-1 translate-y-10 group-hover:translate-y-0 transition-transform">
                  <button onClick={() => setCatForm(cat)} className="flex-1 bg-white text-black text-[8px] font-black py-1">Editar</button>
                  <button onClick={() => deleteCategory(cat._id, cat.nombre)} className="flex-1 bg-red-600 text-white text-[8px] font-black py-1">X</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* FORMULARIO PRODUCTOS */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#050505] p-8 border border-white/5 shadow-2xl relative">
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-[#7D39EB] text-white text-[10px] font-black px-4 py-1 uppercase italic tracking-widest">
                {form._id ? 'Editando Producto' : 'Nuevo Producto'}
              </span>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Título</p>
            <input type="text" className="w-full bg-white/5 border border-white/10 p-4 text-xs outline-none focus:border-[#C6FF33] font-bold uppercase text-white" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-bold opacity-30 uppercase">Precio</p>
              <input type="number" className="w-full bg-white/5 border border-white/10 p-4 text-xs outline-none focus:border-[#C6FF33] font-bold text-white" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold opacity-30 uppercase">Categoría</p>
              <select className="w-full bg-black border border-white/10 p-4 text-xs font-bold outline-none focus:border-[#C6FF33] uppercase text-white" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required >
                <option value="" disabled>SELECCIONAR...</option>
                {categorias.map(cat => <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Stock & Especificaciones:</p>
            {['S', 'M', 'L', 'XL', 'XXL', 'PACK'].map(talle => (
              <div key={talle} className={`grid ${talle === 'PACK' ? 'grid-cols-3' : 'grid-cols-4'} gap-2 items-center bg-black/50 p-2 border border-white/5`}>
                <span className={`font-raw text-xl text-center ${talle === 'PACK' ? 'text-[#C6FF33]' : 'text-[#7D39EB]'}`}>{talle}</span>
                <input type="number" placeholder="STOCK" className="bg-white/5 border border-white/5 p-2 text-[10px] text-center outline-none text-white" value={form.stock[talle]} onChange={e => setForm({...form, stock: {...form.stock, [talle]: parseInt(e.target.value) || 0}})} />
                {talle === 'PACK' ? (
                  <select className="bg-[#C6FF33] border border-[#C6FF33]/1 p-2 text-[10px] text-center outline-none text-black font-bold" value={form.medidas?.PACK?.unidades || ''} onChange={e => setForm({...form, medidas: {...form.medidas, PACK: { unidades: e.target.value }}})}>
                    <option value="">CANTIDAD...</option>
                    <option value="5">PACK X5</option>
                    <option value="10">PACK X10</option>
                    <option value="20">PACK X20</option>
                    <option value="50">PACK X50</option>
                    <option value="100">PACK X100</option>
                  </select>
                ) : (
                  <>
                    <input type="text" placeholder="ANCHO" className="bg-white/5 border border-white/5 p-2 text-[10px] text-center outline-none text-white" value={form.medidas[talle]?.ancho || ''} onChange={e => setForm({...form, medidas: {...form.medidas, [talle]: {...form.medidas[talle], ancho: e.target.value}}})} />
                    <input type="text" placeholder="LARGO" className="bg-white/5 border border-white/5 p-2 text-[10px] text-center outline-none text-white" value={form.medidas[talle]?.largo || ''} onChange={e => setForm({...form, medidas: {...form.medidas, [talle]: {...form.medidas[talle], largo: e.target.value}}})} />
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Galería:</p>
            <div className="grid grid-cols-3 gap-3">
              {form.imagen && (
                <div className="relative aspect-square border border-[#C6FF33] bg-white/5 group">
                  <img src={form.imagen} className="w-full h-full object-cover" alt="Principal" />
                  <p className="absolute bottom-0 w-full bg-[#C6FF33] text-black text-[7px] font-bold text-center uppercase">Principal</p>
                </div>
              )}
              {form.imagenes_extras?.map((url, idx) => (
                <div key={idx} className="relative aspect-square border border-white/10 bg-white/5 group">
                  <img src={url} className="w-full h-full object-cover" alt="Extra" />
                  <button type="button" onClick={() => setForm({...form, imagenes_extras: form.imagenes_extras.filter((_, i) => i !== idx)})} className="absolute top-0 right-0 bg-red-600 p-1 text-[8px]">X</button>
                </div>
              ))}
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result) => {
                  if (!form.imagen) setForm({ ...form, imagen: result.info.secure_url });
                  else setForm({ ...form, imagenes_extras: [...(form.imagenes_extras || []), result.info.secure_url] });
                }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="aspect-square border-2 border-dashed border-white/10 hover:border-[#C6FF33] flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <span className="text-2xl text-white/20">+</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-[#7D39EB] text-white py-6 font-raw text-3xl hover:bg-[#C6FF33] hover:text-black transition-all uppercase italic">
            {uploading ? 'PROCESANDO...' : (form._id ? 'ACTUALIZAR PRODUCTO' : 'SUBIR PRODUCTO')}
          </button>
          {form._id && <button type="button" onClick={() => setForm(initialForm)} className="w-full text-[10px] text-zinc-500 uppercase font-bold underline mt-2">Cancelar Edición</button>}
        </form>

        {/* LISTADO INVENTARIO */}
        <section className="space-y-6">
          <h3 className="font-raw text-4xl uppercase italic border-b border-white/10 pb-4">Inventario</h3>
          <div className="space-y-4 overflow-y-auto max-h-[800px] pr-2">
            {productos.map(p => (
              <div key={p._id} className="bg-[#0A0A0A] p-4 border border-white/5 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <img src={p.imagen} className="w-12 h-16 object-cover" alt={p.titulo} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">{p.titulo}</p>
                    <div className="flex gap-2 items-center">
                      <p className="text-[#C6FF33] font-raw text-xl">${p.precio}</p>
                      {p.stock?.PACK > 0 && <span className="bg-[#C6FF33] text-black text-[9px] px-1 font-black">PACK X{p.medidas?.PACK?.unidades || '0'}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { 
                    const normalized = { ...p, stock: { ...initialForm.stock, ...p.stock }, medidas: { ...initialForm.medidas, ...p.medidas } };
                    setForm(normalized); 
                    window.scrollTo(0,0); 
                  }} className="p-2 border border-white/10 text-[8px] uppercase hover:bg-white hover:text-black transition-colors">Editar</button>
                  <button onClick={() => deleteProduct(p._id)} className="p-2 border border-red-50/20 text-red-500 text-[8px] uppercase hover:bg-red-500 hover:text-white transition-colors">Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}