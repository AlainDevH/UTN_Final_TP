import Project from '../models/project.model.js'

class ProjectRepository {
    async create(projectData) {
        return await Project.create(projectData)
    }

    async getByUserId(userId) {
        return await Project.find({ fk_id_usuario: userId }).sort({ fecha_creacion: -1 })
    }

    async getByIdAndUserId(projectId, userId) {
        return await Project.findOne({ _id: projectId, fk_id_usuario: userId })
    }

    async updateByIdAndUserId(projectId, userId, updateData) {
        return await Project.findOneAndUpdate(
            { _id: projectId, fk_id_usuario: userId },
            updateData,
            { new: true }
        )
    }

    async deleteByIdAndUserId(projectId, userId) {
        return await Project.findOneAndDelete({ _id: projectId, fk_id_usuario: userId })
    }
}

const project_repository = new ProjectRepository()
export default project_repository
