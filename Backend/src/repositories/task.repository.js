import Task from '../models/task.model.js'

class TaskRepository {
    async create(taskData) {
        return await Task.create(taskData)
    }

    async getByUserId(userId, filters = {}) {
        const query = { fk_id_usuario: userId }

        if (filters.fk_id_proyecto) {
            query.fk_id_proyecto = filters.fk_id_proyecto
        }
        if (filters.estado) {
            query.estado = filters.estado
        }
        if (filters.prioridad) {
            query.prioridad = filters.prioridad
        }
        if (filters.busqueda) {
            query.$or = [
                { titulo: { $regex: filters.busqueda, $options: 'i' } },
                { descripcion: { $regex: filters.busqueda, $options: 'i' } }
            ]
        }

        return await Task.find(query)
            .populate('fk_id_proyecto', 'nombre color estado')
            .sort({ fecha_creacion: -1 })
    }

    async getByIdAndUserId(taskId, userId) {
        return await Task.findOne({ _id: taskId, fk_id_usuario: userId })
            .populate('fk_id_proyecto', 'nombre color descripcion estado')
    }

    async updateByIdAndUserId(taskId, userId, updateData) {
        return await Task.findOneAndUpdate(
            { _id: taskId, fk_id_usuario: userId },
            updateData,
            { new: true }
        ).populate('fk_id_proyecto', 'nombre color estado')
    }

    async deleteByIdAndUserId(taskId, userId) {
        return await Task.findOneAndDelete({ _id: taskId, fk_id_usuario: userId })
    }

    async deleteByProjectId(projectId, userId) {
        return await Task.deleteMany({ fk_id_proyecto: projectId, fk_id_usuario: userId })
    }

    async countByProjectId(projectId, userId) {
        return await Task.countDocuments({ fk_id_proyecto: projectId, fk_id_usuario: userId })
    }
}

const task_repository = new TaskRepository()
export default task_repository
