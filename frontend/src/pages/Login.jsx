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
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('nombre', res.data.nombre)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.error || 'Error al iniciar sesión')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', width: '320px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Tienda — Login</h2>
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button onClick={handleLogin} style={btnStyle}>Entrar</button>
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }
const btnStyle   = { width: '100%', padding: '10px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }