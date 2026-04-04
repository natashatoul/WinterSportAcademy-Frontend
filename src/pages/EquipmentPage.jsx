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
        {equipment.map(item => (
          <div className="col-md-4 mb-3" key={item.equipmentId}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{item.itemName}</h5>
                <p className="card-text">{item.description}</p>
                <span className={`badge ${item.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                  {item.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EquipmentPage