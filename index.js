const Area = require('./models/Area');

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

// Sincronización de catálogos filtrada
app.get('/api/sync/catalogos/:rol/:areaId?', async (req, res) => {
  const { rol, areaId } = req.params;
  try {
    const areas = await Area.find();
    let trabajadores;
    
    if (rol === 'admin') {
      trabajadores = await Trabajador.find();
    } else {
      trabajadores = await Trabajador.find({ areaId: areaId });
    }
    
    res.json({ trabajadores, areas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
