import React, { useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resendEmailVerification } from '../../services/authService'
import TextField from '../../Components/Form/TextField'
import FormButton from '../../Components/Form/FormButton'
import Alert from '../../Components/Alert/Alert'
import Logo from '../../Components/Logo/Logo'
import { FaListCheck } from 'react-icons/fa6'

export default function ResendVerificationScreen() {
    const { formState, handleChangeInput } = useForm({ email: '' })
    const { loading, error, sendRequest } = useRequest()
    const [sent, setSent] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await sendRequest(() => resendEmailVerification(formState.email))
            setSent(true)
        } catch (err) {
            // Manejado por useRequest
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Logo size={42} textSize={26} />
                    </div>
                    <h1 className="auth-title">Reenviar Verificación</h1>
                    <p className="auth-subtitle">Ingresa tu email para recibir un nuevo enlace de activación</p>
                </div>

                {sent ? (
                    <div>
                        <Alert type="success">
                            Si tu correo está registrado y pendiente de confirmación, te hemos enviado un nuevo enlace.
                        </Alert>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '16px 0', lineHeight: '1.5' }}>
                            Revisa tu bandeja de entrada o la carpeta de correo no deseado (spam).
                        </p>
                        <Link to="/login" className="btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                            Volver a Iniciar Sesión
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleChangeInput}
                            placeholder="tu_correo@example.com"
                            required
                            autoComplete="email"
                        />

                        {error && <Alert type="error">{error}</Alert>}

                        <FormButton loading={loading} loadingText="Reenviando...">
                            Enviar nuevo enlace
                        </FormButton>
                    </form>
                )}

                <div className="auth-footer">
                    ¿Ya la confirmaste? <Link to="/login">Inicia sesión</Link>
                </div>
            </div>
        </div>
    )
}
