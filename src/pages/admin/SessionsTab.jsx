import * as React from 'react'
import { Fragment, useEffect, useState } from 'react'
import api from '../../services/api'

function SessionsTab() {
  const [items, setItems] = useState([])
  const [instructors, setInstructors] = useState([])
  const [trainees, setTrainees] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', startTime: '', instructorId: '' })
  const [enrollingSessionId, setEnrollingSessionId] = useState(null)
  const [selectedTraineeId, setSelectedTraineeId] = useState('')
  const [error, setError] = useState('')

  function loadSessions() {
    setError('')
    api.get('/TrainingSessions')
      .then(res => setItems(res.data))
      .catch(() => setError('Failed to load sessions'))
  }

  function loadInstructors() {
    api.get('/Instructors')
      .then(res => setInstructors(res.data))
      .catch(() => setError('Failed to load instructors'))
  }

  function loadTrainees() {
    api.get('/Trainees')
      .then(res => setTrainees(res.data))
      .catch(() => setError('Failed to load trainees'))
  }

  function loadRegistrations() {
    api.get('/Registrations')
      .then(res => setRegistrations(res.data))
      .catch(() => setError('Failed to load registrations'))
  }

  useEffect(() => {
    loadSessions()
    loadInstructors()
    loadTrainees()
    loadRegistrations()
  }, [])

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
    } catch {
      setError('Failed to save')
    }
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
    } catch {
      setError('Failed to delete')
    }
  }

  const handleEnroll = async () => {
    setError('')

    const traineeIdInt = parseInt(selectedTraineeId, 10)
    if (!enrollingSessionId || isNaN(traineeIdInt)) {
      setError('Please select a trainee')
      return
    }

    try {
      await api.post('/Registrations', {
        registrationNumber: 0,
        traineeId: traineeIdInt,
        trainingSessionId: enrollingSessionId,
        registrationTime: new Date().toISOString(),
        isConfirmed: false
      })
      loadRegistrations()
      setEnrollingSessionId(null)
      setSelectedTraineeId('')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detailed ||
        err.response?.data ||
        'Failed to enroll trainee'
      )
    }
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
      <div className="table-responsive">
        <table className="table table-striped">
        <thead><tr><th>ID</th><th>Title</th><th>Date</th><th>Instructor</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(item => {
            const instructor = instructors.find(i => i.instructorId === item.instructorId)
            const currentSessionTime = item.formattedStartTime
            const busyTraineeIds = registrations
              .filter(registration => {
                if (registration.trainingSessionId === item.trainingSessionId) return false
                const registeredSession = items.find(session => session.trainingSessionId === registration.trainingSessionId)
                return registeredSession?.formattedStartTime === currentSessionTime
              })
              .map(registration => registration.traineeId)
            const availableTrainees = trainees.filter(trainee => !busyTraineeIds.includes(trainee.traineeId))

            return (
              <Fragment key={item.trainingSessionId}>
                <tr key={item.trainingSessionId}>
                  <td>{item.trainingSessionId}</td>
                  <td>{item.title}</td>
                  <td>{item.formattedStartTime}</td>
                  <td>#{item.instructorId} {instructor?.firstName} {instructor?.lastName}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => {
                      setEnrollingSessionId(item.trainingSessionId)
                      setSelectedTraineeId('')
                      setError('')
                    }}>
                      Enroll
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.trainingSessionId)}>Delete</button>
                  </td>
                </tr>
                {enrollingSessionId === item.trainingSessionId && (
                  <tr key={`enroll-${item.trainingSessionId}`}>
                    <td colSpan="5">
                      <div className="d-flex gap-2 align-items-center flex-wrap">
                        <select className="form-control" style={{ maxWidth: '320px' }} value={selectedTraineeId} onChange={e => setSelectedTraineeId(e.target.value)}>
                          <option value="">Select trainee</option>
                          {availableTrainees.map(trainee => (
                            <option key={trainee.traineeId} value={trainee.traineeId}>
                              {trainee.firstName} {trainee.lastName}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-success btn-sm" onClick={handleEnroll}>Confirm Enroll</button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default SessionsTab
