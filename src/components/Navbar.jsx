import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { token, role, email, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#386991' }}>
            <div className="container px-4">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/src/assets/logo.svg" alt="logo" height="80" />
                    </Link>
                <div className="navbar-nav ms-auto gap-4">
                    {role !== 'Admin' && (
                        <>
                            <Link className="nav-link" to="/">Sessions</Link>
                            <Link className="nav-link" to="/equipment">Equipment</Link>
                            <Link className="nav-link" to="/instructors">Instructors</Link>
                        </>
                    )}
                    {token && role === 'Admin' && (
                        <Link className="nav-link" to="/admin">Admin</Link>
                    )}
                    {token && role !== 'Admin' && (
                        <Link className="nav-link" to="/my-registrations">My Registrations</Link>
                    )}
                    {token && email && (
                        <span className="navbar-text text-white-50">{email}</span>
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
