import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // Importamos la conexión por si quieres trackear intentos

export async function POST(request) {
  try {
    // Opcional: Asegurar conexión con Mongo (útil si luego guardas historial de login)
    await connectDB();

    const { email, password } = await request.json();

    // Diagnóstico en consola de servidor
    console.log("LOGIN_ATTEMPT:", {
      emailEnviado: email,
      configuracionOk: !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD)
    });

    // Verificación contra variables de entorno
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      
      // Enviamos success: true y un flag para el frontend
      const response = NextResponse.json({ 
        success: true,
        message: "Autenticación exitosa" 
      });

      // Seteamos la Cookie de seguridad (Solo lectura por servidor)
      response.cookies.set('isLogged', 'true', { 
        path: '/', 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 horas
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Credenciales inválidas" }, 
      { status: 401 }
    );

  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}