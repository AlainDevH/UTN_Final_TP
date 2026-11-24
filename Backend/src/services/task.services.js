import task_repository from '../repositories/task.repository.js'
import project_repository from '../repositories/project.repository.js'
import ServerError from '../utils/error.util.js'

export async function getAllTasks(userId, query) {
    const filters = {}

    if (query.project_id) {
        filters.fk_id_proyecto = query.project_id
    }
    if (query.estado && ['pendiente', 'en_progreso', 'completada'].includes(query.estado)) {
        filters.estado = query.estado
    }
    if (query.prioridad && ['baja', 'media', 'alta', 'urgente'].includes(query.prioridad)) {
        filters.prioridad = query.prioridad
    }
    if (query.busqueda) {
        filters.busqueda = query.busqueda.trim()
    }

    return await task_repository.getByUserId(userId, filters)
}

export async function getTaskById(taskId, userId) {
    const task = await task_repository.getByIdAndUserId(taskId, userId)
    if (!task) {
        throw new ServerError('Tarea no encontrada', 404)
    }
    return task
}

export async function createTask(data, userId) {
    const { titulo, descripcion, estado, prioridad, fecha_limite, fk_id_proyecto } = data

    if (typeof titulo !== 'string' || !titulo.trim()) {
        throw new ServerError('El título de la tarea es obligatorio', 400)
    }
    if (descripcion !== undefined && typeof descripcion !== 'string') {
        throw new ServerError('La descripción de la tarea debe ser texto', 400)
    }
    if (estado && !['pendiente', 'en_progreso', 'completada'].includes(estado)) {
        throw new ServerError('Estado de tarea inválido', 400)
    }
    if (prioridad && !['baja', 'media', 'alta', 'urgente'].includes(prioridad)) {
        throw new ServerError('Prioridad de tarea inválida', 400)
    }

    if (!fk_id_proyecto) {
        throw new ServerError('El proyecto asociado es obligatorio', 400)
    }

    // Validar que el proyecto exista y pertenezca al usuario
    const project = await project_repository.getByIdAndUserId(fk_id_proyecto, userId)
    if (!project) {
        throw new ServerError('El proyecto especificado no existe o no tienes permisos sobre él', 404)
    }

    let parsedDate = null
    if (fecha_limite) {
        parsedDate = new Date(fecha_limite)
        if (Number.isNaN(parsedDate.getTime())) {
            throw new ServerError('La fecha límite no tiene un formato válido', 400)
        }
    }

    const newTask = await task_repository.create({
        titulo: titulo.trim(),
        descripcion: descripcion ? descripcion.trim() : '',
        estado: estado || 'pendiente',
        prioridad: prioridad || 'media',
        fecha_limite: parsedDate,
        fk_id_proyecto: project._id,
        fk_id_usuario: userId
    })

    return await task_repository.getByIdAndUserId(newTask._id, userId)
}

export async function updateTask(taskId, userId, updateData) {
    const existingTask = await task_repository.getByIdAndUserId(taskId, userId)
    if (!existingTask) {
        throw new ServerError('Tarea no encontrada', 404)
    }

    const cleanUpdate = {}

    if (updateData.titulo !== undefined) {
        if (typeof updateData.titulo !== 'string' || !updateData.titulo.trim()) {
            throw new ServerError('El título no puede estar vacío', 400)
        }
        cleanUpdate.titulo = updateData.titulo.trim()
    }

    if (updateData.descripcion !== undefined) {
        if (typeof updateData.descripcion !== 'string') {
            throw new ServerError('La descripción de la tarea debe ser texto', 400)
        }
        cleanUpdate.descripcion = updateData.descripcion.trim()
    }

    if (updateData.estado !== undefined) {
        if (!['pendiente', 'en_progreso', 'completada'].includes(updateData.estado)) {
            throw new ServerError('Estado de tarea inválido', 400)
        }
        cleanUpdate.estado = updateData.estado
    }

    if (updateData.prioridad !== undefined) {
        if (!['baja', 'media', 'alta', 'urgente'].includes(updateData.prioridad)) {
            throw new ServerError('Prioridad de tarea inválida', 400)
        }
        cleanUpdate.prioridad = updateData.prioridad
    }

    if (updateData.fecha_limite !== undefined) {
        if (updateData.fecha_limite) {
            const parsedDate = new Date(updateData.fecha_limite)
            if (Number.isNaN(parsedDate.getTime())) {
                throw new ServerError('La fecha límite no tiene un formato válido', 400)
            }
            cleanUpdate.fecha_limite = parsedDate
        } else {
            cleanUpdate.fecha_limite = null
        }
    }

    if (updateData.fk_id_proyecto) {
        const project = await project_repository.getByIdAndUserId(updateData.fk_id_proyecto, userId)
        if (!project) {
            throw new ServerError('El proyecto destino no existe o no tienes acceso', 404)
        }
        cleanUpdate.fk_id_proyecto = updateData.fk_id_proyecto
    }

    return await task_repository.updateByIdAndUserId(taskId, userId, cleanUpdate)
}

export async function deleteTask(taskId, userId) {
    const task = await task_repository.getByIdAndUserId(taskId, userId)
    if (!task) {
        throw new ServerError('Tarea no encontrada', 404)
    }

    await task_repository.deleteByIdAndUserId(taskId, userId)
    return task
}
