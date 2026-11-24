import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../Contexts/AuthContext'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { login as loginService } from '../../services/authService'
import TextField from '../../Components/Form/TextField'
import FormButton from '../../Components/Form/FormButton'
import Alert from '../../Components/Alert/Alert'
import Logo from '../../Components/Logo/Logo'
import { FaListCheck } from 'react-icons/fa6'

export default function LoginScreen() {
    const { formState, handleChangeInput } = useForm({ email: '', password: '' })
    const { loading, error, sendRequest } = useRequest()
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await sendRequest(() => loginService(formState.email, formState.password))
            if (res && res.data) {
                login(res.data.token, res.data.user)
                navigate('/home')
            }
        } catch (err) {
            // Error es manejado por useRequest
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Logo size={42} textSize={26} />
                    </div>
                    <h1 className="auth-title">Iniciar Sesión</h1>
                    <p className="auth-subtitle">Ingresa tus credenciales para acceder a tus proyectos</p>
                </div>

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

                    <TextField
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={formState.password}
                        onChange={handleChangeInput}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                    />

                    <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                        <Link to="/forgot-password" style={{ fontSize: '13px' }}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {error && <Alert type="error">{error}</Alert>}

                    <FormButton loading={loading} loadingText="Iniciando sesión...">
                        Iniciar Sesión
                    </FormButton>
                </form>

                <div className="auth-footer">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate gratis</Link>
                    <br />
                    ¿No recibiste el correo de activación? <Link to="/resend-verification">Reenviar activación</Link>
                </div>
            </div>
        </div>
    )
}
