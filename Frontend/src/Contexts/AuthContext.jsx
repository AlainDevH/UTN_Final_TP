import React, { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('auth_token'))
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            if (token) {
                try {
                    const res = await getMe()
                    setUser(res.data.user)
                } catch (error) {
                    console.error('[AuthContext] Sesión expirada o inválida:', error.message)
                    logout()
                }
            } else {
                setUser(null)
            }
            setAuthLoading(false)
        }
        loadUser()
    }, [token])

    function login(newToken, userData) {
        localStorage.setItem('auth_token', newToken)
        setToken(newToken)
        if (userData) setUser(userData)
    }

    function logout() {
        localStorage.removeItem('auth_token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: Boolean(token), authLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
