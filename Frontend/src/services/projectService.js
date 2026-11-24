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

export async function getAllProjects() {
    const response = await fetch(`${API_URL}/api/projects`, {
        method: 'GET',
        headers: getAuthHeaders()
    })

    return readResponse(response)
}

export async function getProjectById(projectId) {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    })

    return readResponse(response)
}

export async function createProject(projectData) {
    const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
    })

    return readResponse(response)
}

export async function updateProject(projectId, updateData) {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
    })

    return readResponse(response)
}

export async function deleteProject(projectId) {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    })

    return readResponse(response)
}
