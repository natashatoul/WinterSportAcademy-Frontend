import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [skillLevel, setSkillLevel] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const response = await api.post('/Account/register', {
        email,
        password,
        firstName,
        lastName,
        skillLevel
      })
      const successMessage = typeof response.data === 'string'
        ? response.data
        : 'Registration successful. Please log in.'
      setMessage(successMessage)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'string') { setError(data); return }
      if (Array.isArray(data)) { setError(data.map(i => i.description || i.code).join(', ')); return }
      if (data?.errors) { setError(Object.values(data.errors).flat().join(', ') || 'Registration failed'); return }
      setError(data?.message || 'Registration failed')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <h2 className="mb-4">Sign Up</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Skill Level</label>
            <select className="form-control" value={skillLevel} onChange={e => setSkillLevel(e.target.value)} required>
              <option value="">Select skill level...</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="mb-3">
            <span className="text-muted">Account type: Trainee</span>
          </div>
          <button type="submit" className="btn btn-primary w-100">Create Account</button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
