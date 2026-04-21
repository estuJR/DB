const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/categorias',  require('./routes/categorias'));
app.use('/api/productos',   require('./routes/productos'));
app.use('/api/clientes',    require('./routes/clientes'));
app.use('/api/empleados',   require('./routes/empleados'));
app.use('/api/ventas',      require('./routes/ventas'));
app.use('/api/reportes',    require('./routes/reportes'));
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/proveedores', require('./routes/proveedores'));

app.listen(3000, () => {
  console.log('Backend corriendo en puerto 3000');
});