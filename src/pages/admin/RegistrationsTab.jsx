import { useEffect, useState } from 'react'
import api from '../../services/api'

function RegistrationsTab() {
  const [items, setItems] = useState([])
  const [trainees, setTrainees] = useState([])
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadRegistrations()
    loadTrainees()
    loadSessions()
  }, [])

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

  const loadRegistrations = () => {
    setError('')
    api.get('/Registrations')
      .then(res => setItems(res.data))
      .catch(() => setError('Failed to load registrations'))
  }

  const loadTrainees = () => {
    api.get('/Trainees')
      .then(res => setTrainees(res.data))
      .catch(() => setError('Failed to load trainees'))
  }

  const loadSessions = () => {
    api.get('/TrainingSessions')
      .then(res => setSessions(res.data))
      .catch(() => setError('Failed to load sessions'))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    setError('')
    try {
      await api.delete(`/Registrations/${id}`)
      loadRegistrations()
    } catch {
      setError('Failed to delete')
    }
  }

  const handleToggleConfirmed = async (item) => {
    setError('')

    try {
      const payload = {
        registrationNumber: item.registrationNumber,
        traineeId: item.traineeId,
        trainingSessionId: item.trainingSessionId,
        registrationTime: item.registrationTime,
        isConfirmed: !item.isConfirmed
      }

      await api.put(`/Registrations/${item.registrationNumber}`, payload)
      loadRegistrations()
    } catch {
      setError('Failed to update registration')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Registrations</h4>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped">
        <thead><tr><th>#</th><th>Trainee</th><th>Session</th><th>Session Time</th><th>Registration Time</th><th>Confirmed</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(item => {
            const trainee = trainees.find(t => t.traineeId === item.traineeId)
            const session = sessions.find(s => s.trainingSessionId === item.trainingSessionId)

            return (
              <tr key={item.registrationNumber}>
                <td>{item.registrationNumber}</td>
                <td>{trainee ? `${trainee.firstName} ${trainee.lastName}` : `#${item.traineeId}`}</td>
                <td>{session ? session.title : `#${item.trainingSessionId}`}</td>
                <td>{session?.formattedStartTime || ''}</td>
                <td>{formatDisplayDate(item.registrationTime)}</td>
                <td>{item.isConfirmed ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleToggleConfirmed(item)}>
                    {item.isConfirmed ? 'Unconfirm' : 'Confirm'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.registrationNumber)}>Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default RegistrationsTab
