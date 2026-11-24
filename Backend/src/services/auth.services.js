import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import mailer_transporter, { isMailerConfigured } from '../config/mailer.config.js'
import user_repository from '../repositories/user.repository.js'
import { compareHash, generateHash } from '../utils/bcrypt.util.js'
import ServerError from '../utils/error.util.js'
import { verificationEmailTemplate, resetPasswordEmailTemplate } from '../utils/email-templates.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email) {
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        throw new ServerError('El formato de correo electrónico es inválido', 400)
    }
}

async function sendVerificationEmailTo(email) {
    const token = jwt.sign(
        { email, purpose: 'email_verification' },
        ENVIRONMENT.JWT_SECRET_KEY,
        { expiresIn: '7d' }
    )

    const verification_url = `${ENVIRONMENT.URL_FRONTEND}/verify-email?token=${token}`
    let email_sent = false

    if (isMailerConfigured()) {
        try {
            await mailer_transporter.sendMail({
                to: email,
                from: `"CheckWork UTN" <${ENVIRONMENT.GMAIL_USER}>`,
                subject: 'Verifica tu cuenta de CheckWork',
                html: verificationEmailTemplate(verification_url)
            })
            email_sent = true
            console.log(`[Nodemailer] Correo de verificación enviado exitosamente a: ${email}`)
        } catch (error) {
            console.error('[Nodemailer] Error al enviar correo de verificación:', error.message)
            email_sent = false
        }
    } else {
        console.log('[DEV] Simulación de correo de verificación (Gmail no configurado en .env):')
        console.log(`URL de verificación: ${verification_url}`)
    }

    return { verification_url, email_sent }
}

async function sendPasswordResetEmailTo(email) {
    const token = jwt.sign(
        { email, purpose: 'password_reset' },
        ENVIRONMENT.JWT_SECRET_KEY,
        { expiresIn: '1h' }
    )

    const reset_url = `${ENVIRONMENT.URL_FRONTEND}/reset-password?token=${token}`
    let email_sent = false

    if (isMailerConfigured()) {
        try {
            await mailer_transporter.sendMail({
                to: email,
                from: `"CheckWork UTN" <${ENVIRONMENT.GMAIL_USER}>`,
                subject: 'Restablece tu contraseña de CheckWork',
                html: resetPasswordEmailTemplate(reset_url)
            })
            email_sent = true
            console.log(`[Nodemailer] Correo de restablecimiento enviado exitosamente a: ${email}`)
        } catch (error) {
            console.error('[Nodemailer] Error al enviar correo de restablecimiento:', error.message)
            email_sent = false
        }
    } else {
        console.log('[DEV] Simulación de correo de restablecimiento (Gmail no configurado en .env):')
        console.log(`URL de reseteo: ${reset_url}`)
    }

    return { reset_url, email_sent }
}

export async function registerUser(nombre, email, password) {
    if (!nombre || !email || !password) {
        throw new ServerError('Nombre, email y contraseña son obligatorios', 400)
    }

    validateEmail(email)

    if (password.length < 6) {
        throw new ServerError('La contraseña debe tener al menos 6 caracteres', 400)
    }

    const existingUser = await user_repository.getByEmail(email)
    if (existingUser) {
        throw new ServerError('El correo electrónico ya está registrado', 400)
    }

    const hashedPassword = await generateHash(password)

    const newUser = await user_repository.create({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        email_verificado: false
    })

    const mailResult = await sendVerificationEmailTo(newUser.email)

    return {
        user: {
            id: newUser._id,
            nombre: newUser.nombre,
            email: newUser.email
        },
        verification_url: mailResult.verification_url,
        email_sent: mailResult.email_sent
    }
}

export async function loginUser(email, password) {
    if (!email || !password) {
        throw new ServerError('Email y contraseña son obligatorios', 400)
    }

    validateEmail(email)

    const user = await user_repository.getByEmail(email)
    if (!user) {
        throw new ServerError('Credenciales incorrectas', 401)
    }

    const isMatch = await compareHash(password, user.password)
    if (!isMatch) {
        throw new ServerError('Credenciales incorrectas', 401)
    }

    if (!user.activo) {
        throw new ServerError('Tu cuenta se encuentra desactivada', 403)
    }

    if (!user.email_verificado) {
        throw new ServerError('Tu correo electrónico aún no ha sido verificado. Por favor revisa tu bandeja de entrada o solicita un nuevo enlace.', 403)
    }

    const token = jwt.sign(
        {
            id: user._id,
            nombre: user.nombre,
            email: user.email
        },
        ENVIRONMENT.JWT_SECRET_KEY,
        { expiresIn: '24h' }
    )

    return {
        token,
        user: {
            id: user._id,
            nombre: user.nombre,
            email: user.email
        }
    }
}

export async function verifyEmailToken(token) {
    if (!token) {
        throw new ServerError('El token de verificación es obligatorio', 400)
    }

    let payload
    try {
        payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)
    } catch (err) {
        throw new ServerError('El enlace de verificación es inválido o ha expirado', 400)
    }

    if (payload.purpose !== 'email_verification') {
        throw new ServerError('El token proporcionado no es válido para verificación de cuenta', 400)
    }

    const user = await user_repository.getByEmail(payload.email)
    if (!user) {
        throw new ServerError('Usuario no encontrado', 404)
    }

    if (user.email_verificado) {
        return { message: 'La cuenta ya se encuentra verificada' }
    }

    await user_repository.updateById(user._id, { email_verificado: true })
    return { message: 'Cuenta verificada con éxito' }
}

export async function resendVerificationEmail(email) {
    validateEmail(email)

    const user = await user_repository.getByEmail(email)
    // Respuesta genérica para evitar enumeración de usuarios
    if (user && user.activo && !user.email_verificado) {
        return await sendVerificationEmailTo(user.email)
    }
    return null
}

export async function forgotPassword(email) {
    validateEmail(email)

    const user = await user_repository.getByEmail(email)
    // Respuesta genérica para evitar enumeración
    if (user && user.activo) {
        return await sendPasswordResetEmailTo(user.email)
    }
    return null
}

export async function resetPasswordWithToken(token, newPassword) {
    if (!token) {
        throw new ServerError('El token de restablecimiento es obligatorio', 400)
    }

    if (!newPassword || newPassword.length < 6) {
        throw new ServerError('La nueva contraseña debe tener al menos 6 caracteres', 400)
    }

    let payload
    try {
        payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)
    } catch (err) {
        throw new ServerError('El enlace de restablecimiento es inválido o ha expirado', 400)
    }

    if (payload.purpose !== 'password_reset') {
        throw new ServerError('Token inválido para esta operación', 400)
    }

    const user = await user_repository.getByEmail(payload.email)
    if (!user || !user.activo) {
        throw new ServerError('Usuario no encontrado o inactivo', 404)
    }

    const hashedPassword = await generateHash(newPassword)
    await user_repository.updateById(user._id, { password: hashedPassword })

    return { message: 'Contraseña actualizada correctamente' }
}

export async function getProfile(userId) {
    const user = await user_repository.getById(userId)
    if (!user) {
        throw new ServerError('Usuario no encontrado', 404)
    }
    return {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        fecha_creacion: user.fecha_creacion
    }
}
