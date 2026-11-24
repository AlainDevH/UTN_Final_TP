import * as task_services from '../services/task.services.js'

export async function getAllTasks(request, response, next) {
    try {
        const tasks = await task_services.getAllTasks(request.user.id, request.query)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Tareas obtenidas correctamente',
            data: { tasks }
        })
    } catch (error) {
        next(error)
    }
}

export async function getTaskById(request, response, next) {
    try {
        const { task_id } = request.params
        const task = await task_services.getTaskById(task_id, request.user.id)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Tarea obtenida correctamente',
            data: { task }
        })
    } catch (error) {
        next(error)
    }
}

export async function createTask(request, response, next) {
    try {
        const task = await task_services.createTask(request.body, request.user.id)

        return response.status(201).json({
            ok: true,
            status: 201,
            message: 'Tarea creada correctamente',
            data: { task }
        })
    } catch (error) {
        next(error)
    }
}

export async function updateTask(request, response, next) {
    try {
        const { task_id } = request.params
        const task = await task_services.updateTask(task_id, request.user.id, request.body)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Tarea actualizada correctamente',
            data: { task }
        })
    } catch (error) {
        next(error)
    }
}

export async function deleteTask(request, response, next) {
    try {
        const { task_id } = request.params
        const task = await task_services.deleteTask(task_id, request.user.id)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Tarea eliminada correctamente',
            data: { task_deleted: task }
        })
    } catch (error) {
        next(error)
    }
}
