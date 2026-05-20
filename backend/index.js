const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.post('/api/Login', (req, res) => {
  console.log('Body recibido:', req.body);
  res.json({ 
    success: true, 
    message: 'Login funcionando',
    recibido: req.body
  });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});