import { useState, useEffect } from 'react'
import api from '../services/api'

function InstructorsPage() {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/Instructors')
      .then(res => setInstructors(res.data))
      .catch(() => setError('Failed to load instructors'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      <h2 className="mb-4">Instructors</h2>
      <div className="row">
        {instructors.map(instructor => (
          <div className="col-md-4 mb-3" key={instructor.instructorId}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  {instructor.firstName} {instructor.lastName}
                </h5>
                <p className="card-text">{instructor.specialization}</p>
                <p className="card-text">
                  <small className="text-muted">{instructor.email}</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InstructorsPage