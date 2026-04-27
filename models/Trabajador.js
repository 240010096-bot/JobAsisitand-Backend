const mongoose = require('mongoose');

const TrabajadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  areaId: { type: String, required: true },
  telefono: String,
  curp: String
});

module.exports = mongoose.model('Trabajador', TrabajadorSchema);
