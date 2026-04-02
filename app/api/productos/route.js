import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  titulo: { type: String, required: true, uppercase: true },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true, uppercase: true },
  imagen: { type: String, required: true },
  imagenes_extras: [String],
  stock: {
    S: Number, M: Number, L: Number, XL: Number, XXL: Number, PACK: Number
  },
  medidas: {
    S: { ancho: String, largo: String },
    M: { ancho: String, largo: String },
    L: { ancho: String, largo: String },
    XL: { ancho: String, largo: String },
    XXL: { ancho: String, largo: String },
    PACK: { unidades: String }
  }
}, { timestamps: true });

const Producto = mongoose.models.Producto || mongoose.model('Producto', ProductoSchema);

export async function GET() {
  try {
    await dbConnect();
    const productos = await Producto.find({}).sort({ createdAt: -1 });
    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const nuevoProducto = await Producto.create(body);
    return NextResponse.json(nuevoProducto);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { id, ...data } = await request.json();
    const actualizado = await Producto.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(actualizado);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Producto.findByIdAndDelete(id);
    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}