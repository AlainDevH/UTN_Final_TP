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
            setError(err.message || 'Ocurrió un error inesperado')
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
