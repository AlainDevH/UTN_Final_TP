import * as project_services from '../services/project.services.js'

export async function getAllProjects(request, response, next) {
    try {
        const projects = await project_services.getAllProjects(request.user.id)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Proyectos obtenidos correctamente',
            data: { projects }
        })
    } catch (error) {
        next(error)
    }
}

export async function getProjectById(request, response, next) {
    try {
        const { project_id } = request.params
        const result = await project_services.getProjectById(project_id, request.user.id)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Proyecto obtenido correctamente',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export async function createProject(request, response, next) {
    try {
        const project = await project_services.createProject(request.body, request.user.id)

        return response.status(201).json({
            ok: true,
            status: 201,
            message: 'Proyecto creado correctamente',
            data: { project }
        })
    } catch (error) {
        next(error)
    }
}

export async function updateProject(request, response, next) {
    try {
        const { project_id } = request.params
        const project = await project_services.updateProject(project_id, request.user.id, request.body)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Proyecto actualizado correctamente',
            data: { project }
        })
    } catch (error) {
        next(error)
    }
}

export async function deleteProject(request, response, next) {
    try {
        const { project_id } = request.params
        const deleted = await project_services.deleteProject(project_id, request.user.id)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Proyecto y tareas asociadas eliminados correctamente',
            data: { project_deleted: deleted }
        })
    } catch (error) {
        next(error)
    }
}
