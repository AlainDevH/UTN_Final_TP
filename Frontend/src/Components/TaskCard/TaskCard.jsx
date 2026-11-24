import React from 'react'
import { Link } from 'react-router'
import { FaPen, FaTrash, FaCalendarDays } from 'react-icons/fa6'
import './TaskCard.css'

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
    const project = task.fk_id_proyecto || {}

    function formatDate(dateStr) {
        if (!dateStr) return null
        const d = new Date(dateStr)
        return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
    }

    return (
        <div className="task-card">
            <div className="task-card-header">
                <Link to={`/tasks/${task._id}`} className="task-title">
                    {task.titulo}
                </Link>
                <div className="card-actions">
                    <button
                        className="btn-icon"
                        onClick={() => onEdit(task)}
                        title="Editar tarea"
                    >
                        <FaPen />
                    </button>
                    <button
                        className="btn-icon btn-icon-danger"
                        onClick={() => onDelete(task)}
                        title="Eliminar tarea"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            {task.descripcion && (
                <p className="task-desc">{task.descripcion}</p>
            )}

            <div className="task-card-badges">
                {project.nombre && (
                    <span className="task-project-pill">
                        <span className="project-color-dot" style={{ backgroundColor: project.color || '#4f46e5' }} />
                        {project.nombre}
                    </span>
                )}
                <span className={`badge badge-prioridad-${task.prioridad}`}>
                    {task.prioridad}
                </span>
                <span className={`badge badge-${task.estado}`}>
                    {task.estado.replace('_', ' ')}
                </span>
            </div>

            <div className="task-card-footer">
                <div>
                    {task.fecha_limite ? (
                        <span className="task-due-date">
                            <FaCalendarDays /> Vence: {formatDate(task.fecha_limite)}
                        </span>
                    ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Sin fecha límite</span>
                    )}
                </div>

                {onStatusChange && (
                    <select
                        className="task-quick-status-select"
                        value={task.estado}
                        onChange={(e) => onStatusChange(task._id, e.target.value)}
                        title="Cambiar estado"
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_progreso">En progreso</option>
                        <option value="completada">Completada</option>
                    </select>
                )}
            </div>
        </div>
    )
}
