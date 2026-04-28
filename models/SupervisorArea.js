const mongoose = require('mongoose');

const SupervisorAreaSchema = new mongoose.Schema({
  supervisorId: { type: String, required: true }, // O mongoose.Schema.Types.ObjectId
  areaId: { type: String, required: true }
});

module.exports = mongoose.model('SupervisorArea', SupervisorAreaSchema);
