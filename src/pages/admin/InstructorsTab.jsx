import { useEffect, useState } from 'react'
import api from '../../services/api'

function InstructorsTab() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', specialisation: '' })
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = () => {
    setError('')
    api.get('/Instructors').then(res => setItems(res.data)).catch(() => setError('Failed to load'))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await api.put(`/Instructors/${editing.instructorId}`, { instructorId: editing.instructorId, ...form })
      } else {
        await api.post('/Instructors', form)
      }
      setShowForm(false)
      setEditing(null)
      setForm({ firstName: '', lastName: '', specialisation: '' })
      load()
    } catch {
      setError('Failed to save')
    }
  }

  const handleEdit = (item) => {
    setEditing(item)
    setForm({ firstName: item.firstName, lastName: item.lastName, specialisation: item.specialisation })
    setShowForm(true)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    setError('')
    try {
      await api.delete(`/Instructors/${id}`)
      load()
    } catch {
      setError('Failed to delete')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Instructors</h4>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ firstName: '', lastName: '', specialisation: '' }); setError('') }}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {showForm && (
        <div className="card p-3 mb-3">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-2">
                <input className="form-control" placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
              </div>
              <div className="col-md-4 mb-2">
                <input className="form-control" placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
              </div>
              <div className="col-md-4 mb-2">
                <input className="form-control" placeholder="Specialisation" value={form.specialisation} onChange={e => setForm({ ...form, specialisation: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-success">{editing ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
      <table className="table table-striped">
        <thead><tr><th>Name</th><th>Specialisation</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.instructorId}>
              <td>{item.firstName} {item.lastName}</td>
              <td>{item.specialisation}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.instructorId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InstructorsTab
