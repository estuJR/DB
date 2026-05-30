import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      setError('')
      const res = await axios.post('http://localhost:4875/api/auth/login', { email, password })
      localStorage.setItem('token',  res.data.token)
      localStorage.setItem('nombre', res.data.nombre)
      localStorage.setItem('cargo',  res.data.cargo)
      localStorage.setItem('rol_db', res.data.rol_db)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.error || 'Error al iniciar sesión')
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🏪</div>
          <h1>Tienda GT</h1>
          <p>Sistema de gestión · CC3088</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="login-field">
          <label className="login-label">Correo electrónico</label>
          <input
            className="input"
            placeholder="usuario@tienda.gt"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <div className="login-field">
          <label className="login-label">Contraseña</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>Iniciar sesión</button>
      </div>
    </div>
  )
}
