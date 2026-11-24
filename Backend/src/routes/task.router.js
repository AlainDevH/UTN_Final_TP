import express from 'express'
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from '../controllers/task.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { validateRequiredFields } from '../middlewares/validate.middleware.js'

const task_router = express.Router()

// Todas las rutas de tareas están protegidas por JWT
task_router.use(authMiddleware)

task_router.get('/', getAllTasks)

task_router.get('/:task_id', getTaskById)

task_router.post('/', validateRequiredFields(['titulo', 'fk_id_proyecto']), createTask)

task_router.put('/:task_id', updateTask)

task_router.delete('/:task_id', deleteTask)

export default task_router
