import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'
import Reportes from './pages/Reportes'

const PERMISOS = {
  rol_gerente:   ['productos', 'clientes', 'ventas', 'reportes'],
  rol_vendedor:  ['productos', 'clientes', 'ventas', 'reportes'],
  rol_cajero:    ['clientes', 'ventas'],
  rol_bodeguero: ['productos'],
  rol_consultor: ['reportes'],
}

export function puedeVer(seccion) {
  const rol = localStorage.getItem('rol_db') || 'rol_consultor'
  return (PERMISOS[rol] || []).includes(seccion)
}

function RutaProtegida({ seccion, children }) {
  if (!localStorage.getItem('token')) return <Navigate to="/login" />
  if (!puedeVer(seccion)) return <Navigate to="/" />
  return children
}

function PaginaInicio() {
  if (puedeVer('productos'))  return <Navigate to="/productos" />
  if (puedeVer('clientes'))   return <Navigate to="/clientes" />
  if (puedeVer('ventas'))     return <Navigate to="/ventas" />
  return <Navigate to="/reportes" />
}

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<PaginaInicio />} />
          <Route path="productos" element={
            <RutaProtegida seccion="productos"><Productos /></RutaProtegida>
          } />
          <Route path="clientes" element={
            <RutaProtegida seccion="clientes"><Clientes /></RutaProtegida>
          } />
          <Route path="ventas" element={
            <RutaProtegida seccion="ventas"><Ventas /></RutaProtegida>
          } />
          <Route path="reportes" element={
            <RutaProtegida seccion="reportes"><Reportes /></RutaProtegida>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
