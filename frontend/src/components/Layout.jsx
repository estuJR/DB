import { Outlet, Link, useNavigate } from 'react-router-dom'
import { puedeVer } from '../App'

export default function Layout() {
  const navigate = useNavigate()
  const nombre = localStorage.getItem('nombre')
  const cargo  = localStorage.getItem('cargo')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    localStorage.removeItem('cargo')
    localStorage.removeItem('rol_db')
    navigate('/login')
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ background: '#2c3e50', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {puedeVer('productos') && <Link to="/productos" style={linkStyle}>Productos</Link>}
          {puedeVer('clientes')  && <Link to="/clientes"  style={linkStyle}>Clientes</Link>}
          {puedeVer('ventas')    && <Link to="/ventas"    style={linkStyle}>Ventas</Link>}
          {puedeVer('reportes')  && <Link to="/reportes"  style={linkStyle}>Reportes</Link>}
        </div>
        <div style={{ color: 'white', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>{nombre} <span style={{ opacity: 0.7, fontSize: '13px' }}>({cargo})</span></span>
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
