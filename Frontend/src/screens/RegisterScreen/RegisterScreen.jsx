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
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '16px 0', lineHeight: '1.6' }}>
                            Te enviamos un enlace de activación válido por 7 días. Una vez que confirmes tu correo, podrás iniciar sesión.
                        </p>
                        <Link to="/login" className="btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
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
