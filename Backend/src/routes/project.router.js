import express from 'express'
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from '../controllers/project.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { validateRequiredFields } from '../middlewares/validate.middleware.js'

const project_router = express.Router()

// Todas las rutas de proyectos están protegidas por JWT
project_router.use(authMiddleware)

project_router.get('/', getAllProjects)

project_router.get('/:project_id', getProjectById)

project_router.post('/', validateRequiredFields(['nombre']), createProject)

project_router.put('/:project_id', updateProject)

project_router.delete('/:project_id', deleteProject)

export default project_router
