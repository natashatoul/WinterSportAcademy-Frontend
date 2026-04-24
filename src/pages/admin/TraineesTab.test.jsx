import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import TraineesTab from './TraineesTab'
import api from '../../services/api'

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('TraineesTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders trainee id in table', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        {
          traineeId: 101,
          firstName: 'Alex',
          lastName: 'Stone',
          skillLevel: 'Beginner',
        },
      ],
    })

    render(<TraineesTab />)

    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument()
    expect(await screen.findByText('Alex Stone')).toBeInTheDocument()
    expect(screen.getByText('101')).toBeInTheDocument()
    expect(screen.getByText('Beginner')).toBeInTheDocument()
  })

  it('shows load error alert if request fails', async () => {
    api.get.mockRejectedValueOnce(new Error('failed'))

    render(<TraineesTab />)

    expect(await screen.findByText('Failed to load')).toBeInTheDocument()
  })
})
