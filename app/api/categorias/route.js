import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Definimos el esquema si no existe
const CategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, uppercase: true },
  imagen_url: { type: String, required: true }
}, { timestamps: true });

const Categoria = mongoose.models.Categoria || mongoose.model('Categoria', CategoriaSchema);

export async function GET() {
  try {
    await dbConnect();
    const categorias = await Categoria.find({}).sort({ nombre: 1 });
    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const nuevaCategoria = await Categoria.create(body);
    return NextResponse.json(nuevaCategoria);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Categoria.findByIdAndDelete(id);
    return NextResponse.json({ message: "Categoría eliminada" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}