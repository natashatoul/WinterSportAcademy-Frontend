import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import EquipmentPage from './pages/EquipmentPage'
import InstructorsPage from './pages/InstructorsPage'
import SessionsPage from './pages/SessionsPage'
import AdminPage from './pages/AdminPage'

function ProtectedRoute({ children }) {
  const { token, role } = useAuth()
  if (!token) return <Navigate to="/login" />
  if (role !== 'Admin') return <Navigate to="/" />
  return children
}

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<SessionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/instructors" element={<InstructorsPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  )
}

export default App