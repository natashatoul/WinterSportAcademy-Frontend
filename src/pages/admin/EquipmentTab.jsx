import { useEffect, useState } from 'react'
import api from '../../services/api'

function EquipmentTab() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ itemName: '', itemCategory: '', specification: '', size: '', startTime: '', endTime: '', traineeId: '' })
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return localDate.toISOString().slice(0, 16)
  }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (date.getFullYear() <= 1) return ''
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ itemName: '', itemCategory: '', specification: '', size: '', startTime: '', endTime: '', traineeId: '' })
  }

  const load = () => {
    setError('')
    api.get('/Equipments').then(res => setItems(res.data)).catch(() => setError('Failed to load'))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        equipmentId: editing ? editing.equipmentId : 0,
        itemName: form.itemName,
        itemCategory: form.itemCategory,
        specification: form.specification || null,
        size: form.size || null,
        startTime: form.startTime || null,
        endTime: form.endTime || null,
        traineeId: form.traineeId ? parseInt(form.traineeId, 10) : null
      }

      if (editing) {
        await api.put(`/Equipments/${editing.equipmentId}`, payload)
      } else {
        await api.post('/Equipments', payload)
      }
      resetForm()
      load()
    } catch {
      setError('Failed to save')
    }
  }

  const handleEdit = (item) => {
    setEditing(item)
    setForm({
      itemName: item.itemName,
      itemCategory: item.itemCategory,
      specification: item.specification || '',
      size: item.size || '',
      startTime: formatDateForInput(item.startTime),
      endTime: formatDateForInput(item.endTime),
      traineeId: item.traineeId ? String(item.traineeId) : ''
    })
    setShowForm(true)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    setError('')
    try {
      await api.delete(`/Equipments/${id}`)
      load()
    } catch {
      setError('Failed to delete')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Equipment</h4>
        <button className="btn btn-primary" onClick={() => { showForm ? resetForm() : setShowForm(true); setError('') }}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {showForm && (
        <div className="card p-3 mb-3">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3 mb-2">
                <input className="form-control" placeholder="Item Name" value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} required />
              </div>
              <div className="col-md-3 mb-2">
                <input className="form-control" placeholder="Category" value={form.itemCategory} onChange={e => setForm({ ...form, itemCategory: e.target.value })} required />
              </div>
              <div className="col-md-3 mb-2">
                <input className="form-control" placeholder="Specification" value={form.specification} onChange={e => setForm({ ...form, specification: e.target.value })} />
              </div>
              <div className="col-md-3 mb-2">
                <input className="form-control" placeholder="Size" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 mb-2">
                <input type="datetime-local" className="form-control" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div className="col-md-3 mb-2">
                <input type="datetime-local" className="form-control" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
              </div>
              <div className="col-md-3 mb-2">
                <input type="number" className="form-control" placeholder="Trainee ID" value={form.traineeId} onChange={e => setForm({ ...form, traineeId: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-success">{editing ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
      <table className="table table-striped">
        <thead><tr><th>Name</th><th>Category</th><th>Specification</th><th>Size</th><th>Start</th><th>End</th><th>Trainee ID</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.equipmentId}>
              <td>{item.itemName}</td>
              <td>{item.itemCategory}</td>
              <td>{item.specification}</td>
              <td>{item.size}</td>
              <td>{formatDisplayDate(item.startTime)}</td>
              <td>{formatDisplayDate(item.endTime)}</td>
              <td>{item.traineeId}</td>
              <td className="text-nowrap">
                <button className="btn btn-warning btn-sm me-2 px-3" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm px-3" onClick={() => handleDelete(item.equipmentId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EquipmentTab
