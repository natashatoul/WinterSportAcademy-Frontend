import { useState, useEffect } from 'react'
import api from '../services/api'

function AdminPage() {
  const [activeTab, setActiveTab] = useState('trainees')

  return (
    <div>
      <h2 className="mb-4">Admin Panel</h2>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'trainees' ? 'active' : ''}`} onClick={() => setActiveTab('trainees')}>Trainees</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'instructors' ? 'active' : ''}`} onClick={() => setActiveTab('instructors')}>Instructors</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => setActiveTab('equipment')}>Equipment</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>Sessions</button>
        </li>
      </ul>

      {activeTab === 'trainees' && <TraineesTab />}
      {activeTab === 'instructors' && <InstructorsTab />}
      {activeTab === 'equipment' && <EquipmentTab />}
      {activeTab === 'sessions' && <SessionsTab />}
    </div>
  )
}

function TraineesTab() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', skillLevel: '' })
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = () => {
    setError('')
    api.get('/Trainees').then(res => setItems(res.data)).catch(() => setError('Failed to load'))
  }

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
    } catch { setError('Failed to save') }
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
    } catch { setError('Failed to delete') }
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
      <table className="table table-striped">
        <thead><tr><th>Name</th><th>Skill Level</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.traineeId}>
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
  )
}

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
    } catch { setError('Failed to save') }
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
    } catch { setError('Failed to delete') }
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

function EquipmentTab() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ itemName: '', itemCategory: '', specification: '', size: '', startTime: '', endTime: '', traineeId: '', trainingSessionId: '' })
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
    setForm({ itemName: '', itemCategory: '', specification: '', size: '', startTime: '', endTime: '', traineeId: '', trainingSessionId: '' })
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
        traineeId: form.traineeId ? parseInt(form.traineeId, 10) : null,
        trainingSessionId: form.trainingSessionId ? parseInt(form.trainingSessionId, 10) : null
      }

      if (editing) {
        await api.put(`/Equipments/${editing.equipmentId}`, payload)
      } else {
        await api.post('/Equipments', payload)
      }
      resetForm()
      load()
    } catch { setError('Failed to save') }
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
      traineeId: item.traineeId ? String(item.traineeId) : '',
      trainingSessionId: item.trainingSessionId ? String(item.trainingSessionId) : ''
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
    } catch { setError('Failed to delete') }
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
              <div className="col-md-3 mb-2">
                <input type="number" className="form-control" placeholder="Training Session ID" value={form.trainingSessionId} onChange={e => setForm({ ...form, trainingSessionId: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-success">{editing ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
      <table className="table table-striped">
        <thead><tr><th>Name</th><th>Category</th><th>Specification</th><th>Size</th><th>Start</th><th>End</th><th>Trainee ID</th><th>Session ID</th><th>Actions</th></tr></thead>
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
              <td>{item.trainingSessionId}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.equipmentId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SessionsTab() {
  const [items, setItems] = useState([])
  const [instructors, setInstructors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', startTime: '', instructorId: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    loadSessions()
    loadInstructors()
  }, [])

  const loadSessions = () => {
    setError('')
    api.get('/TrainingSessions')
      .then(res => setItems(res.data))
      .catch(() => setError('Failed to load sessions'))
  }

  const loadInstructors = () => {
    api.get('/Instructors')
      .then(res => setInstructors(res.data))
      .catch(() => setError('Failed to load instructors'))
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return localDate.toISOString().slice(0, 16)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ title: '', startTime: '', instructorId: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const instructorIdInt = parseInt(form.instructorId, 10)
    if (isNaN(instructorIdInt)) {
      setError('Please select an instructor')
      return
    }
    try {
      const payload = {
        trainingSessionId: editing ? editing.trainingSessionId : 0,
        title: form.title,
        startTime: form.startTime,
        instructorId: instructorIdInt
      }
      if (editing) {
        await api.put(`/TrainingSessions/${editing.trainingSessionId}`, payload)
      } else {
        await api.post('/TrainingSessions', payload)
      }
      resetForm()
      loadSessions()
    } catch { setError('Failed to save') }
  }

  const handleEdit = (item) => {
    setEditing(item)
    setForm({
      title: item.title,
      startTime: formatDateForInput(item.startTime),
      instructorId: String(item.instructorId)
    })
    setShowForm(true)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    setError('')
    try {
      await api.delete(`/TrainingSessions/${id}`)
      loadSessions()
    } catch { setError('Failed to delete') }
  }

  const handleToggleForm = () => {
    if (showForm) {
      resetForm()
    } else {
      setShowForm(true)
      setEditing(null)
      setForm({ title: '', startTime: '', instructorId: '' })
      setError('')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Training Sessions</h4>
        <button className="btn btn-primary" onClick={handleToggleForm}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {showForm && (
        <div className="card p-3 mb-3">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-2">
                <input className="form-control" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-md-4 mb-2">
                <input type="datetime-local" className="form-control" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required />
              </div>
              <div className="col-md-4 mb-2">
                <select className="form-control" value={form.instructorId} onChange={e => setForm({ ...form, instructorId: e.target.value })} required>
                  <option value="">Select Instructor</option>
                  {instructors.map(i => (
                    <option key={i.instructorId} value={i.instructorId}>{i.firstName} {i.lastName}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success">{editing ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
      <table className="table table-striped">
        <thead><tr><th>Title</th><th>Date</th><th>Instructor</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(item => {
            const instructor = instructors.find(i => i.instructorId === item.instructorId)
            return (
              <tr key={item.trainingSessionId}>
                <td>{item.title}</td>
                <td>{item.formattedStartTime}</td>
                <td>#{item.instructorId} {instructor?.firstName} {instructor?.lastName}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.trainingSessionId)}>Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPage
