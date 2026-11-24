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

function getAuthHeaders() {
    const token = localStorage.getItem('auth_token')
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export async function getAllTasks(filters = {}) {
    const params = new URLSearchParams()
    if (filters.project_id) params.append('project_id', filters.project_id)
    if (filters.estado) params.append('estado', filters.estado)
    if (filters.prioridad) params.append('prioridad', filters.prioridad)
    if (filters.busqueda) params.append('busqueda', filters.busqueda)

    const queryString = params.toString() ? `?${params.toString()}` : ''

    const response = await fetch(`${API_URL}/api/tasks${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders()
    })

    return readResponse(response)
}

export async function getTaskById(taskId) {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    })

    return readResponse(response)
}

export async function createTask(taskData) {
    const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
    })

    return readResponse(response)
}

export async function updateTask(taskId, updateData) {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
    })

    return readResponse(response)
}

export async function deleteTask(taskId) {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    })

    return readResponse(response)
}
