import React from 'react'
import { Outlet, Navigate } from 'react-router'
import { useAuth } from '../Contexts/AuthContext'
import Navbar from '../Components/Navbar/Navbar'

export default function AuthMiddleware() {
    const { isAuthenticated, authLoading } = useAuth()

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Verificando sesión...</span>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '24px 0 60px 0' }}>
                <Outlet />
            </main>
        </div>
    )
}
