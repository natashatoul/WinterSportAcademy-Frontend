import { useState, useEffect } from 'react'
import api from '../services/api'

function AdminPage() {
  const [trainees, setTrainees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/Trainees')
      .then(res => setTrainees(res.data))
      .catch(() => setError('Failed to load trainees'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/Trainees/${id}`)
      setTrainees(trainees.filter(t => t.traineeId !== id))
    } catch {
      setError('Failed to delete trainee')
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      <h2 className="mb-4">Admin Panel — Trainees</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainees.map(trainee => (
            <tr key={trainee.traineeId}>
              <td>{trainee.firstName} {trainee.lastName}</td>
              <td>{trainee.email}</td>
              <td>{trainee.phone}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(trainee.traineeId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPage