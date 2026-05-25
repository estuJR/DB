const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  const [rows] = await db.query(
    'SELECT * FROM empleados WHERE email = ?', [email]
  );
  if (rows.length === 0)
    return res.status(401).json({ error: 'Credenciales inválidas' });

  const empleado = rows[0];
  const valido = await bcrypt.compare(password, empleado.password_hash);
  if (!valido)
    return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign(
    { id: empleado.id_empleado, cargo: empleado.cargo, rol_db: empleado.rol_db },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, nombre: empleado.nombre, cargo: empleado.cargo, rol_db: empleado.rol_db });
});

module.exports = router;