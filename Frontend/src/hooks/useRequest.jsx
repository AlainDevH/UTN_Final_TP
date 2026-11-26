import { useState, useCallback } from 'react'

export default function useRequest() {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)

    const sendRequest = useCallback(async (requestFn) => {
        try {
            setLoading(true)
            setError(null)
            const result = await requestFn()
            setResponse(result)
            return result
        } catch (err) {
            setResponse(null)
            const isNetworkError = err.message === 'Failed to fetch' || (err.name === 'TypeError' && err.message?.toLowerCase().includes('fetch'))
            const message = isNetworkError
                ? 'No se pudo conectar con el backend (http://localhost:8080). Asegúrate de que el servidor esté encendido con "npm run dev".'
                : (err.message || 'Ocurrió un error inesperado')
            setError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        loading,
        response,
        error,
        sendRequest,
        setError
    }
}
