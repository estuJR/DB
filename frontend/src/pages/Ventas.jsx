import { useState, useEffect } from 'react'
import axios from '../api'

export default function Ventas() {
  const [ventas, setVentas]         = useState([])
  const [clientes, setClientes]     = useState([])
  const [productos, setProductos]   = useState([])
  const [form, setForm]             = useState({ id_cliente: '', id_empleado: 1, items: [] })
  const [itemActual, setItemActual] = useState({ id_producto: '', cantidad: 1 })
  const [error, setError]           = useState('')
  const [exito, setExito]           = useState('')
  const cargo = localStorage.getItem('cargo')

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    const [v, c, p] = await Promise.all([
      axios.get('/api/ventas'),
      axios.get('/api/clientes'),
      axios.get('/api/productos'),
    ])
    setVentas(v.data)
    setClientes(c.data)
    setProductos(p.data)
  }

  const agregarItem = () => {
    if (!itemActual.id_producto || itemActual.cantidad < 1)
      return setError('Selecciona un producto y cantidad válida')
    const prod = productos.find(p => p.id_producto == itemActual.id_producto)
    setForm({ ...form, items: [...form.items, { id_producto: parseInt(itemActual.id_producto), cantidad: parseInt(itemActual.cantidad), nombre: prod.nombre, precio: prod.precio_unitario }] })
    setItemActual({ id_producto: '', cantidad: 1 })
    setError('')
  }

  const quitarItem = (index) => setForm({ ...form, items: form.items.filter((_, i) => i !== index) })

  const calcularTotal = () => form.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0).toFixed(2)

  const crearVenta = async () => {
    try {
      setError('')
      if (!form.id_cliente)        return setError('Selecciona un cliente')
      if (form.items.length === 0) return setError('Agrega al menos un producto')
      await axios.post('/api/ventas', {
        id_cliente:  parseInt(form.id_cliente),
        id_empleado: form.id_empleado,
        items: form.items.map(i => ({ id_producto: i.id_producto, cantidad: i.cantidad })),
      })
      setExito('Venta creada exitosamente')
      setForm({ id_cliente: '', id_empleado: 1, items: [] })
      cargar()
    } catch (e) {
      setError(e.response?.data?.error || 'Error al crear venta')
    }
  }

  const anularVenta = async (id) => {
    if (!window.confirm(`¿Anular venta #${id}?`)) return
    try {
      await axios.patch(`/api/ventas/${id}/anular`)
      setExito(`Venta #${id} anulada`)
      cargar()
    } catch (e) {
      setError(e.response?.data?.error || 'Error al anular')
    }
  }

  const estadoBadge = (estado) => {
    if (estado === 'completada') return <span className="badge badge-green">completada</span>
    if (estado === 'anulada')    return <span className="badge badge-red">anulada</span>
    return <span className="badge badge-yellow">{estado}</span>
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Ventas</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="card">
        <div className="card-title">Nueva venta</div>

        <div style={{ marginBottom: 12 }}>
          <select className="select" value={form.id_cliente} onChange={e => setForm({ ...form, id_cliente: e.target.value })} style={{ maxWidth: 320 }}>
            <option value="">— Seleccionar cliente —</option>
            {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>)}
          </select>
        </div>

        <div className="flex gap-8 mb-16" style={{ flexWrap: 'wrap' }}>
          <select className="select" value={itemActual.id_producto} onChange={e => setItemActual({ ...itemActual, id_producto: e.target.value })} style={{ flex: 2, minWidth: 200 }}>
            <option value="">— Producto —</option>
            {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre} — Q{p.precio_unitario}</option>)}
          </select>
          <input className="input" type="number" min="1" value={itemActual.cantidad} onChange={e => setItemActual({ ...itemActual, cantidad: e.target.value })} style={{ width: 90 }} />
          <button className="btn btn-ghost" onClick={agregarItem}>+ Agregar</button>
        </div>

        {form.items.length > 0 && (
          <div className="table-wrap mb-16">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>Q{(item.precio * item.cantidad).toFixed(2)}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => quitarItem(i)}>Quitar</button></td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 600, background: '#f8fafc' }}>
                  <td colSpan={2}>Total</td>
                  <td>Q{calcularTotal()}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <button className="btn btn-success" onClick={crearVenta}>Confirmar venta</button>
      </div>

      <div className="section-header">
        <span className="section-title">Historial de ventas</span>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Total</th>
              <th>Estado</th>
              {(cargo === 'Gerente' || cargo === 'Cajero') && <th>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id_venta}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{v.id_venta}</td>
                <td>{new Date(v.fecha_hora).toLocaleString()}</td>
                <td>{v.cliente_nombre} {v.cliente_apellido}</td>
                <td>{v.empleado_nombre} {v.empleado_apellido}</td>
                <td style={{ fontWeight: 600 }}>Q{v.total}</td>
                <td>{estadoBadge(v.estado)}</td>
                {(cargo === 'Gerente' || cargo === 'Cajero') && (
                  <td>
                    {v.estado !== 'anulada' && (
                      <button className="btn btn-danger btn-sm" onClick={() => anularVenta(v.id_venta)}>Anular</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
