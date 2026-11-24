# CheckWork API — Backend (Node.js + Express + MongoDB)

> Implementa arquitectura en capas, autenticación robusta mediante JWT, verificación por correo electrónico con Nodemailer y CRUD completo sobre Proyectos y Tareas con relaciones modeladas en MongoDB.

---

## 1. Stack Tecnológico

| Componente | Tecnología |
|---|---|
| **Runtime** | Node.js (módulos ES nativos, `"type": "module"`) |
| **Framework HTTP** | Express 5 |
| **Base de Datos** | MongoDB con ODM Mongoose |
| **Autenticación** | JSON Web Tokens (`jsonwebtoken`) formato Bearer |
| **Encriptación** | `bcrypt` (10 rondas de salteo) |
| **Correos Transaccionales** | `nodemailer` (SMTP Gmail) |
| **Documentación** | Swagger UI (`swagger-ui-express`) y especificación OpenAPI 3.1 |
| **Variables de Entorno** | `dotenv` |
| **CORS** | Habilitado para consumo seguro desde el Frontend de React |

---

## 2. Arquitectura del Proyecto (Capas Estrictas)

El código respeta una separación estricta de responsabilidades (`routes` → `controllers` → `services` → `repositories`):

```
Backend/
├── docs/
│   └── Gestor_Tareas_API.postman_collection.json  → Colección Postman para pruebas
├── src/
│   ├── config/
│   │   ├── environment.config.js                  → Carga centralizada de variables .env
│   │   ├── mailer.config.js                       → Transporter de Nodemailer
│   │   └── mongo.config.js                        → Conexión a MongoDB con Mongoose
│   ├── controllers/
│   │   ├── auth.controller.js                     → Manejo de req/res para autenticación
│   │   ├── project.controller.js                  → Manejo de req/res para proyectos
│   │   └── task.controller.js                     → Manejo de req/res para tareas
│   ├── docs/
│   │   └── openapi.config.js                      → Configuración OpenAPI 3.1 y Swagger UI
│   ├── middlewares/
│   │   ├── auth.middleware.js                     → Validación de token JWT Bearer
│   │   ├── error.middleware.js                    → Manejador centralizado de errores
│   │   └── validate.middleware.js                 → Validación de campos requeridos
│   ├── models/
│   │   ├── user.model.js                          → Esquema de Usuario (colección: Usuario)
│   │   ├── project.model.js                       → Esquema de Proyecto (colección: Proyecto)
│   │   └── task.model.js                          → Esquema de Tarea (colección: Tarea)
│   ├── repositories/
│   │   ├── user.repository.js                     → Acceso a datos de usuarios
│   │   ├── project.repository.js                  → Acceso a datos de proyectos
│   │   └── task.repository.js                     → Acceso a datos de tareas con populate
│   ├── routes/
│   │   ├── auth.router.js                         → Rutas públicas y de cuenta
│   │   ├── project.router.js                      → Rutas protegidas de proyectos
│   │   └── task.router.js                         → Rutas protegidas de tareas
│   ├── services/
│   │   ├── auth.services.js                       → Lógica de hashing, tokens y mails
│   │   ├── project.services.js                    → Lógica y cascada de proyectos
│   │   └── task.services.js                       → Lógica de asignación y filtros de tareas
│   ├── utils/
│   │   ├── bcrypt.util.js                         → Utilidades de hashing con bcrypt
│   │   ├── email-templates.js                     → Plantillas HTML para mails
│   │   └── error.util.js                          → Clase ServerError personalizada
│   └── main.js                                    → Entry point del servidor Express
├── .env
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## 3. Modelo de Datos y Relaciones

* **Usuario (`Usuario`):** `nombre`, `email` (único, lowercase), `password` (hasheado), `activo`, `email_verificado`, `fecha_creacion`.
* **Proyecto (`Proyecto` - Entidad Relacionada):** `nombre`, `descripcion`, `color`, `estado` (`activo`, `archivado`, `completado`), `fk_id_usuario` (referencia a Usuario), `fecha_creacion`.
* **Tarea (`Tarea` - Entidad Principal):** `titulo`, `descripcion`, `estado` (`pendiente`, `en_progreso`, `completada`), `prioridad` (`baja`, `media`, `alta`, `urgente`), `fecha_limite`, `fk_id_proyecto` (referencia a Proyecto), `fk_id_usuario` (referencia a Usuario), `fecha_creacion`.

> **Integridad referencial y cascada:** Al eliminar un proyecto, se eliminan automáticamente todas las tareas pertenecientes a dicho proyecto mediante `task_repository.deleteByProjectId`.

---

## 4. Endpoints de la API

Formato de respuesta unificado:
* Éxito: `{ ok: true, status: 200|201, message: "...", data?: {...} }`
* Error: `{ ok: false, status: 400|401|403|404|500, message: "..." }`

### 4.1 Autenticación (`/api/auth`)

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Registra usuario y envía correo con enlace de activación |
| `POST` | `/api/auth/login` | Público | Autentica credenciales y devuelve token JWT Bearer |
| `GET` | `/api/auth/verify-email?token=...` | Público | Activa la cuenta con el token de activación recibido |
| `GET` | `/api/auth/verify-email/:email/resend` | Público | Reenvía el correo de verificación si la cuenta está pendiente |
| `POST` | `/api/auth/forgot-password` | Público | Envía enlace temporal para restablecimiento de contraseña |
| `POST` | `/api/auth/reset-password` | Público | Aplica la nueva contraseña mediante token |
| `GET` | `/api/auth/me` | Protegido (Bearer) | Obtiene los datos del usuario en sesión |

### 4.2 Proyectos (`/api/projects`) — Entidad Relacionada

Todos requieren encabezado `Authorization: Bearer <token>`.

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/projects` | Lista todos los proyectos del usuario con estadísticas de tareas |
| `GET` | `/api/projects/:project_id` | Detalle del proyecto junto con la lista de sus tareas |
| `POST` | `/api/projects` | Crea un nuevo proyecto |
| `PUT` | `/api/projects/:project_id` | Modifica nombre, descripción, color o estado |
| `DELETE` | `/api/projects/:project_id` | Elimina el proyecto y todas sus tareas asociadas |

### 4.3 Tareas (`/api/tasks`) — Entidad Principal

Todos requieren encabezado `Authorization: Bearer <token>`.

| Método | Endpoint | Query Params / Body | Descripción |
|---|---|---|---|
| `GET` | `/api/tasks` | `?project_id=...&estado=...&prioridad=...&busqueda=...` | Lista tareas pobladas (`populate`) con soporte de filtros |
| `GET` | `/api/tasks/:task_id` | Ninguno | Detalle completo de la tarea y proyecto |
| `POST` | `/api/tasks` | `{ titulo, fk_id_proyecto, descripcion?, estado?, prioridad?, fecha_limite? }` | Crea una tarea en un proyecto del usuario |
| `PUT` | `/api/tasks/:task_id` | Campos a modificar | Actualiza estado, prioridad, título, proyecto, etc. |
| `DELETE` | `/api/tasks/:task_id` | Ninguno | Elimina la tarea |

---

## 5. Documentación Interactiva (Swagger UI)

Una vez iniciado el servidor, accede a:
* **UI Interactiva:** [http://localhost:8080/api/docs](http://localhost:8080/api/docs)
* **OpenAPI Spec (JSON):** [http://localhost:8080/api/docs/openapi.json](http://localhost:8080/api/docs/openapi.json)

---

## 6. Instalación y Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Crear el archivo `.env`

3. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```

4. Iniciar en modo producción:
   ```bash
   npm start
   ```
