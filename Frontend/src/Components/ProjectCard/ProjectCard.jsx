import React from 'react'
import { Link } from 'react-router'
import { FaPen, FaTrash, FaFolderOpen } from 'react-icons/fa6'
import './ProjectCard.css'

export default function ProjectCard({ project, onEdit, onDelete }) {
    const total = project.total_tareas || 0
    const completed = project.tareas_completadas || 0
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    const color = project.color || '#4f46e5'

    return (
        <div className="project-card">
            <div className="project-card-top-bar" style={{ backgroundColor: color }} />
            
            <div className="project-card-header">
                <Link to={`/projects/${project._id}`} className="project-title">
                    {project.nombre}
                </Link>
                <span className={`badge badge-${project.estado || 'activo'}`}>
                    {project.estado}
                </span>
            </div>

            <p className="project-description">
                {project.descripcion || 'Sin descripción'}
            </p>

            <div className="project-stats">
                <div className="stats-label">
                    <span>Progreso de tareas</span>
                    <span>{completed}/{total} ({percentage}%)</span>
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                </div>
            </div>

            <div className="project-card-footer">
                <Link to={`/projects/${project._id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    <FaFolderOpen /> Ver detalle
                </Link>

                <div className="card-actions">
                    <button
                        className="btn-icon"
                        onClick={() => onEdit(project)}
                        title="Editar proyecto"
                    >
                        <FaPen />
                    </button>
                    <button
                        className="btn-icon btn-icon-danger"
                        onClick={() => onDelete(project)}
                        title="Eliminar proyecto"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    )
}
