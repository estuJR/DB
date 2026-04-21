import { useState, useEffect } from 'react'
import axios from '../api'

export default function Productos() {
  const [productos, setProductos]   = useState([])
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [form, setForm]             = useState({ nombre: '', descripcion: '', precio_unitario: '', stock: '', id_categoria: '', id_proveedor: '' })
  const [editId, setEditId]         = useState(null)
  const [error, setError]           = useState('')
  const [exito, setExito]           = useState('')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    cargar()
  }, [])

  const cargar = async () => {
    const [p, c, pr] = await Promise.all([
      axios.get('/api/productos'),
      axios.get('/api/categorias'),
      axios.get('/api/proveedores')
    ])
    setProductos(p.data)
    setCategorias(c.data)
    setProveedores(pr.data)
  }

  const guardar = async () => {
    try {
      setError('')
      if (!form.nombre || !form.precio_unitario || !form.id_categoria || !form.id_proveedor)
        return setError('Todos los campos son requeridos')

      if (editId) {
        await axios.put(`/api/productos/${editId}`, form)
        setExito('Producto actualizado')
      } else {
        await axios.post('/api/productos', form)
        setExito('Producto creado')
      }
      setForm({ nombre: '', descripcion: '', precio_unitario: '', stock: '', id_categoria: '', id_proveedor: '' })
      setEditId(null)
      cargar()
    } catch (e) {
      setError(e.response?.data?.error || 'Error al guardar')
    }
  }

  const editar = (p) => {
    setEditId(p.id_producto)
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio_unitario: p.precio_unitario, stock: p.stock, id_categoria: p.id_categoria, id_proveedor: p.id_proveedor })
    setError('')
    setExito('')
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return
    try {
      await axios.delete(`/api/productos/${id}`)
      setExito('Producto eliminado')
      cargar()
    } catch (e) {
      setError('No se puede eliminar, tiene ventas asociadas')
    }
  }

  return (
    <div>
      <h2>Productos</h2>

      {error  && <p style={{ color: 'red',   background: '#ffe0e0', padding: '8px', borderRadius: '4px' }}>{error}</p>}
      {exito  && <p style={{ color: 'green', background: '#e0ffe0', padding: '8px', borderRadius: '4px' }}>{exito}</p>}

      <div style={formStyle}>
        <h3>{editId ? 'Editar producto' : 'Nuevo producto'}</h3>
        <input placeholder="Nombre"      value={form.nombre}          onChange={e => setForm({...form, nombre: e.target.value})}          style={inputStyle} />
        <input placeholder="Descripción" value={form.descripcion}     onChange={e => setForm({...form, descripcion: e.target.value})}     style={inputStyle} />
        <input placeholder="Precio"      value={form.precio_unitario} onChange={e => setForm({...form, precio_unitario: e.target.value})} style={inputStyle} type="number" />
        <input placeholder="Stock"       value={form.stock}           onChange={e => setForm({...form, stock: e.target.value})}           style={inputStyle} type="number" />
        <select value={form.id_categoria} onChange={e => setForm({...form, id_categoria: e.target.value})} style={inputStyle}>
          <option value="">-- Categoría --</option>
          {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
        </select>
        <select value={form.id_proveedor} onChange={e => setForm({...form, id_proveedor: e.target.value})} style={inputStyle}>
          <option value="">-- Proveedor --</option>
          {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
        </select>
        <button onClick={guardar} style={btnPrimary}>{editId ? 'Actualizar' : 'Crear'}</button>
        {editId && <button onClick={() => { setEditId(null); setForm({ nombre:'', descripcion:'', precio_unitario:'', stock:'', id_categoria:'', id_proveedor:'' }) }} style={btnSecondary}>Cancelar</button>}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white' }}>
            <th style={th}>Nombre</th>
            <th style={th}>Categoría</th>
            <th style={th}>Proveedor</th>
            <th style={th}>Precio</th>
            <th style={th}>Stock</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}>{p.nombre}</td>
              <td style={td}>{p.categoria}</td>
              <td style={td}>{p.proveedor}</td>
              <td style={td}>Q{p.precio_unitario}</td>
              <td style={td}>{p.stock}</td>
              <td style={td}>
                <button onClick={() => editar(p)}      style={btnEdit}>Editar</button>
                <button onClick={() => eliminar(p.id_producto)} style={btnDel}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const formStyle    = { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', maxWidth: '600px' }
const inputStyle   = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }
const btnPrimary   = { background: '#2c3e50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }
const btnSecondary = { background: '#95a5a6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }
const btnEdit      = { background: '#f39c12', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' }
const btnDel       = { background: '#e74c3c', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }
const tableStyle   = { width: '100%', borderCollapse: 'collapse' }
const th           = { padding: '10px', textAlign: 'left' }
const td           = { padding: '10px' }