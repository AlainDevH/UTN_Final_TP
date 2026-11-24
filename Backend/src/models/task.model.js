import mongoose from 'mongoose'
import { USER_COLLECTION_NAME } from './user.model.js'
import { PROJECT_COLLECTION_NAME } from './project.model.js'

const taskSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, 'El título de la tarea es obligatorio'],
            trim: true,
            maxlength: [100, 'El título no puede superar los 100 caracteres']
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [1500, 'La descripción no puede superar los 1500 caracteres'],
            default: ''
        },
        estado: {
            type: String,
            enum: ['pendiente', 'en_progreso', 'completada'],
            default: 'pendiente'
        },
        prioridad: {
            type: String,
            enum: ['baja', 'media', 'alta', 'urgente'],
            default: 'media'
        },
        fecha_limite: {
            type: Date,
            default: null
        },
        fk_id_proyecto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: PROJECT_COLLECTION_NAME,
            required: [true, 'El proyecto asociado es obligatorio']
        },
        fk_id_usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: USER_COLLECTION_NAME,
            required: [true, 'El usuario propietario es obligatorio']
        },
        fecha_creacion: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
)

export const TASK_COLLECTION_NAME = 'Tarea'
const Task = mongoose.model(TASK_COLLECTION_NAME, taskSchema)

export default Task
