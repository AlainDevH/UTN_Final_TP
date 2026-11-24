import React, { useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { verifyEmail } from '../../services/authService'
import Alert from '../../Components/Alert/Alert'
import Logo from '../../Components/Logo/Logo'
import { FaListCheck } from 'react-icons/fa6'

export default function VerifyEmailScreen() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const { loading, response, error, sendRequest } = useRequest()
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            sendRequest(() => verifyEmail(token))
        }
    }, [token, sendRequest])

    useEffect(() => {
        if (response) {
            const timer = setTimeout(() => {
                navigate('/login')
            }, 3500)
            return () => clearTimeout(timer)
        }
    }, [response, navigate])

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <div className="auth-header">
                    <div className="auth-logo">
                        <Logo size={42} textSize={26} />
                    </div>
                    <h1 className="auth-title">Verificación de Cuenta</h1>
                    <p className="auth-subtitle">Activando tu acceso a la plataforma</p>
                </div>

                {!token && (
                    <Alert type="error">
                        No se detectó el token de verificación en el enlace. Por favor verifica que copiaste el link completo.
                    </Alert>
                )}

                {loading && (
                    <div style={{ padding: '24px 0' }}>
                        <div className="btn-spinner" style={{ width: '32px', height: '32px', borderColor: '#e5e7eb', borderTopColor: '#4f46e5', margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Verificando tu cuenta con el servidor...</p>
                    </div>
                )}

                {error && (
                    <div>
                        <Alert type="error">{error}</Alert>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '16px 0' }}>
                            Es posible que el enlace haya expirado o ya haya sido utilizado.
                        </p>
                        <Link to="/resend-verification" className="btn-secondary" style={{ width: '100%', marginBottom: '8px' }}>
                            Solicitar nuevo correo de activación
                        </Link>
                    </div>
                )}

                {response && (
                    <div>
                        <Alert type="success">{response.message || '¡Cuenta verificada exitosamente!'}</Alert>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '16px 0' }}>
                            Serás redirigido al inicio de sesión en unos momentos...
                        </p>
                        <Link to="/login" className="btn-primary" style={{ width: '100%' }}>
                            Ir a Iniciar Sesión ahora
                        </Link>
                    </div>
                )}

                <div className="auth-footer" style={{ marginTop: '24px' }}>
                    <Link to="/login">Volver al inicio de sesión</Link>
                </div>
            </div>
        </div>
    )
}
