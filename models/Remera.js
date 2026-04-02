import mongoose from 'mongoose';

const RemeraSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String }, // URL de la foto
  stock: { type: Number, default: 0 },
  categoria: { type: String } // Ej: "Hombre", "Niños", "Pack x10"
}, { timestamps: true });

export default mongoose.models.Remera || mongoose.model('Remera', RemeraSchema);