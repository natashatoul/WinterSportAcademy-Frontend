import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'

export default function useApiList({ endpoint, errorMessage }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const res = await api.get(endpoint)
      setItems(res.data)
    } catch {
      setError(errorMessage)
    }
  }, [endpoint, errorMessage])

  useEffect(() => {
    load()
  }, [load])

  return { items, setItems, error, setError, load }
}
