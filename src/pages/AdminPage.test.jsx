import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPage from './AdminPage'

describe('AdminPage', () => {
  it('renders admin tabs', () => {
    render(<AdminPage />)

    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Trainees' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Instructors' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Equipment' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sessions' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrations' })).toBeInTheDocument()
  })

  it('shows training sessions tab content when Sessions is clicked', async () => {
    const user = userEvent.setup()
    render(<AdminPage />)

    await user.click(screen.getByRole('button', { name: 'Sessions' }))

    expect(screen.getByText('Training Sessions')).toBeInTheDocument()
  })
})
