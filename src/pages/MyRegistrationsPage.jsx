import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/useAuth'

function MyRegistrationsPage() {
  const { traineeId, token } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError('Please login to view your registrations.')
      return
    }

    if (!traineeId) {
      setLoading(false)
      setError('Trainee profile is not linked to this account yet.')
      return
    }

    const loadRegistrations = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get('/Registrations')
        const mine = response.data.filter(
          r => Number(r.traineeId) === Number(traineeId)
        )
        setRegistrations(mine)
      } catch (err) {
        const data = err.response?.data
        setError(data?.message || data?.detailed || data || 'Failed to load registrations')
      } finally {
        setLoading(false)
      }
    }

    loadRegistrations()
  }, [token, traineeId])

  if (loading) return <p>Loading your registrations...</p>

  return (
    <div>
      <h2 className="mb-4">My Registrations</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {!error && registrations.length === 0 && (
        <div className="alert alert-info">You have no registrations yet.</div>
      )}

      {!error && registrations.length > 0 && (
        
        <div className="table-responsive"> 
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Session</th>
                <th>Session Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(registration => (
                <tr key={registration.registrationNumber}>
                  <td>{registration.registrationNumber}</td>
                  <td>{registration.trainingSession?.title || `Session #${registration.trainingSessionId}`}</td>
                  <td>
                    {registration.trainingSession?.formattedStartTime
                      || (registration.trainingSession?.startTime
                        ? new Date(registration.trainingSession.startTime).toLocaleString()
                        : 'N/A')}
                  </td>
                  <td>{registration.isConfirmed ? 'Confirmed' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyRegistrationsPage
