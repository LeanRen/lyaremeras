'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirigir si ya está logueado
  useEffect(() => {
    if (localStorage.getItem('isLogged') === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Apuntamos a la carpeta que tenés: /api/auth
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('isLogged', 'true');
        // Forzamos recarga para limpiar estados previos
        window.location.href = '/admin';
      } else {
        setError(data.error || "DATOS INCORRECTOS");
      }
    } catch (err) {
      setError("ERROR DE CONEXIÓN CON EL SERVIDOR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 selection:bg-[#C6FF33]">
      <div className="w-full max-w-md space-y-10 bg-[#080808] p-10 border border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#7D39EB]"></div>
        
        <header className="text-center">
          <h1 className="text-7xl font-raw italic uppercase text-white leading-none">
            L<span className="text-[#7D39EB]">&</span>A
          </h1>
          <p className="text-[#C6FF33] font-raw italic text-2xl uppercase">Auth_System</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            type="email" placeholder="EMAIL" 
            className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white uppercase outline-none focus:border-[#C6FF33]"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <input 
            type="password" placeholder="CONTRASEÑA" 
            className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white outline-none focus:border-[#C6FF33]"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />

          {error && (
            <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 p-2 border border-red-500/20">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="w-full py-6 bg-[#7D39EB] text-white font-raw text-3xl italic uppercase hover:bg-[#C6FF33] hover:text-black transition-all">
            {loading ? 'Validando...' : 'Entrar_'}
          </button>
        </form>
      </div>
    </main>
  );
}