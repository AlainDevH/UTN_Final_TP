/*
Plantillas HTML para los correos electrónicos transaccionales enviados por Nodemailer
*/

export function verificationEmailTemplate(verification_url) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifica tu cuenta</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #1f2937; }
            .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
            .logo { font-size: 24px; font-weight: 800; color: #8b5cf6; text-align: center; margin-bottom: 24px; letter-spacing: -0.5px; }
            h1 { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 12px; text-align: center; }
            p { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
            .btn-container { text-align: center; margin: 32px 0; }
            .btn { background-color: #4f46e5; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; }
            .footer { font-size: 12px; color: #9ca3af; text-align: center; margin-top: 24px; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="logo">CheckWork • UTN</div>
            <h1>¡Bienvenido a tu Gestor de Tareas!</h1>
            <p>Gracias por registrarte. Para comenzar a organizar tus proyectos y tareas, confirma tu dirección de correo electrónico haciendo clic en el siguiente botón:</p>
            <div class="btn-container">
                <a class="btn" href="${verification_url}" target="_blank">Verificar mi cuenta</a>
            </div>
            <p style="font-size: 13px; color: #6b7280;">Este enlace de activación tiene una validez de 7 días. Si no creaste una cuenta, puedes ignorar este mensaje de forma segura.</p>
            <div class="footer">
                Proyecto Integrador Full-Stack • UTN PWA
            </div>
        </div>
    </body>
    </html>
    `
}

export function resetPasswordEmailTemplate(reset_url) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer contraseña</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #1f2937; }
            .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
            .logo { font-size: 24px; font-weight: 800; color: #8b5cf6; text-align: center; margin-bottom: 24px; letter-spacing: -0.5px; }
            h1 { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 12px; text-align: center; }
            p { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
            .btn-container { text-align: center; margin: 32px 0; }
            .btn { background-color: #dc2626; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; }
            .footer { font-size: 12px; color: #9ca3af; text-align: center; margin-top: 24px; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="logo">CheckWork • UTN</div>
            <h1>Restablecimiento de contraseña</h1>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para definir una nueva contraseña:</p>
            <div class="btn-container">
                <a class="btn" href="${reset_url}" target="_blank">Restablecer mi contraseña</a>
            </div>
            <p style="font-size: 13px; color: #6b7280;">Este enlace expirará en 1 hora por razones de seguridad. Si no solicitaste este cambio, desestima este correo; tu contraseña actual continuará siendo segura.</p>
            <div class="footer">
                Proyecto Integrador Full-Stack • UTN PWA
            </div>
        </div>
    </body>
    </html>
    `
}
