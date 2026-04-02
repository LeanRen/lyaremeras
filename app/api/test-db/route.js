import { dbConnect } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ 
      status: "Conectado", 
      message: "MongoDB Atlas está respondiendo correctamente" 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: "Error", 
      message: error.message 
    }, { status: 500 });
  }
}