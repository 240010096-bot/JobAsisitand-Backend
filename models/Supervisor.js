// models/Supervisor.js
const mongoose = require('mongoose');

const SupervisorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, required: true }, // 'encargado', 'admin', etc.
  areaId: String // Para relacionarlo con áreas
});

module.exports = mongoose.model('Supervisor', SupervisorSchema);
