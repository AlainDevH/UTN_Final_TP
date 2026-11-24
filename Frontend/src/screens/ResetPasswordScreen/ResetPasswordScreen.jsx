import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resetPassword } from '../../services/authService'
import TextField from '../../Components/Form/TextField'
import FormButton from '../../Components/Form/FormButton'
import Alert from '../../Components/Alert/Alert'
import Logo from '../../Components/Logo/Logo'
import { FaListCheck } from 'react-icons/fa6'

export default function ResetPasswordScreen() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const { formState, handleChangeInput } = useForm({ password: '', confirm_password: '' })
    const { loading, error, sendRequest, setError } = useRequest()
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if (formState.password !== formState.confirm_password) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (formState.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        try {
            await sendRequest(() => resetPassword(token, formState.password))
            setSuccess(true)
        } catch (err) {
            // Manejado por useRequest
        }
    }

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/login')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [success, navigate])

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Logo size={42} textSize={26} />
                    </div>
                    <h1 className="auth-title">Nueva Contraseña</h1>
                    <p className="auth-subtitle">Crea una nueva clave para tu cuenta</p>
                </div>

                {!token ? (
                    <div>
                        <Alert type="error">
                            No se detectó el token de restablecimiento en el enlace. Solicita uno nuevo.
                        </Alert>
                        <Link to="/forgot-password" className="btn-secondary" style={{ width: '100%', marginTop: '12px' }}>
                            Solicitar nuevo enlace
                        </Link>
                    </div>
                ) : success ? (
                    <div>
                        <Alert type="success">
                            ¡Tu contraseña ha sido actualizada con éxito! Redirigiendo al login...
                        </Alert>
                        <Link to="/login" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                            Iniciar sesión ahora
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nueva contraseña"
                            name="password"
                            type="password"
                            value={formState.password}
                            onChange={handleChangeInput}
                            placeholder="Mínimo 6 caracteres"
                            required
                            autoComplete="new-password"
                        />

                        <TextField
                            label="Confirmar nueva contraseña"
                            name="confirm_password"
                            type="password"
                            value={formState.confirm_password}
                            onChange={handleChangeInput}
                            placeholder="Repite la contraseña"
                            required
                            autoComplete="new-password"
                        />

                        {error && <Alert type="error">{error}</Alert>}

                        <FormButton loading={loading} loadingText="Guardando...">
                            Actualizar contraseña
                        </FormButton>
                    </form>
                )}

                <div className="auth-footer">
                    <Link to="/login">Volver a iniciar sesión</Link>
                </div>
            </div>
        </div>
    )
}
