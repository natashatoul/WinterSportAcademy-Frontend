import React, { useState } from 'react'
import api from '../../services/api'
import useApiList from '../../hooks/useApiList'

function TraineesTab() {
  const { items, error, setError, load } = useApiList({
    endpoint: '/Trainees',
    errorMessage: 'Failed to load'
  })
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', skillLevel: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await api.put(`/Trainees/${editing.traineeId}`, { traineeId: editing.traineeId, ...form })
      } else {
        await api.post('/Trainees', form)
      }
      setShowForm(false)
      setEditing(null)
      setForm({ firstName: '', lastName: '', skillLevel: '' })
      load()
    } catch {
      setError('Failed to save')
    }
  }

  const handleEdit = (item) => {
    setEditing(item)
    setForm({ firstName: item.firstName, lastName: item.lastName, skillLevel: item.skillLevel })
    setShowForm(true)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    setError('')
    try {
      await api.delete(`/Trainees/${id}`)
      load()
    } catch {
      setError('Failed to delete')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Trainees</h4>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ firstName: '', lastName: '', skillLevel: '' }); setError('') }}>
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
                <select className="form-control" value={form.skillLevel} onChange={e => setForm({ ...form, skillLevel: e.target.value })}>
                  <option value="">Skill Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success">{editing ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead><tr><th>ID</th><th>Name</th><th>Skill Level</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.traineeId}>
                <td>{item.traineeId}</td>
                <td>{item.firstName} {item.lastName}</td>
                <td>{item.skillLevel}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.traineeId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TraineesTab
