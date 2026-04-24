import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/useAuth'

function SessionsPage() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [enrollingSessionId, setEnrollingSessionId] = useState(null)
    const { token, role, traineeId } = useAuth()

    useEffect(() => {
        api.get('/TrainingSessions')
            .then(res => setSessions(res.data))
            .catch(() => setError('Failed to load sessions'))
            .finally(() => setLoading(false))
    }, [])

    const handleEnroll = async (trainingSessionId) => {
        if (!traineeId) {
            setError('Your trainee profile is not linked yet. Please re-register and login again.')
            return
        }

        setError('')
        setMessage('')
        setEnrollingSessionId(trainingSessionId)

        try {
            await api.post('/Registrations', {
                traineeId: Number(traineeId),
                trainingSessionId,
                registrationTime: new Date().toISOString(),
                isConfirmed: false
            })
            setMessage('You have been enrolled successfully.')
        } catch (err) {
            const data = err.response?.data
            setError(data?.message || data?.detailed || data || 'Failed to enroll')
        } finally {
            setEnrollingSessionId(null)
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h2 className="mb-4">Training Sessions</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {sessions.map(session => (
                    <div className="col-md-4 mb-3" key={session.trainingSessionId}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{session.title}</h5>
                                <p className="card-text">{session.description}</p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        {session.formattedStartTime}
                                    </small>
                                </p>
                                {token && role !== 'Admin' && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleEnroll(session.trainingSessionId)}
                                        disabled={enrollingSessionId === session.trainingSessionId}
                                    >
                                        {enrollingSessionId === session.trainingSessionId ? 'Enrolling...' : 'Enroll'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SessionsPage
