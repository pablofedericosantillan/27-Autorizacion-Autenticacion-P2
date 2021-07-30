const mongoose = require('mongoose');

const schema = mongoose.Schema({
    timestamp: { type: String, required: true, max: 100 },
    nombre: { type: String, required: true, max: 100 },
    descripcion: { type: String, required: true, max: 100 },
    codigo: { type: String, required: true},//, unique: true},
    thumbnail: { type: String, required: true, max: 100 },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true }
});

const Productos = mongoose.model('productos', schema);

module.exports = Productos;
