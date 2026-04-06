import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function EquipmentPage() {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [rentingId, setRentingId] = useState(null)
  const { token, role } = useAuth()

  useEffect(() => {
    api.get('/Equipments')
      .then(res => setEquipment(res.data))
      .catch(() => setError('Failed to load equipment'))
      .finally(() => setLoading(false))
  }, [])

  const handleRent = async (equipmentId) => {
    setError('')
    setMessage('')
    setRentingId(equipmentId)
    try {
      await api.post(`/Equipments/${equipmentId}/rent`)
      setEquipment(prev =>
        prev.map(item =>
          item.equipmentId === equipmentId
            ? { ...item, traineeId: -1 }
            : item
        )
      )
      setMessage('Equipment rented successfully.')
    } catch (err) {
      const data = err.response?.data
      setError(data?.message || data?.detailed || data || 'Failed to rent equipment')
    } finally {
      setRentingId(null)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h2 className="mb-4">Equipment</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {equipment.map(item => {
          const isAvailable = item.traineeId == null && item.trainingSessionId == null

          return (
            <div className="col-md-4 mb-3" key={item.equipmentId}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.itemName}</h5>
                  <p className="card-text mb-1"><strong>Category:</strong> {item.itemCategory}</p>
                  {item.specification && (
                    <p className="card-text mb-1"><strong>Specification:</strong> {item.specification}</p>
                  )}
                  {item.size && (
                    <p className="card-text mb-3"><strong>Size:</strong> {item.size}</p>
                  )}
                  <span className={`badge ${isAvailable ? 'bg-success' : 'bg-danger'}`}>
                    {isAvailable ? 'Available' : 'Not Available'}
                  </span>
                  {token && role !== 'Admin' && isAvailable && (
                    <button
                      className="btn btn-sm btn-primary mt-3 d-block"
                      disabled={rentingId === item.equipmentId}
                      onClick={() => handleRent(item.equipmentId)}
                    >
                      {rentingId === item.equipmentId ? 'Renting...' : 'Rent'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EquipmentPage
