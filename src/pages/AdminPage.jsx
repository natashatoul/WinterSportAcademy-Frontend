import { useState } from 'react'
import TraineesTab from './admin/TraineesTab'
import InstructorsTab from './admin/InstructorsTab'
import EquipmentTab from './admin/EquipmentTab'
import SessionsTab from './admin/SessionsTab'
import RegistrationsTab from './admin/RegistrationsTab'

function AdminPage() {
  const [activeTab, setActiveTab] = useState('trainees')

  return (
    <div className="admin-panel">
      <h2 className="mb-4">Admin Panel</h2>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'trainees' ? 'active' : ''}`} onClick={() => setActiveTab('trainees')}>Trainees</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'instructors' ? 'active' : ''}`} onClick={() => setActiveTab('instructors')}>Instructors</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => setActiveTab('equipment')}>Equipment</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>Sessions</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'registrations' ? 'active' : ''}`} onClick={() => setActiveTab('registrations')}>Registrations</button>
        </li>
      </ul>

      {activeTab === 'trainees' && <TraineesTab />}
      {activeTab === 'instructors' && <InstructorsTab />}
      {activeTab === 'equipment' && <EquipmentTab />}
      {activeTab === 'sessions' && <SessionsTab />}
      {activeTab === 'registrations' && <RegistrationsTab />}
    </div>
  )
}

export default AdminPage
