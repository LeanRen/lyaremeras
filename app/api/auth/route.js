import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb'; // Corregido: de connectDB a dbConnect

export async function POST(request) {
  try {
    await dbConnect(); // Uso del nombre correcto de la función
    const { email, password } = await request.json();

    // Verificación simple con tus variables de entorno
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Credenciales incorrectas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
  }
}