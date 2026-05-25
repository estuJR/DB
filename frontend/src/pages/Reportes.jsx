import { useState, useEffect } from 'react'
import axios from '../api'

export default function Reportes() {
  const [porEmpleado, setPorEmpleado]   = useState([])
  const [masVendidos, setMasVendidos]   = useState([])
  const [resumenMes, setResumenMes]     = useState([])
  const [clientesActivos, setClientesActivos] = useState([])
  const [tab, setTab] = useState('empleados')
  const [empleadoId, setEmpleadoId]     = useState('')
  const [reporteEmp, setReporteEmp]     = useState(null)
  const [reporteError, setReporteError] = useState('')

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    const [e, p, m, c] = await Promise.all([
      axios.get('/api/reportes/ventas-por-empleado'),
      axios.get('/api/reportes/productos-mas-vendidos'),
      axios.get('/api/reportes/resumen-mensual'),
      axios.get('/api/reportes/clientes-activos')
    ])
    setPorEmpleado(e.data)
    setMasVendidos(p.data)
    setResumenMes(m.data)
    setClientesActivos(c.data)
  }

  const buscarReporteEmpleado = async () => {
    setReporteError('')
    setReporteEmp(null)
    try {
      const res = await axios.get(`/api/reportes/reporte-empleado/${empleadoId}`)
      setReporteEmp(res.data)
    } catch (e) {
      setReporteError(e.response?.data?.error || 'Error al consultar')
    }
  }

  const exportarCSV = (datos, nombre) => {
    if (datos.length === 0) return
    const headers = Object.keys(datos[0]).join(',')
    const filas   = datos.map(row => Object.values(row).join(',')).join('\n')
    const csv     = `${headers}\n${filas}`
    const blob    = new Blob([csv], { type: 'text/csv' })
    const url     = URL.createObjectURL(blob)
    const a       = document.createElement('a')
    a.href        = url
    a.download    = `${nombre}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h2>Reportes</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('empleados')} style={tab === 'empleados' ? btnActive : btnTab}>Ventas por empleado</button>
        <button onClick={() => setTab('productos')} style={tab === 'productos' ? btnActive : btnTab}>Productos más vendidos</button>
        <button onClick={() => setTab('mensual')}   style={tab === 'mensual'   ? btnActive : btnTab}>Resumen mensual</button>
        <button onClick={() => setTab('clientes')}  style={tab === 'clientes'  ? btnActive : btnTab}>Clientes activos</button>
        <button onClick={() => setTab('sp')}        style={tab === 'sp'        ? btnActive : btnTab}>Reporte por empleado (SP)</button>
      </div>

      {tab === 'empleados' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3>Ventas por empleado</h3>
            <button onClick={() => exportarCSV(porEmpleado, 'ventas_por_empleado')} style={btnExport}>⬇ Exportar CSV</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: '#2c3e50', color: 'white' }}>
                <th style={th}>Nombre</th>
                <th style={th}>Apellido</th>
                <th style={th}>Total ventas</th>
                <th style={th}>Monto total</th>
              </tr>
            </thead>
            <tbody>
              {porEmpleado.map((e, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{e.nombre}</td>
                  <td style={td}>{e.apellido}</td>
                  <td style={td}>{e.total_ventas}</td>
                  <td style={td}>Q{e.monto_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'productos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3>Productos más vendidos</h3>
            <button onClick={() => exportarCSV(masVendidos, 'productos_mas_vendidos')} style={btnExport}>⬇ Exportar CSV</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: '#2c3e50', color: 'white' }}>
                <th style={th}>Producto</th>
                <th style={th}>Unidades vendidas</th>
                <th style={th}>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {masVendidos.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{p.nombre}</td>
                  <td style={td}>{p.unidades_vendidas}</td>
                  <td style={td}>Q{p.ingresos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'mensual' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3>Resumen mensual</h3>
            <button onClick={() => exportarCSV(resumenMes, 'resumen_mensual')} style={btnExport}>⬇ Exportar CSV</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: '#2c3e50', color: 'white' }}>
                <th style={th}>Mes</th>
                <th style={th}>Cantidad de ventas</th>
                <th style={th}>Total ingresos</th>
              </tr>
            </thead>
            <tbody>
              {resumenMes.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{m.mes}</td>
                  <td style={td}>{m.cantidad_ventas}</td>
                  <td style={td}>Q{m.total_ingresos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'clientes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3>Clientes activos</h3>
            <button onClick={() => exportarCSV(clientesActivos, 'clientes_activos')} style={btnExport}>⬇ Exportar CSV</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: '#2c3e50', color: 'white' }}>
                <th style={th}>Nombre</th>
                <th style={th}>Apellido</th>
                <th style={th}>Email</th>
              </tr>
            </thead>
            <tbody>
              {clientesActivos.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{c.nombre}</td>
                  <td style={td}>{c.apellido}</td>
                  <td style={td}>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'sp' && (
        <div>
          <h3>Reporte por empleado (Stored Procedure)</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
            <input
              type="number" min="1" placeholder="ID del empleado"
              value={empleadoId} onChange={e => setEmpleadoId(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '180px' }}
            />
            <button onClick={buscarReporteEmpleado} style={btnActive}>Consultar SP</button>
          </div>
          {reporteError && <p style={{ color: 'red' }}>{reporteError}</p>}
          {reporteEmp && (
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: '#2c3e50', color: 'white' }}>
                  <th style={th}>Total ventas completadas</th>
                  <th style={th}>Monto total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={td}>{reporteEmp.total_ventas}</td>
                  <td style={td}>Q{reporteEmp.monto_total}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

const tableStyle = { width: '100%', borderCollapse: 'collapse' }
const th         = { padding: '10px', textAlign: 'left' }
const td         = { padding: '10px' }
const btnTab     = { background: '#ecf0f1', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }
const btnActive  = { background: '#2c3e50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }
const btnExport  = { background: '#27ae60', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' }