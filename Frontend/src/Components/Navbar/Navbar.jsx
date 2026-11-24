import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router'
import { useAuth } from '../../Contexts/AuthContext'
import Logo from '../Logo/Logo'
import { FaListCheck, FaFolder, FaHouse, FaRightFromBracket, FaBars, FaXmark } from 'react-icons/fa6'
import './Navbar.css'

export default function Navbar() {
    const { user, logout } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    const initial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'

    return (
        <header className="navbar">
            <div className="container">
                <div className="navbar-inner">
                    <Link to="/home" className="navbar-brand">
                        <Logo size={28} textSize={20} />
                    </Link>

                    <nav className="navbar-links">
                        <NavLink to="/home" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                            <FaHouse /> Inicio
                        </NavLink>
                        <NavLink to="/projects" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                            <FaFolder /> Proyectos
                        </NavLink>
                        <NavLink to="/tasks" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                            <FaListCheck /> Tareas
                        </NavLink>
                    </nav>

                    <div className="navbar-user">
                        <div className="user-badge" title={user?.email}>
                            <span className="user-avatar">{initial}</span>
                            <span>{user?.nombre || 'Usuario'}</span>
                        </div>
                        <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
                            <FaRightFromBracket /> Salir
                        </button>
                    </div>

                    <button
                        className="mobile-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Alternar menú móvil"
                    >
                        {mobileOpen ? <FaXmark /> : <FaBars />}
                    </button>
                </div>

                {mobileOpen && (
                    <div className="mobile-menu">
                        <NavLink
                            to="/home"
                            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <FaHouse /> Inicio
                        </NavLink>
                        <NavLink
                            to="/projects"
                            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <FaFolder /> Proyectos
                        </NavLink>
                        <NavLink
                            to="/tasks"
                            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <FaListCheck /> Tareas
                        </NavLink>
                        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
                            <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                Conectado como: <strong>{user?.nombre}</strong> ({user?.email})
                            </div>
                            <button className="btn-logout" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
                                <FaRightFromBracket /> Cerrar sesión
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
