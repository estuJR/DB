import { useState, useEffect } from 'react'
import axios from '../api'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [form, setForm]         = useState({ nombre: '', apellido: '', email: '', telefono: '' })
  const [editId, setEditId]     = useState(null)
  const [error, setError]       = useState('')
  const [exito, setExito]       = useState('')

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    const res = await axios.get('/api/clientes')
    setClientes(res.data)
  }

  const guardar = async () => {
    try {
      setError('')
      if (!form.nombre || !form.apellido || !form.email)
        return setError('Nombre, apellido y email son requeridos')
      if (editId) {
        await axios.put(`/api/clientes/${editId}`, form)
        setExito('Cliente actualizado')
      } else {
        await axios.post('/api/clientes', form)
        setExito('Cliente registrado')
      }
      resetForm()
      cargar()
    } catch (e) {
      setError(e.response?.data?.error || 'Error al guardar')
    }
  }

  const editar = (c) => {
    setEditId(c.id_cliente)
    setForm({ nombre: c.nombre, apellido: c.apellido, email: c.email, telefono: c.telefono })
    setError(''); setExito('')
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar cliente?')) return
    try {
      await axios.delete(`/api/clientes/${id}`)
      setExito('Cliente eliminado')
      cargar()
    } catch {
      setError('No se puede eliminar, tiene ventas asociadas')
    }
  }

  const resetForm = () => {
    setEditId(null)
    setForm({ nombre: '', apellido: '', email: '', telefono: '' })
    setError(''); setExito('')
  }

  const f = (k, v) => setForm({ ...form, [k]: v })

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Clientes</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="card">
        <div className="card-title">{editId ? 'Editar cliente' : 'Nuevo cliente'}</div>
        <div className="form-grid">
          <input className="input" placeholder="Nombre"    value={form.nombre}   onChange={e => f('nombre',   e.target.value)} />
          <input className="input" placeholder="Apellido"  value={form.apellido} onChange={e => f('apellido', e.target.value)} />
          <input className="input" placeholder="Email"     value={form.email}    onChange={e => f('email',    e.target.value)} />
          <input className="input" placeholder="Teléfono"  value={form.telefono} onChange={e => f('telefono', e.target.value)} />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={guardar}>{editId ? 'Actualizar' : 'Registrar cliente'}</button>
          {editId && <button className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id_cliente}>
                <td>{c.nombre}</td>
                <td>{c.apellido}</td>
                <td>{c.email}</td>
                <td>{c.telefono}</td>
                <td className="flex gap-8">
                  <button className="btn btn-warning btn-sm" onClick={() => editar(c)}>Editar</button>
                  <button className="btn btn-danger btn-sm"  onClick={() => eliminar(c.id_cliente)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
