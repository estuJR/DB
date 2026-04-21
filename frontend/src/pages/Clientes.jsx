import { useState, useEffect } from 'react'
import axios from 'axios'

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
        setExito('Cliente creado')
      }
      setForm({ nombre: '', apellido: '', email: '', telefono: '' })
      setEditId(null)
      cargar()
    } catch (e) {
      setError(e.response?.data?.error || 'Error al guardar')
    }
  }

  const editar = (c) => {
    setEditId(c.id_cliente)
    setForm({ nombre: c.nombre, apellido: c.apellido, email: c.email, telefono: c.telefono })
    setError('')
    setExito('')
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar cliente?')) return
    try {
      await axios.delete(`/api/clientes/${id}`)
      setExito('Cliente eliminado')
      cargar()
    } catch (e) {
      setError('No se puede eliminar, tiene ventas asociadas')
    }
  }

  return (
    <div>
      <h2>Clientes</h2>

      {error && <p style={{ color: 'red',   background: '#ffe0e0', padding: '8px', borderRadius: '4px' }}>{error}</p>}
      {exito && <p style={{ color: 'green', background: '#e0ffe0', padding: '8px', borderRadius: '4px' }}>{exito}</p>}

      <div style={formStyle}>
        <h3>{editId ? 'Editar cliente' : 'Nuevo cliente'}</h3>
        <input placeholder="Nombre"    value={form.nombre}    onChange={e => setForm({...form, nombre:    e.target.value})} style={inputStyle} />
        <input placeholder="Apellido"  value={form.apellido}  onChange={e => setForm({...form, apellido:  e.target.value})} style={inputStyle} />
        <input placeholder="Email"     value={form.email}     onChange={e => setForm({...form, email:     e.target.value})} style={inputStyle} />
        <input placeholder="Teléfono"  value={form.telefono}  onChange={e => setForm({...form, telefono:  e.target.value})} style={inputStyle} />
        <button onClick={guardar} style={btnPrimary}>{editId ? 'Actualizar' : 'Crear'}</button>
        {editId && (
          <button onClick={() => { setEditId(null); setForm({ nombre:'', apellido:'', email:'', telefono:'' }) }} style={btnSecondary}>
            Cancelar
          </button>
        )}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white' }}>
            <th style={th}>Nombre</th>
            <th style={th}>Apellido</th>
            <th style={th}>Email</th>
            <th style={th}>Teléfono</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id_cliente} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}>{c.nombre}</td>
              <td style={td}>{c.apellido}</td>
              <td style={td}>{c.email}</td>
              <td style={td}>{c.telefono}</td>
              <td style={td}>
                <button onClick={() => editar(c)}             style={btnEdit}>Editar</button>
                <button onClick={() => eliminar(c.id_cliente)} style={btnDel}>Eliminar</button>
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