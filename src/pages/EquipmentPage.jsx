import { useState, useEffect } from 'react'
import api from '../services/api'

function EquipmentPage() {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/Equipments')
      .then(res => setEquipment(res.data))
      .catch(() => setError('Failed to load equipment'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      <h2 className="mb-4">Equipment</h2>
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
