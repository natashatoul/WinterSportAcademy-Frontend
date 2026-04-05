import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { token, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: '#2196F3'}}>
        
      <div className="container">
        <Link className="navbar-brand" to="/">Winter Sport Academy</Link>
        <div className="navbar-nav ms-auto gap-4">
          <Link className="nav-link" to="/">Sessions</Link>
          <Link className="nav-link" to="/equipment">Equipment</Link>
          <Link className="nav-link" to="/instructors">Instructors</Link>
          {token && role === 'Admin' && (
            <Link className="nav-link" to="/admin">Admin</Link>
          )}
          {token ? (
            <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
          ) : (
            <Link className="nav-link" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar