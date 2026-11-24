# CheckWork Web — Frontend (React + Vite)

> Aplicación web frontend moderna desarrollada en **React 19** y compilada con **Vite**
> Diseñada para consumir la API REST de CheckWork, implementando navegación con React Router, rutas protegidas mediante JWT, diseño responsivo estricto (desde 320px hasta 2000px) y CRUD completo de Proyectos y Tareas.

---

## 1. Stack Tecnológico

| Componente | Tecnología |
|---|---|
| **Librería UI** | React 19 (`react`, `react-dom`) |
| **Tooling / Bundler** | Vite 6 |
| **Enrutador** | React Router v7 |
| **Iconos** | `react-icons` (FontAwesome 6) |
| **Estilos** | CSS Puro con CSS Variables (sin frameworks pesados, garantizando fidelidad de diseño) |
| **Despliegue** | `vercel.json` configurado para SPA (Single Page Application) |

---

## 2. Estructura del Código

```
Frontend/
├── public/
│   └── favicon.svg                    → Isotipo de la app
├── src/
│   ├── Components/
│   │   ├── Alert/                     → Mensajes de éxito, error e info
│   │   ├── Form/                      → Inputs, TextAreas, Selects y FormButton con spinners
│   │   ├── Modal/                     → Ventana modal accesible para altas y modificaciones
│   │   ├── Navbar/                    → Barra de navegación responsiva (con menú móvil)
│   │   ├── ProjectCard/               → Tarjeta de proyecto con barra de progreso
│   │   └── TaskCard/                  → Tarjeta de tarea con selector rápido de estado
│   ├── Contexts/
│   │   └── AuthContext.jsx            → Estado global de sesión, token y usuario
│   ├── hooks/
│   │   ├── useForm.jsx                → Manejo dinámico de campos de formularios
│   │   └── useRequest.jsx             → Máquina de estados para peticiones asíncronas
│   ├── Middlewares/
│   │   └── AuthMiddleware.jsx         → Guardián de rutas protegidas (<Navigate to="/login" />)
│   ├── screens/
│   │   ├── HomeScreen/                → Dashboard con métricas, accesos rápidos y resúmenes
│   │   ├── LoginScreen/               → Inicio de sesión con almacenamiento en LocalStorage
│   │   ├── RegisterScreen/            → Registro de usuario con aviso de activación por correo
│   │   ├── VerifyEmailScreen/         → Confirmación de cuenta mediante token en query string
│   │   ├── ResendVerificationScreen/  → Solicitud de reenvío de activación
│   │   ├── ForgotPasswordScreen/      → Solicitud de correo de restablecimiento
│   │   ├── ResetPasswordScreen/       → Definición de nueva contraseña con confirmación
│   │   ├── ProjectsScreen/            → Listado y CRUD de proyectos (Entidad Relacionada)
│   │   ├── ProjectDetailScreen/       → Detalle del proyecto y listado de sus tareas
│   │   ├── TasksScreen/               → Listado y CRUD de tareas con filtros avanzados
│   │   └── TaskDetailScreen/          → Detalle completo de una tarea individual
│   ├── services/
│   │   ├── authService.js             → Peticiones HTTP del módulo de autenticación
│   │   ├── projectService.js          → Peticiones HTTP del módulo de proyectos
│   │   └── taskService.js             → Peticiones HTTP del módulo de tareas
│   ├── App.jsx                        → Definición de rutas públicas y privadas
│   ├── globals.css                    → Variables de diseño, reset y utilidades responsivas
│   └── main.jsx                       → Punto de montaje en el DOM
├── .env
├── .gitignore
├── index.html
├── package.json
├── vercel.json
├── vite.config.js
└── README.md
```

---

## 3. Pantallas y Vistas Implementadas

### Públicas
* **`/login`:** Inicio de sesión con validación y redirección automática.
* **`/register`:** Alta de usuario con aviso para revisar el correo.
* **`/verify-email?token=...`:** Activación de cuenta a través del link enviado al correo.
* **`/resend-verification`:** Formulario para reenviar el mail de activación.
* **`/forgot-password`:** Solicitud de enlace para recuperar la cuenta.
* **`/reset-password?token=...`:** Formulario de cambio de contraseña con validación de coincidencia.

### Protegidas (Requieren Login)
* **`/` y `/home`:** Dashboard principal con métricas (total proyectos, total tareas, pendientes, completadas).
* **`/projects`:** Listado de proyectos con buscador, botón de creación, edición y eliminación.
* **`/projects/:project_id`:** Vista de detalle del proyecto con barra de progreso y sus tareas asignadas.
* **`/tasks`:** Listado de tareas con filtros por pestañas de estado (`Pendientes`, `En Progreso`, `Completadas`), dropdown de proyecto, selector de prioridad y buscador textual.
* **`/tasks/:task_id`:** Vista de detalle de una tarea individual con selector de estado rápido y acciones de edición/borrado.

---

## 4. Adaptabilidad Responsiva (320px a 2000px)

* **Mobile First (320px - 640px):** Menú hamburguesa desplegable, grillas de una columna, botones táctiles y modales adaptados a pantallas reducidas.
* **Tablets (640px - 1024px):** Grillas de 2 columnas para tarjetas y barra de filtros expandida.
* **Desktop & Pantallas Anchas (1024px - 2000px):** Contenedor centralizado con ancho máximo de 1400px, grilla de 3 y 4 columnas, y navegación completa visible.

---

## 5. Instalación y Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar la variable de entorno en `.env`:
   ```env
   VITE_APP_URL_BACKEND=http://localhost:8080
   ```

3. Iniciar el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```

4. Compilar para producción:
   ```bash
   npm run build
   ```
