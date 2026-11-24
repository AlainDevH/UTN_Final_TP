import React, { useEffect, useState } from 'react'
import {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject
} from '../../services/projectService'
import ProjectCard from '../../Components/ProjectCard/ProjectCard'
import Modal from '../../Components/Modal/Modal'
import TextField from '../../Components/Form/TextField'
import TextArea from '../../Components/Form/TextArea'
import SelectField from '../../Components/Form/SelectField'
import FormButton from '../../Components/Form/FormButton'
import Alert from '../../Components/Alert/Alert'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { FaPlus, FaMagnifyingGlass } from 'react-icons/fa6'
import './ProjectsScreen.css'

const PRESET_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function ProjectsScreen() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingProject, setEditingProject] = useState(null)

    const { formState, handleChangeInput, setFieldValue, resetForm, setFormState } = useForm({
        nombre: '',
        descripcion: '',
        color: '#4f46e5',
        estado: 'activo'
    })

    const { loading: submitting, error: submitError, sendRequest, setError } = useRequest()

    async function loadProjects() {
        try {
            setLoading(true)
            const res = await getAllProjects()
            setProjects(res.data.projects || [])
        } catch (err) {
            console.error('[ProjectsScreen] Error cargando proyectos:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProjects()
    }, [])

    function handleOpenCreate() {
        setEditingProject(null)
        resetForm()
        setError(null)
        setModalOpen(true)
    }

    function handleOpenEdit(project) {
        setEditingProject(project)
        setFormState({
            nombre: project.nombre,
            descripcion: project.descripcion || '',
            color: project.color || '#4f46e5',
            estado: project.estado || 'activo'
        })
        setError(null)
        setModalOpen(true)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if (editingProject) {
                const res = await sendRequest(() => updateProject(editingProject._id, formState))
                setProjects((prev) =>
                    prev.map((p) => (p._id === editingProject._id ? { ...p, ...res.data.project } : p))
                )
            } else {
                const res = await sendRequest(() => createProject(formState))
                setProjects((prev) => [res.data.project, ...prev])
            }
            setModalOpen(false)
        } catch (err) {
            // Manejado por useRequest
        }
    }

    async function handleDelete(project) {
        if (window.confirm(`¿Estás seguro de eliminar el proyecto "${project.nombre}"? Esto eliminará también todas sus tareas asociadas.`)) {
            try {
                await deleteProject(project._id)
                setProjects((prev) => prev.filter((p) => p._id !== project._id))
            } catch (err) {
                alert(`Error al eliminar: ${err.message}`)
            }
        }
    }

    const filteredProjects = projects.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Proyectos</h1>
                    <p className="page-subtitle">Gestiona tus áreas de trabajo y categoriza tus tareas.</p>
                </div>
                <button className="btn-primary" onClick={handleOpenCreate}>
                    <FaPlus /> Nuevo Proyecto
                </button>
            </div>

            <div className="filter-bar">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Buscar proyectos por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Mostrando {filteredProjects.length} de {projects.length} proyectos
                </span>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                    Cargando proyectos...
                </div>
            ) : filteredProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>
                        {search ? 'No se encontraron proyectos con ese término' : 'Aún no creaste ningún proyecto'}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        Crea un proyecto para empezar a asignarle tareas.
                    </p>
                    <button className="btn-primary" onClick={handleOpenCreate}>
                        <FaPlus /> Crear mi primer proyecto
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onEdit={handleOpenEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal para Crear / Editar Proyecto */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            >
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre del proyecto"
                        name="nombre"
                        value={formState.nombre}
                        onChange={handleChangeInput}
                        placeholder="Ej. Rediseño Web, Campaña Marketing..."
                        required
                    />

                    <TextArea
                        label="Descripción"
                        name="descripcion"
                        value={formState.descripcion}
                        onChange={handleChangeInput}
                        placeholder="Breve detalle del objetivo del proyecto..."
                        rows={3}
                        maxLength={500}
                    />

                    <div className="form-group">
                        <label className="form-label">Color distintivo</label>
                        <div className="color-picker-group">
                            {PRESET_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`color-option ${formState.color === c ? 'selected' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setFieldValue('color', c)}
                                    aria-label={`Seleccionar color ${c}`}
                                />
                            ))}
                        </div>
                    </div>

                    <SelectField
                        label="Estado"
                        name="estado"
                        value={formState.estado}
                        onChange={handleChangeInput}
                        options={[
                            { value: 'activo', label: 'Activo' },
                            { value: 'archivado', label: 'Archivado' },
                            { value: 'completado', label: 'Completado' }
                        ]}
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
                            {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
                        </FormButton>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
