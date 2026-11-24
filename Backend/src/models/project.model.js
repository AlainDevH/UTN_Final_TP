import mongoose from 'mongoose'
import { USER_COLLECTION_NAME } from './user.model.js'

const projectSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del proyecto es obligatorio'],
            trim: true,
            maxlength: [50, 'El nombre del proyecto no puede superar 50 caracteres']
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [500, 'La descripción no puede superar 500 caracteres'],
            default: ''
        },
        color: {
            type: String,
            default: '#4f46e5',
            trim: true
        },
        estado: {
            type: String,
            enum: ['activo', 'archivado', 'completado'],
            default: 'activo'
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

export const PROJECT_COLLECTION_NAME = 'Proyecto'
const Project = mongoose.model(PROJECT_COLLECTION_NAME, projectSchema)

export default Project
