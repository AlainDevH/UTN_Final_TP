import React, { useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register as registerService } from '../../services/authService'
import TextField from '../../Components/Form/TextField'
import FormButton from '../../Components/Form/FormButton'
import Alert from '../../Components/Alert/Alert'
import Logo from '../../Components/Logo/Logo'
import { FaListCheck } from 'react-icons/fa6'

export default function RegisterScreen() {
    const { formState, handleChangeInput, resetForm } = useForm({
        nombre: '',
        email: '',
        password: '',
        confirm_password: ''
    })
    const { loading, error, sendRequest, setError } = useRequest()
    const [successMessage, setSuccessMessage] = useState(null)
    const [registrationResult, setRegistrationResult] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()

        if (formState.password !== formState.confirm_password) {
            setError('Las contraseñas no coinciden')
            return
        }

        try {
            const res = await sendRequest(() =>
                registerService(formState.nombre, formState.email, formState.password)
            )
            setRegistrationResult(res.data)
            setSuccessMessage(res.message || 'Registro exitoso. Revisa tu correo electrónico para activar la cuenta.')
            resetForm()
        } catch (err) {
            // El error es manejado por useRequest
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Logo size={42} textSize={26} />
                    </div>
                    <h1 className="auth-title">Crear Cuenta</h1>
                    <p className="auth-subtitle">Regístrate para organizar tus tareas y proyectos</p>
                </div>

                {successMessage ? (
                    <div>
                        <Alert type="success">{successMessage}</Alert>

                        {registrationResult?.verification_url && !registrationResult?.email_sent && (
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
                                        Como el servidor aún no tiene credenciales válidas de Gmail en <code>Backend/.env</code>, puedes activar tu cuenta directamente con este botón:
                                    </div>
                                </div>
                                <a
                                    href={registrationResult.verification_url}
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

                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '16px 0', lineHeight: '1.6' }}>
                            {registrationResult?.email_sent
                                ? 'Hemos enviado un enlace de activación a tu correo electrónico válido por 7 días.'
                                : 'Una vez que confirmes tu correo, podrás iniciar sesión normalmente.'}
                        </p>
                        <Link to="/login" className="btn-secondary" style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                            Ir a Iniciar Sesión
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nombre completo"
                            name="nombre"
                            value={formState.nombre}
                            onChange={handleChangeInput}
                            placeholder="Ej. Juan Pérez"
                            required
                            autoComplete="name"
                        />

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

                        <TextField
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={formState.password}
                            onChange={handleChangeInput}
                            placeholder="Mínimo 6 caracteres"
                            required
                            autoComplete="new-password"
                        />

                        <TextField
                            label="Confirmar contraseña"
                            name="confirm_password"
                            type="password"
                            value={formState.confirm_password}
                            onChange={handleChangeInput}
                            placeholder="Repite tu contraseña"
                            required
                            autoComplete="new-password"
                        />

                        {error && <Alert type="error">{error}</Alert>}

                        <FormButton loading={loading} loadingText="Creando cuenta...">
                            Crear Cuenta
                        </FormButton>
                    </form>
                )}

                <div className="auth-footer">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                </div>
            </div>
        </div>
    )
}
