import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../Contexts/AuthContext'
import { getAllProjects } from '../../services/projectService'
import { getAllTasks, updateTask } from '../../services/taskService'
import ProjectCard from '../../Components/ProjectCard/ProjectCard'
import TaskCard from '../../Components/TaskCard/TaskCard'
import { FaFolder, FaListCheck, FaClock, FaCircleCheck, FaPlus } from 'react-icons/fa6'
import './HomeScreen.css'

export default function HomeScreen() {
    const { user } = useAuth()
    const [projects, setProjects] = useState([])
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    async function loadData() {
        try {
            setLoading(true)
            const [projRes, taskRes] = await Promise.all([
                getAllProjects(),
                getAllTasks()
            ])
            setProjects(projRes.data.projects || [])
            setTasks(taskRes.data.tasks || [])
        } catch (error) {
            console.error('[HomeScreen] Error cargando dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    async function handleQuickStatusChange(taskId, newStatus) {
        try {
            await updateTask(taskId, { estado: newStatus })
            setTasks((prev) =>
                prev.map((t) => (t._id === taskId ? { ...t, estado: newStatus } : t))
            )
        } catch (error) {
            console.error('[HomeScreen] Error actualizando tarea:', error)
        }
    }

    const totalProjects = projects.length
    const totalTasks = tasks.length
    const inProgressTasks = tasks.filter((t) => t.estado === 'en_progreso').length
    const completedTasks = tasks.filter((t) => t.estado === 'completada').length

    return (
        <div className="container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">¡Hola, {user?.nombre || 'Usuario'}! 👋</h1>
                    <p className="page-subtitle">Aquí tienes el resumen de tus proyectos y tareas pendientes.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/projects" className="btn-secondary">
                        <FaFolder /> Ver Proyectos
                    </Link>
                    <Link to="/tasks" className="btn-primary">
                        <FaPlus /> Gestionar Tareas
                    </Link>
                </div>
            </div>

            {/* Tarjetas de Métricas */}
            <div className="dashboard-metrics">
                <div className="metric-card">
                    <div className="metric-icon-box" style={{ backgroundColor: 'rgba(139, 92, 246, 0.16)', color: '#c084fc' }}>
                        <FaFolder />
                    </div>
                    <div>
                        <div className="metric-value">{totalProjects}</div>
                        <div className="metric-title">Proyectos Activos</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon-box" style={{ backgroundColor: 'rgba(148, 163, 184, 0.14)', color: '#cbd5e1' }}>
                        <FaListCheck />
                    </div>
                    <div>
                        <div className="metric-value">{totalTasks}</div>
                        <div className="metric-title">Total de Tareas</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon-box" style={{ backgroundColor: 'rgba(14, 165, 233, 0.16)', color: '#38bdf8' }}>
                        <FaClock />
                    </div>
                    <div>
                        <div className="metric-value">{inProgressTasks}</div>
                        <div className="metric-title">En Progreso</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon-box" style={{ backgroundColor: 'rgba(16, 185, 129, 0.16)', color: '#34d399' }}>
                        <FaCircleCheck />
                    </div>
                    <div>
                        <div className="metric-value">{completedTasks}</div>
                        <div className="metric-title">Completadas</div>
                    </div>
                </div>
            </div>

            {/* Grilla con Proyectos Recientes y Tareas Pendientes */}
            <div className="dashboard-sections-grid">
                {/* Proyectos Recientes */}
                <div className="dashboard-section">
                    <div className="section-top">
                        <h2 className="section-heading">Proyectos Recientes</h2>
                        <Link to="/projects" style={{ fontSize: '13px', fontWeight: '600' }}>
                            Ver todos ({projects.length}) →
                        </Link>
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cargando proyectos...</p>
                    ) : projects.length === 0 ? (
                        <div className="empty-state">
                            <p>Aún no has creado ningún proyecto.</p>
                            <Link to="/projects" className="btn-primary" style={{ marginTop: '12px' }}>
                                Crear mi primer proyecto
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {projects.slice(0, 3).map((p) => (
                                <ProjectCard
                                    key={p._id}
                                    project={p}
                                    onEdit={() => {}}
                                    onDelete={() => {}}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Tareas Pendientes o En Progreso */}
                <div className="dashboard-section">
                    <div className="section-top">
                        <h2 className="section-heading">Tareas Pendientes</h2>
                        <Link to="/tasks" style={{ fontSize: '13px', fontWeight: '600' }}>
                            Ver todas ({tasks.length}) →
                        </Link>
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cargando tareas...</p>
                    ) : tasks.filter((t) => t.estado !== 'completada').length === 0 ? (
                        <div className="empty-state">
                            <p>¡No tienes tareas pendientes! Estás al día.</p>
                            <Link to="/tasks" className="btn-primary" style={{ marginTop: '12px' }}>
                                Crear nueva tarea
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {tasks
                                .filter((t) => t.estado !== 'completada')
                                .slice(0, 4)
                                .map((t) => (
                                    <TaskCard
                                        key={t._id}
                                        task={t}
                                        onStatusChange={handleQuickStatusChange}
                                        onEdit={() => {}}
                                        onDelete={() => {}}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
