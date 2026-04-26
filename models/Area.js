const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  pagoPorHora: { type: Number, required: true }
});

module.exports = mongoose.model('Area', AreaSchema);
