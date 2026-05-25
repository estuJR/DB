import { useState, useEffect } from 'react'
import axios from '../api'

export default function Ventas() {
  const [ventas, setVentas]     = useState([])
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [form, setForm]         = useState({ id_cliente: '', id_empleado: 1, items: [] })
  const [itemActual, setItemActual] = useState({ id_producto: '', cantidad: 1 })
  const [error, setError]       = useState('')
  const [exito, setExito]       = useState('')
  const cargo = localStorage.getItem('cargo')

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    const [v, c, p] = await Promise.all([
      axios.get('/api/ventas'),
      axios.get('/api/clientes'),
      axios.get('/api/productos')
    ])
    setVentas(v.data)
    setClientes(c.data)
    setProductos(p.data)
  }

  const agregarItem = () => {
    if (!itemActual.id_producto || itemActual.cantidad < 1)
      return setError('Selecciona un producto y cantidad válida')
    const prod = productos.find(p => p.id_producto == itemActual.id_producto)
    setForm({
      ...form,
      items: [...form.items, {
        id_producto: parseInt(itemActual.id_producto),
        cantidad: parseInt(itemActual.cantidad),
        nombre: prod.nombre,
        precio: prod.precio_unitario
      }]
    })
    setItemActual({ id_producto: '', cantidad: 1 })
    setError('')
  }

  const quitarItem = (index) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) })
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

  const calcularTotal = () => {
    return form.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0).toFixed(2)
  }

  const crearVenta = async () => {
    try {
      setError('')
      if (!form.id_cliente)       return setError('Selecciona un cliente')
      if (form.items.length === 0) return setError('Agrega al menos un producto')

      await axios.post('/api/ventas', {
        id_cliente:  parseInt(form.id_cliente),
        id_empleado: form.id_empleado,
        items: form.items.map(i => ({ id_producto: i.id_producto, cantidad: i.cantidad }))
      })
      setExito('Venta creada exitosamente')
      setForm({ id_cliente: '', id_empleado: 1, items: [] })
      cargar()
    } catch (e) {
      setError(e.response?.data?.error || 'Error al crear venta')
    }
  }

  return (
    <div>
      <h2>Ventas</h2>

      {error && <p style={{ color: 'red',   background: '#ffe0e0', padding: '8px', borderRadius: '4px' }}>{error}</p>}
      {exito && <p style={{ color: 'green', background: '#e0ffe0', padding: '8px', borderRadius: '4px' }}>{exito}</p>}

      <div style={formStyle}>
        <h3>Nueva venta</h3>

        <select value={form.id_cliente} onChange={e => setForm({...form, id_cliente: e.target.value})} style={inputStyle}>
          <option value="">-- Seleccionar cliente --</option>
          {clientes.map(c => (
            <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select value={itemActual.id_producto} onChange={e => setItemActual({...itemActual, id_producto: e.target.value})} style={{ ...inputStyle, marginBottom: 0, flex: 2 }}>
            <option value="">-- Producto --</option>
            {productos.map(p => (
              <option key={p.id_producto} value={p.id_producto}>{p.nombre} — Q{p.precio_unitario}</option>
            ))}
          </select>
          <input
            type="number" min="1"
            value={itemActual.cantidad}
            onChange={e => setItemActual({...itemActual, cantidad: e.target.value})}
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          />
          <button onClick={agregarItem} style={btnPrimary}>+ Agregar</button>
        </div>

        {form.items.length > 0 && (
          <table style={{ ...tableStyle, marginBottom: '10px' }}>
            <thead>
              <tr style={{ background: '#ecf0f1' }}>
                <th style={th}>Producto</th>
                <th style={th}>Cantidad</th>
                <th style={th}>Subtotal</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, i) => (
                <tr key={i}>
                  <td style={td}>{item.nombre}</td>
                  <td style={td}>{item.cantidad}</td>
                  <td style={td}>Q{(item.precio * item.cantidad).toFixed(2)}</td>
                  <td style={td}>
                    <button onClick={() => quitarItem(i)} style={btnDel}>Quitar</button>
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', background: '#f9f9f9' }}>
                <td style={td} colSpan={2}>Total</td>
                <td style={td}>Q{calcularTotal()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        )}

        <button onClick={crearVenta} style={btnPrimary}>Confirmar venta</button>
      </div>

      <h3>Historial de ventas</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white' }}>
            <th style={th}>#</th>
            <th style={th}>Fecha</th>
            <th style={th}>Cliente</th>
            <th style={th}>Empleado</th>
            <th style={th}>Total</th>
            <th style={th}>Estado</th>
          {(cargo === 'Gerente' || cargo === 'Cajero') && <th style={th}>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id_venta} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}>{v.id_venta}</td>
              <td style={td}>{new Date(v.fecha_hora).toLocaleString()}</td>
              <td style={td}>{v.cliente_nombre} {v.cliente_apellido}</td>
              <td style={td}>{v.empleado_nombre} {v.empleado_apellido}</td>
              <td style={td}>Q{v.total}</td>
              <td style={td}>
                <span style={{ background: v.estado === 'completada' ? '#27ae60' : v.estado === 'anulada' ? '#e74c3c' : '#f39c12', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
                  {v.estado}
                </span>
              </td>
              {(cargo === 'Gerente' || cargo === 'Cajero') && (
                <td style={td}>
                  {v.estado !== 'anulada' && (
                    <button onClick={() => anularVenta(v.id_venta)} style={btnDel}>Anular</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const formStyle  = { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }
const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }
const btnPrimary = { background: '#2c3e50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }
const btnDel     = { background: '#e74c3c', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }
const tableStyle = { width: '100%', borderCollapse: 'collapse' }
const th         = { padding: '10px', textAlign: 'left' }
const td         = { padding: '10px' }