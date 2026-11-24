import React, { useEffect, useState } from 'react'
import { getAllTasks, createTask, updateTask, deleteTask } from '../../services/taskService'
import { getAllProjects } from '../../services/projectService'
import TaskCard from '../../Components/TaskCard/TaskCard'
import Modal from '../../Components/Modal/Modal'
import TextField from '../../Components/Form/TextField'
import TextArea from '../../Components/Form/TextArea'
import SelectField from '../../Components/Form/SelectField'
import FormButton from '../../Components/Form/FormButton'
import Alert from '../../Components/Alert/Alert'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { FaPlus, FaMagnifyingGlass } from 'react-icons/fa6'
import './TasksScreen.css'

export default function TasksScreen() {
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    // Filtros
    const [statusFilter, setStatusFilter] = useState('todos')
    const [projectFilter, setProjectFilter] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('')
    const [search, setSearch] = useState('')

    // Modal Crear / Editar
    const [modalOpen, setModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)

    const { formState, handleChangeInput, resetForm, setFormState, setFieldValue } = useForm({
        titulo: '',
        descripcion: '',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_limite: '',
        fk_id_proyecto: ''
    })

    const { loading: submitting, error: submitError, sendRequest, setError } = useRequest()

    async function loadInitialData() {
        try {
            setLoading(true)
            const [taskRes, projRes] = await Promise.all([
                getAllTasks(),
                getAllProjects()
            ])
            setTasks(taskRes.data.tasks || [])
            setProjects(projRes.data.projects || [])
        } catch (err) {
            console.error('[TasksScreen] Error cargando datos:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadInitialData()
    }, [])

    function handleOpenCreate() {
        setEditingTask(null)
        resetForm()
        if (projects.length > 0) {
            setFieldValue('fk_id_proyecto', projects[0]._id)
        }
        setError(null)
        setModalOpen(true)
    }

    function handleOpenEdit(task) {
        setEditingTask(task)
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

        if (!formState.fk_id_proyecto) {
            setError('Debes asociar la tarea a un proyecto')
            return
        }

        try {
            if (editingTask) {
                const res = await sendRequest(() => updateTask(editingTask._id, formState))
                setTasks((prev) =>
                    prev.map((t) => (t._id === editingTask._id ? res.data.task : t))
                )
            } else {
                const res = await sendRequest(() => createTask(formState))
                setTasks((prev) => [res.data.task, ...prev])
            }
            setModalOpen(false)
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

    async function handleDelete(task) {
        if (window.confirm(`¿Estás seguro de eliminar la tarea "${task.titulo}"?`)) {
            try {
                await deleteTask(task._id)
                setTasks((prev) => prev.filter((t) => t._id !== task._id))
            } catch (err) {
                alert(`Error al eliminar: ${err.message}`)
            }
        }
    }

    // Filtrado en el cliente
    const filteredTasks = tasks.filter((t) => {
        const matchesStatus = statusFilter === 'todos' || t.estado === statusFilter
        const matchesProject = !projectFilter || (t.fk_id_proyecto?._id === projectFilter || t.fk_id_proyecto === projectFilter)
        const matchesPriority = !priorityFilter || t.prioridad === priorityFilter
        const matchesSearch =
            !search ||
            t.titulo.toLowerCase().includes(search.toLowerCase()) ||
            (t.descripcion && t.descripcion.toLowerCase().includes(search.toLowerCase()))

        return matchesStatus && matchesProject && matchesPriority && matchesSearch
    })

    const projectSelectOptions = projects.map((p) => ({
        value: p._id,
        label: p.nombre
    }))

    return (
        <div className="container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Gestión de Tareas</h1>
                    <p className="page-subtitle">Visualiza, filtra y organiza el trabajo de todos tus proyectos.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleOpenCreate}
                    disabled={projects.length === 0}
                    title={projects.length === 0 ? 'Debes crear un proyecto antes de añadir tareas' : ''}
                >
                    <FaPlus /> Nueva Tarea
                </button>
            </div>

            {projects.length === 0 && !loading && (
                <Alert type="info">
                    Para crear tareas, primero necesitas tener al menos un proyecto.{' '}
                    <a href="/projects">Crear un proyecto ahora</a>.
                </Alert>
            )}

            {/* Contenedor de Filtros */}
            <div className="tasks-filter-container">
                <div className="status-tabs">
                    <button
                        className={`status-tab ${statusFilter === 'todos' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('todos')}
                    >
                        Todas ({tasks.length})
                    </button>
                    <button
                        className={`status-tab ${statusFilter === 'pendiente' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('pendiente')}
                    >
                        Pendientes ({tasks.filter((t) => t.estado === 'pendiente').length})
                    </button>
                    <button
                        className={`status-tab ${statusFilter === 'en_progreso' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('en_progreso')}
                    >
                        En Progreso ({tasks.filter((t) => t.estado === 'en_progreso').length})
                    </button>
                    <button
                        className={`status-tab ${statusFilter === 'completada' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('completada')}
                    >
                        Completadas ({tasks.filter((t) => t.estado === 'completada').length})
                    </button>
                </div>

                <div className="tasks-filter-row">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Buscar tareas por título o descripción..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="form-select"
                        value={projectFilter}
                        onChange={(e) => setProjectFilter(e.target.value)}
                    >
                        <option value="">Todos los proyectos</option>
                        {projects.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-select"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">Todas las prioridades</option>
                        <option value="baja">Prioridad Baja</option>
                        <option value="media">Prioridad Media</option>
                        <option value="alta">Prioridad Alta</option>
                        <option value="urgente">Prioridad Urgente</option>
                    </select>
                </div>
            </div>

            {/* Grilla de Tareas */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                    Cargando tareas...
                </div>
            ) : filteredTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>
                        No se encontraron tareas con los filtros seleccionados
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        {projects.length > 0
                            ? 'Prueba modificando tus términos de búsqueda o crea una nueva tarea.'
                            : 'Crea tu primer proyecto para empezar a agregar tareas.'}
                    </p>
                    {projects.length > 0 && (
                        <button className="btn-primary" onClick={handleOpenCreate}>
                            <FaPlus /> Crear nueva tarea
                        </button>
                    )}
                </div>
            ) : (
                <div className="tasks-grid">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onStatusChange={handleQuickStatusChange}
                            onEdit={handleOpenEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal para Crear / Editar Tarea */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
            >
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Título de la tarea"
                        name="titulo"
                        value={formState.titulo}
                        onChange={handleChangeInput}
                        placeholder="Ej. Realizar pruebas unitarias"
                        required
                    />

                    <SelectField
                        label="Proyecto asignado"
                        name="fk_id_proyecto"
                        value={formState.fk_id_proyecto}
                        onChange={handleChangeInput}
                        options={projectSelectOptions}
                        required
                    />

                    <TextArea
                        label="Descripción detallada"
                        name="descripcion"
                        value={formState.descripcion}
                        onChange={handleChangeInput}
                        placeholder="Escribe detalles, requerimientos o notas..."
                        rows={3}
                        maxLength={1500}
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
                        label="Fecha límite (opcional)"
                        name="fecha_limite"
                        type="date"
                        value={formState.fecha_limite}
                        onChange={handleChangeInput}
                    />

                    {submitError && <Alert type="error">{submitError}</Alert>}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ flex: 1 }}
                            onClick={() => setModalOpen(false)}
                        >
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
