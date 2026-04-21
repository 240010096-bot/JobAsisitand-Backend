const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Configuración de CORS ---
// Permite que React (client) se comunique sin bloqueos de seguridad
app.use(cors());
app.use(express.json());

// --- Conexión a MongoDB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB Cloud"))
  .catch(err => console.error("Error de conexión:", err));

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

//////////////////////////////////////////////////////////////////////////
const Asistencia = require('./models/Asistencia');

// A. Servicio de Sincronización de Catálogos (GET)
app.get('/api/sync/catalogos', (req, res) => {
  const trabajadores = [
    { id: "1", nombre: "Juan Pérez" },
    { id: "2", nombre: "María García" }
  ];
  const parcelas = [
    { id: "P1", nombre: "Parcela Norte - Tomate" },
    { id: "P2", nombre: "Parcela Sur - Maíz" }
  ];

  res.json({ trabajadores, parcelas });
});

// B. Registro de Asistencia (POST) - CORREGIDO
app.post('/api/asistencia', async (req, res) => {
  try {
    // Intentamos guardar los datos
    const nuevaAsistencia = new Asistencia(req.body);
    await nuevaAsistencia.save();
    res.status(201).json({ mensaje: "Registro guardado con éxito" });
  } catch (error) {
    // Si algo falla, el catch "atrapa" el error y lo muestra en la consola
    console.error("ERROR DETALLADO:", error);
    res.status(400).json({ error: error.message });
  }
});


// C. Consulta de Historial (GET)
app.get('/api/asistencia', async (req, res) => {
  try {
    const registros = await Asistencia.find();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener registros" });
  }
});

// D. Actualización de Estatus (PUT)
app.put('/api/asistencia/:id', async (req, res) => {
  // Lógica de actualización
});

// E. Eliminación Lógica (DELETE)
app.delete('/api/asistencia/:id', async (req, res) => {
  // Lógica de eliminación
});