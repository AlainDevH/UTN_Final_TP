import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            maxlength: [60, 'El nombre no puede exceder los 60 caracteres']
        },
        email: {
            type: String,
            required: [true, 'El correo electrónico es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria']
        },
        activo: {
            type: Boolean,
            default: true
        },
        email_verificado: {
            type: Boolean,
            default: false
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

export const USER_COLLECTION_NAME = 'Usuario'
const User = mongoose.model(USER_COLLECTION_NAME, userSchema)

export default User
