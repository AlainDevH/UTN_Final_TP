import project_repository from '../repositories/project.repository.js'
import task_repository from '../repositories/task.repository.js'
import ServerError from '../utils/error.util.js'

export async function getAllProjects(userId) {
    const projects = await project_repository.getByUserId(userId)

    // Estadísticas de tareas para cada proyecto
    const projectsWithStats = await Promise.all(
        projects.map(async (project) => {
            const tasks = await task_repository.getByUserId(userId, { fk_id_proyecto: project._id })
            const completedCount = tasks.filter(t => t.estado === 'completada').length
            return {
                ...project.toObject(),
                total_tareas: tasks.length,
                tareas_completadas: completedCount
            }
        })
    )

    return projectsWithStats
}

export async function getProjectById(projectId, userId) {
    const project = await project_repository.getByIdAndUserId(projectId, userId)
    if (!project) {
        throw new ServerError('Proyecto no encontrado', 404)
    }

    const tasks = await task_repository.getByUserId(userId, { fk_id_proyecto: projectId })

    return {
        project,
        tasks
    }
}

export async function createProject(data, userId) {
    const { nombre, descripcion, color, estado } = data

    if (typeof nombre !== 'string' || !nombre.trim()) {
        throw new ServerError('El nombre del proyecto es obligatorio', 400)
    }
    if (descripcion !== undefined && typeof descripcion !== 'string') {
        throw new ServerError('La descripción del proyecto debe ser texto', 400)
    }
    if (estado && !['activo', 'archivado', 'completado'].includes(estado)) {
        throw new ServerError('Estado de proyecto inválido', 400)
    }

    const newProject = await project_repository.create({
        nombre: nombre.trim(),
        descripcion: descripcion ? descripcion.trim() : '',
        color: color || '#4f46e5',
        estado: estado || 'activo',
        fk_id_usuario: userId
    })

    return newProject
}

export async function updateProject(projectId, userId, updateData) {
    const project = await project_repository.getByIdAndUserId(projectId, userId)
    if (!project) {
        throw new ServerError('Proyecto no encontrado', 404)
    }

    if (updateData.nombre !== undefined) {
        if (typeof updateData.nombre !== 'string' || !updateData.nombre.trim()) {
            throw new ServerError('El nombre del proyecto no puede estar vacío', 400)
        }
    }
    if (updateData.descripcion !== undefined && typeof updateData.descripcion !== 'string') {
        throw new ServerError('La descripción del proyecto debe ser texto', 400)
    }
    if (updateData.estado !== undefined && !['activo', 'archivado', 'completado'].includes(updateData.estado)) {
        throw new ServerError('Estado de proyecto inválido', 400)
    }

    const cleanUpdate = {}
    if (updateData.nombre) cleanUpdate.nombre = updateData.nombre.trim()
    if (updateData.descripcion !== undefined) cleanUpdate.descripcion = updateData.descripcion.trim()
    if (updateData.color) cleanUpdate.color = updateData.color
    if (updateData.estado) cleanUpdate.estado = updateData.estado

    const updated = await project_repository.updateByIdAndUserId(projectId, userId, cleanUpdate)
    return updated
}

export async function deleteProject(projectId, userId) {
    const project = await project_repository.getByIdAndUserId(projectId, userId)
    if (!project) {
        throw new ServerError('Proyecto no encontrado', 404)
    }

    // Eliminación en cascada de tareas asociadas
    await task_repository.deleteByProjectId(projectId, userId)
    const deleted = await project_repository.deleteByIdAndUserId(projectId, userId)

    return deleted
}
