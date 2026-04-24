import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import useApiList from './useApiList'
import api from '../services/api'

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('useApiList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads items from api on mount', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ traineeId: 1, firstName: 'Anna' }],
    })

    const { result } = renderHook(() =>
      useApiList({ endpoint: '/Trainees', errorMessage: 'Failed to load' }),
    )

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1)
    })

    expect(result.current.items[0].traineeId).toBe(1)
    expect(result.current.error).toBe('')
    expect(api.get).toHaveBeenCalledWith('/Trainees')
  })

  it('sets error when api request fails', async () => {
    api.get.mockRejectedValueOnce(new Error('network'))

    const { result } = renderHook(() =>
      useApiList({ endpoint: '/Trainees', errorMessage: 'Failed to load' }),
    )

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load')
    })

    expect(result.current.items).toEqual([])
  })
})
