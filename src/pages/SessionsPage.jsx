import { useState, useEffect } from 'react'
import api from '../services/api'

function SessionsPage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/TrainingSessions')
      .then(res => setSessions(res.data))
      .catch(() => setError('Failed to load sessions'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      <h2 className="mb-4">Training Sessions</h2>
      <div className="row">
        {sessions.map(session => (
          <div className="col-md-4 mb-3" key={session.trainingSessionId}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{session.title}</h5>
                <p className="card-text">{session.description}</p>
                <p className="card-text">
                  <small className="text-muted">
                    {new Date(session.date).toLocaleDateString()}
                  </small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SessionsPage