const express = require('express');
const cors = require('cors'); // Necesario para permitir peticiones desde Vercel
const mongoose = require('mongoose'); // Necesario para la base de datos
require('dotenv').config(); // Para manejar tu conexión de forma segura

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARE (Lo que te faltaba) ---
app.use(cors()); // Permite peticiones desde cualquier origen (tu frontend)
app.use(express.json()); // Permite que el servidor entienda datos JSON

// --- IMPORTACIÓN DE MODELOS ---
const Area = require('./models/Area');
const Trabajador = require('./models/Trabajador'); 
const Asistencia = require('./models/Asistencia'); // <-- AGREGA ESTO
const Supervisor = require('./models/Supervisor');
const SupervisorArea = require('./models/SupervisorArea'); // <--- AGREGA ESTO



//////////////////////////////////////////////////////////////////////
app.get('/api/sync/catalogos/:rol', async (req, res) => {
  const { rol } = req.params;
  const { areaId } = req.query;
  
  try {
    const areas = await Area.find();
    
    // Obtenemos AMBOS grupos
    let trabajadores;
    let supervisores = await Supervisor.find(); // Traemos todos los supervisores
    
    if (rol === 'admin') {
      trabajadores = await Trabajador.find();
    } else {
      // Si no es admin, filtramos por área
      trabajadores = await Trabajador.find({ areaId: areaId });
      // Opcional: Filtrar supervisores si es necesario
      supervisores = await Supervisor.find({ areaId: areaId }); 
    }
    
    // RESPUESTA COMPLETA: El frontend ahora recibirá ambos
    res.json({ trabajadores, supervisores, areas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//////////////////////////////////////////////////////////////////


// ... (después de tus otras rutas, agrega esto)
/////////////////////////////////////////////////////////////////////
// Guardar Asistencia (Recibe los datos del frontend)
app.post('/api/asistencias', async (req, res) => {
  try {
    // Extraemos los datos del cuerpo de la petición
    const { trabajadorId, supervisorId, fecha, lat, lng } = req.body;

    // Creamos la instancia, transformando lat/lng al formato del Schema
    const nuevaAsistencia = new Asistencia({
      trabajadorId,
      supervisorId,
      fecha: fecha || new Date(),
      ubicacion: { lat, lng },
      offline: true // Marcamos que fue una sincronización posterior
    });

    await nuevaAsistencia.save();
    res.status(201).json({ message: "Asistencia guardada correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});// Asegúrate de tener este modelo
///////////////////////////////////////////////////////////////////////////




// Ruta para registrar un nuevo supervisor
app.post('/api/supervisores', async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;
    
    const nuevoSupervisor = new Supervisor({
      nombre,
      apellido,
      email,
      password, // OJO: Usa bcrypt para encriptar esto en producción
      rol
    });

    await nuevoSupervisor.save();
    res.status(201).json({ message: "Supervisor creado exitosamente", nuevoSupervisor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




///////////////////////////////////////////////////////////////////////////


// Agrega esto en tu index.js (Backend)
app.post('/api/trabajadores', async (req, res) => {
  try {
    const nuevoTrabajador = new Trabajador(req.body);
    await nuevoTrabajador.save();
    res.status(201).json(nuevoTrabajador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//////////////////////////////////////////////////////


// Ruta para verificar credenciales (Login)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscamos al usuario en MongoDB
    const usuario = await Supervisor.findOne({ email, password });
    
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    
    // Si existe, devolvemos los datos
    res.json({ message: "Login exitoso", usuario });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});


// En tu archivo index.js (backend)
app.post('/api/register', async (req, res) => {
    console.log("Datos recibidos en backend:", req.body); // <--- DEBUG AQUÍ
    
    try {
        const nuevoUsuario = new Supervisor(req.body);
        await nuevoUsuario.save();
        res.status(201).json({ message: "Usuario guardado" });
    } catch (error) {
        console.error("Error al guardar en MongoDB:", error); // <--- MIRA ESTO
        res.status(500).json({ error: error.message });
    }
});



// --- RUTA PARA GUARDAR LA RELACIÓN SUPERVISOR-ÁREA ---
app.post('/api/relaciones', async (req, res) => {
  try {
    const { supervisorId, areaId } = req.body;

    // Validación básica
    if (!supervisorId || !areaId) {
      return res.status(400).json({ error: "supervisorId y areaId son requeridos" });
    }

    const nuevaRelacion = new SupervisorArea({
      supervisorId,
      areaId
    });

    await nuevaRelacion.save();
    res.status(201).json({ message: "Relación guardada", nuevaRelacion });
  } catch (error) {
    console.error("Error al guardar relación:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas exitosamente'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// --- TUS RUTAS (Mantenidas sin cambios) ---

// Crear Área (Solo Admin)
app.post('/api/areas', async (req, res) => {
  try {
    const nuevaArea = new Area(req.body);
    await nuevaArea.save();
    res.status(201).json(nuevaArea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
