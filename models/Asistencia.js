const mongoose = require('mongoose');

const AsistenciaSchema = new mongoose.Schema({
  trabajadorId: String,
  supervisorId: String,
  fecha: { type: Date, default: Date.now },
  ubicacion: {
    lat: Number,
    lng: Number
  },
  offline: { type: Boolean, default: false } // Indica si se sincronizó después [cite: 121]
});

module.exports = mongoose.model('Asistencia', AsistenciaSchema);