import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const decodeTokenPayload = (token) => {
  if (!token) return null
  try {
    const payloadBase64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    return JSON.parse(atob(payloadBase64))
  } catch {
    return null
  }
}

const getRoleFromPayload = (payload) =>
  payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(() => {
    const payload = decodeTokenPayload(localStorage.getItem('token'))
    return getRoleFromPayload(payload)
  })
  const [email, setEmail] = useState(() => {
    const payload = decodeTokenPayload(localStorage.getItem('token'))
    return payload?.sub || payload?.email || ''
  })
  const [traineeId, setTraineeId] = useState(() => {
    const payload = decodeTokenPayload(localStorage.getItem('token'))
    return payload?.TraineeId || ''
  })

  const login = (newToken) => {
    const payload = decodeTokenPayload(newToken)
    const resolvedRole = getRoleFromPayload(payload)
    const resolvedEmail = payload?.sub || payload?.email || ''
    const resolvedTraineeId = payload?.TraineeId || ''

    localStorage.setItem('token', newToken)
    localStorage.setItem('role', resolvedRole)
    setToken(newToken)
    setRole(resolvedRole)
    setEmail(resolvedEmail)
    setTraineeId(resolvedTraineeId)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setRole(null)
    setEmail('')
    setTraineeId('')
  }

  return (
    <AuthContext.Provider value={{ token, role, email, traineeId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
