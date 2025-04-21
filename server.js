const express = require('express');
const connectDB = require('./src/db');
const Event = require('./src/models/eventModel');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

// Ruta para obtener todos los eventos
app.get('/api/eventos', async (req, res) => {
  try {
    const eventos = await Event.find();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Otras rutas para crear, actualizar y eliminar eventos...

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));