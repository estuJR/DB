import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const nombre = localStorage.getItem('nombre')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    navigate('/login')
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ background: '#2c3e50', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/"         style={linkStyle}>Productos</Link>
          <Link to="/clientes" style={linkStyle}>Clientes</Link>
          <Link to="/ventas"   style={linkStyle}>Ventas</Link>
          <Link to="/reportes" style={linkStyle}>Reportes</Link>
        </div>
        <div style={{ color: 'white', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>Hola, {nombre}</span>
          <button onClick={logout} style={btnStyle}>Cerrar sesión</button>
        </div>
      </nav>
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  )
}

const linkStyle = { color: 'white', textDecoration: 'none', fontSize: '16px' }
const btnStyle  = { background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }