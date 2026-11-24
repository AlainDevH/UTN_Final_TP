import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { getProjectById, updateProject, deleteProject } from '../../services/projectService'
import { createTask, updateTask, deleteTask } from '../../services/taskService'
import TaskCard from '../../Components/TaskCard/TaskCard'
import Modal from '../../Components/Modal/Modal'
import TextField from '../../Components/Form/TextField'
import TextArea from '../../Components/Form/TextArea'
import SelectField from '../../Components/Form/SelectField'
import FormButton from '../../Components/Form/FormButton'
import Alert from '../../Components/Alert/Alert'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { FaArrowLeft, FaPen, FaTrash, FaPlus, FaCalendarDays } from 'react-icons/fa6'
import './ProjectDetailScreen.css'

export default function ProjectDetailScreen() {
    const { project_id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    // Modal para editar proyecto
    const [editProjectModalOpen, setEditProjectModalOpen] = useState(false)
    const { formState: projForm, handleChangeInput: handleProjChange, setFormState: setProjForm } = useForm({
        nombre: '',
        descripcion: '',
        color: '#4f46e5',
        estado: 'activo'
    })

    // Modal para crear tarea en este proyecto
    const [taskModalOpen, setTaskModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const { formState: taskForm, handleChangeInput: handleTaskChange, setFormState: setTaskForm, resetForm: resetTaskForm } = useForm({
        titulo: '',
        descripcion: '',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_limite: ''
    })

    const { loading: submitting, error: submitError, sendRequest, setError } = useRequest()

    async function loadProject() {
        try {
            setLoading(true)
            const res = await getProjectById(project_id)
            setProject(res.data.project)
            setTasks(res.data.tasks || [])
        } catch (err) {
            console.error('[ProjectDetailScreen] Error cargando proyecto:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProject()
    }, [project_id])

    function handleOpenEditProject() {
        if (!project) return
        setProjForm({
            nombre: project.nombre,
            descripcion: project.descripcion || '',
            color: project.color || '#4f46e5',
            estado: project.estado || 'activo'
        })
        setError(null)
        setEditProjectModalOpen(true)
    }

    async function handleUpdateProjectSubmit(e) {
        e.preventDefault()
        try {
            const res = await sendRequest(() => updateProject(project_id, projForm))
            setProject(res.data.project)
            setEditProjectModalOpen(false)
        } catch (err) {
            // Manejado por useRequest
        }
    }

    async function handleDeleteProject() {
        if (window.confirm('¿Seguro que deseas eliminar este proyecto y TODAS sus tareas asociadas?')) {
            try {
                await deleteProject(project_id)
                navigate('/projects')
            } catch (err) {
                alert(`Error al eliminar proyecto: ${err.message}`)
            }
        }
    }

    // Manejadores de Tareas dentro del proyecto
    function handleOpenCreateTask() {
        setEditingTask(null)
        resetTaskForm()
        setError(null)
        setTaskModalOpen(true)
    }

    function handleOpenEditTask(task) {
        setEditingTask(task)
        setTaskForm({
            titulo: task.titulo,
            descripcion: task.descripcion || '',
            estado: task.estado || 'pendiente',
            prioridad: task.prioridad || 'media',
            fecha_limite: task.fecha_limite ? task.fecha_limite.split('T')[0] : ''
        })
        setError(null)
        setTaskModalOpen(true)
    }

    async function handleTaskSubmit(e) {
        e.preventDefault()
        try {
            if (editingTask) {
                const res = await sendRequest(() => updateTask(editingTask._id, taskForm))
                setTasks((prev) =>
                    prev.map((t) => (t._id === editingTask._id ? res.data.task : t))
                )
            } else {
                const res = await sendRequest(() =>
                    createTask({ ...taskForm, fk_id_proyecto: project_id })
                )
                setTasks((prev) => [res.data.task, ...prev])
            }
            setTaskModalOpen(false)
        } catch (err) {
            // Manejado por useRequest
        }
    }

    async function handleQuickStatusChange(taskId, newStatus) {
        try {
            await updateTask(taskId, { estado: newStatus })
            setTasks((prev) =>
                prev.map((t) => (t._id === taskId ? { ...t, estado: newStatus } : t))
            )
        } catch (err) {
            console.error('Error al actualizar estado:', err)
        }
    }

    async function handleDeleteTask(task) {
        if (window.confirm(`¿Eliminar la tarea "${task.titulo}"?`)) {
            try {
                await deleteTask(task._id)
                setTasks((prev) => prev.filter((t) => t._id !== task._id))
            } catch (err) {
                alert(`Error al eliminar tarea: ${err.message}`)
            }
        }
    }

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
                Cargando detalle del proyecto...
            </div>
        )
    }

    if (!project) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
                <h2>Proyecto no encontrado</h2>
                <Link to="/projects" className="btn-primary" style={{ marginTop: '16px' }}>
                    Volver a proyectos
                </Link>
            </div>
        )
    }

    const total = tasks.length
    const completed = tasks.filter((t) => t.estado === 'completada').length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return (
        <div className="container">
            <Link to="/projects" className="btn-secondary" style={{ display: 'inline-flex', marginBottom: '20px' }}>
                <FaArrowLeft /> Volver a proyectos
            </Link>

            {/* Cabecera / Hero del Proyecto */}
            <div className="project-hero">
                <div className="project-hero-accent" style={{ backgroundColor: project.color || '#4f46e5' }} />

                <div className="project-hero-header">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <h1 className="project-hero-title">{project.nombre}</h1>
                            <span className={`badge badge-${project.estado}`}>
                                {project.estado}
                            </span>
                        </div>
                        <p className="project-hero-desc">
                            {project.descripcion || 'Sin descripción detallada.'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" onClick={handleOpenEditProject}>
                            <FaPen /> Editar
                        </button>
                        <button className="btn-danger" onClick={handleDeleteProject}>
                            <FaTrash /> Eliminar
                        </button>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div style={{ maxWidth: '400px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        <span>Progreso de tareas</span>
                        <span>{completed}/{total} completadas ({percentage}%)</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '8px' }}>
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${percentage}%`, backgroundColor: project.color || '#4f46e5' }}
                        />
                    </div>
                </div>
            </div>

            {/* Sección de Tareas asociadas */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Tareas del Proyecto</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Listado de tareas asignadas exclusivamente a este proyecto ({tasks.length}).
                    </p>
                </div>
                <button className="btn-primary" onClick={handleOpenCreateTask}>
                    <FaPlus /> Añadir Tarea
                </button>
            </div>

            {tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Este proyecto aún no tiene ninguna tarea asociada.
                    </p>
                    <button className="btn-primary" onClick={handleOpenCreateTask}>
                        <FaPlus /> Crear primera tarea
                    </button>
                </div>
            ) : (
                <div className="project-tasks-grid">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={{ ...task, fk_id_proyecto: project }}
                            onStatusChange={handleQuickStatusChange}
                            onEdit={handleOpenEditTask}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                </div>
            )}

            {/* Modal para Editar Proyecto */}
            <Modal
                isOpen={editProjectModalOpen}
                onClose={() => setEditProjectModalOpen(false)}
                title="Editar Proyecto"
            >
                <form onSubmit={handleUpdateProjectSubmit}>
                    <TextField
                        label="Nombre del proyecto"
                        name="nombre"
                        value={projForm.nombre}
                        onChange={handleProjChange}
                        required
                    />
                    <TextArea
                        label="Descripción"
                        name="descripcion"
                        value={projForm.descripcion}
                        onChange={handleProjChange}
                        rows={3}
                    />
                    <SelectField
                        label="Estado"
                        name="estado"
                        value={projForm.estado}
                        onChange={handleProjChange}
                        options={[
                            { value: 'activo', label: 'Activo' },
                            { value: 'archivado', label: 'Archivado' },
                            { value: 'completado', label: 'Completado' }
                        ]}
                    />
                    {submitError && <Alert type="error">{submitError}</Alert>}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditProjectModalOpen(false)}>
                            Cancelar
                        </button>
                        <FormButton loading={submitting} loadingText="Guardando..." style={{ flex: 1 }}>
                            Guardar Cambios
                        </FormButton>
                    </div>
                </form>
            </Modal>

            {/* Modal para Crear / Editar Tarea */}
            <Modal
                isOpen={taskModalOpen}
                onClose={() => setTaskModalOpen(false)}
                title={editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
            >
                <form onSubmit={handleTaskSubmit}>
                    <TextField
                        label="Título de la tarea"
                        name="titulo"
                        value={taskForm.titulo}
                        onChange={handleTaskChange}
                        placeholder="Ej. Redactar documentación técnica"
                        required
                    />
                    <TextArea
                        label="Descripción"
                        name="descripcion"
                        value={taskForm.descripcion}
                        onChange={handleTaskChange}
                        placeholder="Detalles sobre lo que se debe hacer..."
                        rows={3}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <SelectField
                            label="Estado"
                            name="estado"
                            value={taskForm.estado}
                            onChange={handleTaskChange}
                            options={[
                                { value: 'pendiente', label: 'Pendiente' },
                                { value: 'en_progreso', label: 'En progreso' },
                                { value: 'completada', label: 'Completada' }
                            ]}
                        />
                        <SelectField
                            label="Prioridad"
                            name="prioridad"
                            value={taskForm.prioridad}
                            onChange={handleTaskChange}
                            options={[
                                { value: 'baja', label: 'Baja' },
                                { value: 'media', label: 'Media' },
                                { value: 'alta', label: 'Alta' },
                                { value: 'urgente', label: 'Urgente' }
                            ]}
                        />
                    </div>
                    <TextField
                        label="Fecha límite (opcional)"
                        name="fecha_limite"
                        type="date"
                        value={taskForm.fecha_limite}
                        onChange={handleTaskChange}
                    />
                    {submitError && <Alert type="error">{submitError}</Alert>}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setTaskModalOpen(false)}>
                            Cancelar
                        </button>
                        <FormButton loading={submitting} loadingText="Guardando..." style={{ flex: 1 }}>
                            {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
                        </FormButton>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
