import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { getTaskById, updateTask, deleteTask } from '../../services/taskService'
import { getAllProjects } from '../../services/projectService'
import Modal from '../../Components/Modal/Modal'
import TextField from '../../Components/Form/TextField'
import TextArea from '../../Components/Form/TextArea'
import SelectField from '../../Components/Form/SelectField'
import FormButton from '../../Components/Form/FormButton'
import Alert from '../../Components/Alert/Alert'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { FaArrowLeft, FaPen, FaTrash, FaCalendarDays, FaFolder } from 'react-icons/fa6'
import './TaskDetailScreen.css'

export default function TaskDetailScreen() {
    const { task_id } = useParams()
    const navigate = useNavigate()
    const [task, setTask] = useState(null)
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    const { formState, handleChangeInput, setFormState } = useForm({
        titulo: '',
        descripcion: '',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_limite: '',
        fk_id_proyecto: ''
    })

    const { loading: submitting, error: submitError, sendRequest, setError } = useRequest()

    async function loadTaskData() {
        try {
            setLoading(true)
            const [taskRes, projRes] = await Promise.all([
                getTaskById(task_id),
                getAllProjects()
            ])
            setTask(taskRes.data.task)
            setProjects(projRes.data.projects || [])
        } catch (err) {
            console.error('[TaskDetailScreen] Error cargando tarea:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTaskData()
    }, [task_id])

    function handleOpenEdit() {
        if (!task) return
        setFormState({
            titulo: task.titulo,
            descripcion: task.descripcion || '',
            estado: task.estado || 'pendiente',
            prioridad: task.prioridad || 'media',
            fecha_limite: task.fecha_limite ? task.fecha_limite.split('T')[0] : '',
            fk_id_proyecto: task.fk_id_proyecto?._id || task.fk_id_proyecto || ''
        })
        setError(null)
        setModalOpen(true)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await sendRequest(() => updateTask(task_id, formState))
            setTask(res.data.task)
            setModalOpen(false)
        } catch (err) {
            // Manejado por useRequest
        }
    }

    async function handleStatusChange(newStatus) {
        try {
            const res = await updateTask(task_id, { estado: newStatus })
            setTask(res.data.task)
        } catch (err) {
            alert(`Error al cambiar estado: ${err.message}`)
        }
    }

    async function handleDelete() {
        if (window.confirm(`¿Estás seguro de eliminar la tarea "${task.titulo}"?`)) {
            try {
                await deleteTask(task_id)
                navigate('/tasks')
            } catch (err) {
                alert(`Error al eliminar tarea: ${err.message}`)
            }
        }
    }

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
                Cargando detalle de la tarea...
            </div>
        )
    }

    if (!task) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
                <h2>Tarea no encontrada</h2>
                <Link to="/tasks" className="btn-primary" style={{ marginTop: '16px' }}>
                    Volver a tareas
                </Link>
            </div>
        )
    }

    const project = task.fk_id_proyecto || {}

    function formatDate(dateStr) {
        if (!dateStr) return 'No definida'
        return new Date(dateStr).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const projectOptions = projects.map((p) => ({
        value: p._id,
        label: p.nombre
    }))

    return (
        <div className="container">
            <Link to="/tasks" className="btn-secondary" style={{ display: 'inline-flex', marginBottom: '20px' }}>
                <FaArrowLeft /> Volver al listado
            </Link>

            <div className="task-detail-card">
                <div className="task-detail-header">
                    <div>
                        <h1 className="task-detail-title">{task.titulo}</h1>
                        <div className="task-detail-meta">
                            {project._id && (
                                <Link
                                    to={`/projects/${project._id}`}
                                    className="task-project-pill"
                                    style={{ fontSize: '13px', padding: '4px 10px' }}
                                >
                                    <span className="project-color-dot" style={{ backgroundColor: project.color || '#4f46e5' }} />
                                    <FaFolder style={{ fontSize: '12px' }} />
                                    {project.nombre}
                                </Link>
                            )}

                            <span className={`badge badge-prioridad-${task.prioridad}`}>
                                Prioridad: {task.prioridad}
                            </span>

                            <span className={`badge badge-${task.estado}`}>
                                {task.estado.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" onClick={handleOpenEdit}>
                            <FaPen /> Editar
                        </button>
                        <button className="btn-danger" onClick={handleDelete}>
                            <FaTrash /> Eliminar
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Cambiar estado rápidamente:</span>
                    <select
                        className="form-select"
                        style={{ width: 'auto', padding: '6px 12px' }}
                        value={task.estado}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_progreso">En progreso</option>
                        <option value="completada">Completada</option>
                    </select>
                </div>

                <div className="task-detail-body">
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                        Descripción
                    </h3>
                    {task.descripcion ? task.descripcion : <em>Sin descripción detallada.</em>}
                </div>

                <div className="task-detail-footer">
                    <div>
                        <strong>Fecha de vencimiento:</strong>{' '}
                        <span>
                            {task.fecha_limite ? formatDate(task.fecha_limite) : 'Sin fecha límite asignada'}
                        </span>
                    </div>
                    <div>
                        <strong>Fecha de creación:</strong> {formatDate(task.fecha_creacion)}
                    </div>
                </div>
            </div>

            {/* Modal para Editar Tarea */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Editar Tarea"
            >
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Título"
                        name="titulo"
                        value={formState.titulo}
                        onChange={handleChangeInput}
                        required
                    />

                    <SelectField
                        label="Proyecto"
                        name="fk_id_proyecto"
                        value={formState.fk_id_proyecto}
                        onChange={handleChangeInput}
                        options={projectOptions}
                        required
                    />

                    <TextArea
                        label="Descripción"
                        name="descripcion"
                        value={formState.descripcion}
                        onChange={handleChangeInput}
                        rows={4}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <SelectField
                            label="Estado"
                            name="estado"
                            value={formState.estado}
                            onChange={handleChangeInput}
                            options={[
                                { value: 'pendiente', label: 'Pendiente' },
                                { value: 'en_progreso', label: 'En progreso' },
                                { value: 'completada', label: 'Completada' }
                            ]}
                        />

                        <SelectField
                            label="Prioridad"
                            name="prioridad"
                            value={formState.prioridad}
                            onChange={handleChangeInput}
                            options={[
                                { value: 'baja', label: 'Baja' },
                                { value: 'media', label: 'Media' },
                                { value: 'alta', label: 'Alta' },
                                { value: 'urgente', label: 'Urgente' }
                            ]}
                        />
                    </div>

                    <TextField
                        label="Fecha límite"
                        name="fecha_limite"
                        type="date"
                        value={formState.fecha_limite}
                        onChange={handleChangeInput}
                    />

                    {submitError && <Alert type="error">{submitError}</Alert>}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>
                            Cancelar
                        </button>
                        <FormButton loading={submitting} loadingText="Guardando..." style={{ flex: 1 }}>
                            Guardar Cambios
                        </FormButton>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
