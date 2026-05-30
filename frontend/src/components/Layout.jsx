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
    <>
      <nav className="navbar">
        <div className="flex flex-center gap-12">
          <span className="navbar-brand">🏪 Tienda <span>GT</span></span>
          <div className="navbar-links">
            {puedeVer('productos') && <Link to="/productos" className="nav-link">Productos</Link>}
            {puedeVer('clientes')  && <Link to="/clientes"  className="nav-link">Clientes</Link>}
            {puedeVer('ventas')    && <Link to="/ventas"    className="nav-link">Ventas</Link>}
            {puedeVer('reportes')  && <Link to="/reportes"  className="nav-link">Reportes</Link>}
          </div>
        </div>
        <div className="navbar-user">
          <div className="user-pill">
            <strong>{nombre}</strong> <span>· {cargo}</span>
          </div>
          <button onClick={logout} className="btn-logout">Cerrar sesión</button>
        </div>
      </nav>
      <div className="page">
        <Outlet />
      </div>
    </>
  )
}
