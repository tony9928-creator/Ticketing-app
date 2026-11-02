const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para que el servidor entienda formato JSON
app.use(express.json());

// Ruta de prueba para verificar que funciona
app.get('/', (req, res) => {
    res.json({ mensaje: "¡API del Bootcamp funcionando correctamente! 🚀" });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});