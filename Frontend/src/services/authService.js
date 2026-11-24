const API_URL = import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:8080'

async function readResponse(response) {
    const contentType = response.headers.get('content-type') || ''
    const body = contentType.includes('application/json')
        ? await response.json()
        : { ok: false, message: 'El servidor respondió con un formato inesperado' }

    if (!response.ok || !body.ok) {
        throw new Error(body.message || 'Ocurrió un error al comunicarte con el servidor')
    }
    return body
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    return readResponse(response)
}

export async function register(nombre, email, password) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
    })

    return readResponse(response)
}

export async function verifyEmail(token) {
    const response = await fetch(`${API_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
        method: 'GET'
    })

    return readResponse(response)
}

export async function resendEmailVerification(email) {
    const response = await fetch(`${API_URL}/api/auth/verify-email/${encodeURIComponent(email)}/resend`, {
        method: 'GET'
    })

    return readResponse(response)
}

export async function forgotPassword(email) {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })

    return readResponse(response)
}

export async function resetPassword(token, password) {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
    })

    return readResponse(response)
}

export async function getMe() {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return readResponse(response)
}
