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
    const [resendResult, setResendResult] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await sendRequest(() => resendEmailVerification(formState.email))
            setResendResult(res?.data)
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

                        {resendResult?.verification_url && !resendResult?.email_sent && (
                            <div style={{
                                margin: '18px 0',
                                padding: '16px',
                                background: 'rgba(139, 92, 246, 0.12)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: 'var(--radius-sm)',
                                textAlign: 'left'
                            }}>
                                <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '10px', lineHeight: '1.5' }}>
                                    ⚡ <strong>Modo Local / Sin Gmail configurado:</strong>
                                    <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        Puedes activar tu cuenta directamente con este botón:
                                    </div>
                                </div>
                                <a
                                    href={resendResult.verification_url}
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        display: 'inline-flex',
                                        justifyContent: 'center',
                                        textDecoration: 'none'
                                    }}
                                >
                                    👉 Activar mi cuenta ahora
                                </a>
                            </div>
                        )}

                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '16px 0', lineHeight: '1.5' }}>
                            Revisa tu bandeja de entrada o la carpeta de correo no deseado (spam).
                        </p>
                        <Link to="/login" className="btn-secondary" style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
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
