import { useState, useEffect } from 'react'
import axios from '../api'

export default function Productos() {
  const [productos, setProductos]     = useState([])
  const [categorias, setCategorias]   = useState([])
  const [proveedores, setProveedores] = useState([])
  const [form, setForm]   = useState({ nombre: '', descripcion: '', precio_unitario: '', stock: '', id_categoria: '', id_proveedor: '' })
  const [editId, setEditId] = useState(null)
  const [error, setError]   = useState('')
  const [exito, setExito]   = useState('')

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    const [p, c, pr] = await Promise.all([
      axios.get('/api/productos'),
      axios.get('/api/categorias'),
      axios.get('/api/proveedores'),
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
      resetForm()
      cargar()
    } catch (e) {
      setError(e.response?.data?.error || 'Error al guardar')
    }
  }

  const editar = (p) => {
    setEditId(p.id_producto)
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio_unitario: p.precio_unitario, stock: p.stock, id_categoria: p.id_categoria, id_proveedor: p.id_proveedor })
    setError(''); setExito('')
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return
    try {
      await axios.delete(`/api/productos/${id}`)
      setExito('Producto eliminado')
      cargar()
    } catch {
      setError('No se puede eliminar, tiene ventas asociadas')
    }
  }

  const resetForm = () => {
    setEditId(null)
    setForm({ nombre: '', descripcion: '', precio_unitario: '', stock: '', id_categoria: '', id_proveedor: '' })
    setError(''); setExito('')
  }

  const f = (k, v) => setForm({ ...form, [k]: v })

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Productos</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="card">
        <div className="card-title">{editId ? 'Editar producto' : 'Nuevo producto'}</div>
        <div className="form-grid">
          <input className="input" placeholder="Nombre"       value={form.nombre}          onChange={e => f('nombre', e.target.value)} />
          <input className="input" placeholder="Descripción"  value={form.descripcion}     onChange={e => f('descripcion', e.target.value)} />
          <input className="input" placeholder="Precio (Q)"   value={form.precio_unitario} onChange={e => f('precio_unitario', e.target.value)} type="number" />
          <input className="input" placeholder="Stock"        value={form.stock}           onChange={e => f('stock', e.target.value)} type="number" />
          <select className="select" value={form.id_categoria} onChange={e => f('id_categoria', e.target.value)}>
            <option value="">— Categoría —</option>
            {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
          </select>
          <select className="select" value={form.id_proveedor} onChange={e => f('id_proveedor', e.target.value)}>
            <option value="">— Proveedor —</option>
            {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
          </select>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={guardar}>{editId ? 'Actualizar' : 'Crear producto'}</button>
          {editId && <button className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id_producto}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.proveedor}</td>
                <td>Q{Number(p.precio_unitario).toFixed(2)}</td>
                <td>
                  <span className={`badge ${p.stock > 10 ? 'badge-green' : p.stock > 0 ? 'badge-yellow' : 'badge-red'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="flex gap-8">
                  <button className="btn btn-warning btn-sm" onClick={() => editar(p)}>Editar</button>
                  <button className="btn btn-danger btn-sm"  onClick={() => eliminar(p.id_producto)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
