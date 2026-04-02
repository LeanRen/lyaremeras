import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String, required: true },
  imagenes_extras: [String],
  stock: {
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 },
    XXL: { type: Number, default: 0 },
    PACK: { type: Number, default: 0 }
  },
  medidas: {
    S: { ancho: String, largo: String },
    M: { ancho: String, largo: String },
    L: { ancho: String, largo: String },
    XL: { ancho: String, largo: String },
    XXL: { ancho: String, largo: String },
    PACK: { unidades: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Esta línea es vital para que Next.js no cree el modelo dos veces en desarrollo
const Producto = mongoose.models.Producto || mongoose.model('Producto', ProductoSchema);
export default Producto;