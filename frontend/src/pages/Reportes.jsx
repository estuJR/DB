import { useState, useEffect } from 'react'
import axios from '../api'

export default function Reportes() {
  const [porEmpleado, setPorEmpleado]         = useState([])
  const [masVendidos, setMasVendidos]         = useState([])
  const [resumenMes, setResumenMes]           = useState([])
  const [clientesActivos, setClientesActivos] = useState([])
  const [vistaVentas, setVistaVentas]         = useState([])
  const [tab, setTab]           = useState('empleados')
  const [empleadoId, setEmpleadoId] = useState('')
  const [reporteEmp, setReporteEmp] = useState(null)
  const [reporteError, setReporteError] = useState('')

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    const [e, p, m, c, v] = await Promise.all([
      axios.get('/api/reportes/ventas-por-empleado'),
      axios.get('/api/reportes/productos-mas-vendidos'),
      axios.get('/api/reportes/resumen-mensual'),
      axios.get('/api/reportes/clientes-activos'),
      axios.get('/api/reportes/vista-ventas'),
    ])
    setPorEmpleado(e.data)
    setMasVendidos(p.data)
    setResumenMes(m.data)
    setClientesActivos(c.data)
    setVistaVentas(v.data)
  }

  const buscarReporteEmpleado = async () => {
    setReporteError(''); setReporteEmp(null)
    try {
      const res = await axios.get(`/api/reportes/reporte-empleado/${empleadoId}`)
      setReporteEmp(res.data)
    } catch (e) {
      setReporteError(e.response?.data?.error || 'Error al consultar')
    }
  }

  const exportarCSV = (datos, nombre) => {
    if (!datos.length) return
    const headers = Object.keys(datos[0]).join(',')
    const filas   = datos.map(row => Object.values(row).join(',')).join('\n')
    const blob    = new Blob([`${headers}\n${filas}`], { type: 'text/csv' })
    const url     = URL.createObjectURL(blob)
    const a       = document.createElement('a')
    a.href = url; a.download = `${nombre}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'empleados', label: 'Por empleado' },
    { id: 'productos', label: 'Más vendidos' },
    { id: 'mensual',   label: 'Resumen mensual' },
    { id: 'clientes',  label: 'Clientes activos' },
    { id: 'sp',        label: 'SP por empleado' },
    { id: 'vista',     label: 'Detalle ventas' },
  ]

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Reportes</h2>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={`tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'empleados' && (
        <div>
          <div className="section-header">
            <span className="section-title">Ventas por empleado</span>
            <button className="btn btn-success btn-sm" onClick={() => exportarCSV(porEmpleado, 'ventas_por_empleado')}>⬇ CSV</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Nombre</th><th>Apellido</th><th>Total ventas</th><th>Monto total</th></tr></thead>
              <tbody>
                {porEmpleado.map((e, i) => (
                  <tr key={i}>
                    <td>{e.nombre}</td>
                    <td>{e.apellido}</td>
                    <td><span className="badge badge-green">{e.total_ventas}</span></td>
                    <td style={{ fontWeight: 600 }}>Q{e.monto_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'productos' && (
        <div>
          <div className="section-header">
            <span className="section-title">Productos más vendidos</span>
            <button className="btn btn-success btn-sm" onClick={() => exportarCSV(masVendidos, 'productos_mas_vendidos')}>⬇ CSV</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>#</th><th>Producto</th><th>Unidades</th><th>Ingresos</th></tr></thead>
              <tbody>
                {masVendidos.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{i + 1}</td>
                    <td>{p.nombre}</td>
                    <td>{p.unidades_vendidas}</td>
                    <td style={{ fontWeight: 600 }}>Q{p.ingresos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'mensual' && (
        <div>
          <div className="section-header">
            <span className="section-title">Resumen mensual</span>
            <button className="btn btn-success btn-sm" onClick={() => exportarCSV(resumenMes, 'resumen_mensual')}>⬇ CSV</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Mes</th><th>Cantidad de ventas</th><th>Total ingresos</th></tr></thead>
              <tbody>
                {resumenMes.map((m, i) => (
                  <tr key={i}>
                    <td>{m.mes}</td>
                    <td>{m.cantidad_ventas}</td>
                    <td style={{ fontWeight: 600 }}>Q{m.total_ingresos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'clientes' && (
        <div>
          <div className="section-header">
            <span className="section-title">Clientes activos</span>
            <button className="btn btn-success btn-sm" onClick={() => exportarCSV(clientesActivos, 'clientes_activos')}>⬇ CSV</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Nombre</th><th>Apellido</th><th>Email</th></tr></thead>
              <tbody>
                {clientesActivos.map((c, i) => (
                  <tr key={i}>
                    <td>{c.nombre}</td>
                    <td>{c.apellido}</td>
                    <td>{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sp' && (
        <div>
          <div className="section-title mb-16">Reporte por empleado (Stored Procedure)</div>
          <div className="flex gap-8 mb-16">
            <input
              className="input"
              type="number" min="1"
              placeholder="ID del empleado"
              value={empleadoId}
              onChange={e => setEmpleadoId(e.target.value)}
              style={{ width: 180 }}
            />
            <button className="btn btn-primary" onClick={buscarReporteEmpleado}>Consultar SP</button>
          </div>
          {reporteError && <div className="alert alert-error">{reporteError}</div>}
          {reporteEmp && (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Total ventas completadas</th><th>Monto total</th></tr></thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-green">{reporteEmp.total_ventas}</span></td>
                    <td style={{ fontWeight: 600 }}>Q{reporteEmp.monto_total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'vista' && (
        <div>
          <div className="section-header">
            <span className="section-title">Detalle ventas (VIEW)</span>
            <button className="btn btn-success btn-sm" onClick={() => exportarCSV(vistaVentas, 'detalle_ventas')}>⬇ CSV</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#Venta</th><th>Fecha</th><th>Cliente</th><th>Empleado</th>
                  <th>Producto</th><th>Cantidad</th><th>Precio</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {vistaVentas.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{r.id_venta}</td>
                    <td>{new Date(r.fecha_hora).toLocaleDateString()}</td>
                    <td>{r.cliente}</td>
                    <td>{r.empleado}</td>
                    <td>{r.producto}</td>
                    <td>{r.cantidad}</td>
                    <td>Q{r.precio_unitario_venta}</td>
                    <td>
                      <span className={`badge ${r.estado === 'completada' ? 'badge-green' : r.estado === 'anulada' ? 'badge-red' : 'badge-yellow'}`}>
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
