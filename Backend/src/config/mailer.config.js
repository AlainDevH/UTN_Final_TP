import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

const mailer_transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENVIRONMENT.GMAIL_USER,
        pass: ENVIRONMENT.GMAIL_PASSWORD
    }
})

export function isMailerConfigured() {
    const user = ENVIRONMENT.GMAIL_USER
    const password = ENVIRONMENT.GMAIL_PASSWORD

    return Boolean(
        user &&
        password &&
        !/^(tu_|example|placeholder)/i.test(user) &&
        user.includes('@') &&
        !/^tu_|^example|^placeholder/i.test(password)
    )
}

export default mailer_transporter
