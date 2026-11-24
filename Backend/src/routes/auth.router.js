import express from 'express'
import {
    register,
    login,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    getMe
} from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { validateRequiredFields } from '../middlewares/validate.middleware.js'

const auth_router = express.Router()

auth_router.post('/register', validateRequiredFields(['nombre', 'email', 'password']), register)

auth_router.post('/login', validateRequiredFields(['email', 'password']), login)

auth_router.get('/verify-email', verifyEmail)

auth_router.get('/verify-email/:email/resend', resendVerification)

auth_router.post('/forgot-password', validateRequiredFields(['email']), forgotPassword)

auth_router.post('/reset-password', validateRequiredFields(['token', 'password']), resetPassword)

auth_router.get('/me', authMiddleware, getMe)

export default auth_router
