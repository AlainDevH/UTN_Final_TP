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

### Convenciones generales

* Todas las rutas de la API usan JSON.
* Los endpoints protegidos requieren `Authorization: Bearer <token>`.
* El token JWT se obtiene mediante `POST /api/auth/login` y tiene una duración de 24 horas.
* Respuesta exitosa: `{ ok: true, status: 200|201, message: "...", data?: {...} }`
* Respuesta de error: `{ ok: false, status: 400|401|403|404|500|503, message: "..." }`

### 4.1 Estado y documentación

| Método | Endpoint | Acceso | Finalidad |
|---|---|---|---|
| `GET` | `/` | Público | Comprueba que la API está operativa y devuelve la ubicación de la documentación. |
| `GET` | `/api/docs` | Público | Abre la interfaz interactiva Swagger UI. |
| `GET` | `/api/docs/openapi.json` | Público | Devuelve la especificación OpenAPI 3.1 en formato JSON. |

### 4.2 Autenticación (`/api/auth`)

| Método | Endpoint | Acceso | Body / parámetros | Finalidad |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Público | `{ "nombre": "...", "email": "...", "password": "..." }` | Crea una cuenta pendiente de verificación. Valida el formato del email, exige una contraseña de al menos 6 caracteres y envía un enlace de activación por correo. |
| `POST` | `/api/auth/login` | Público | `{ "email": "...", "password": "..." }` | Valida las credenciales y, si la cuenta está activa y verificada, devuelve el token JWT y los datos básicos del usuario. |
| `GET` | `/api/auth/verify-email?token=...` | Público | Query `token`: token JWT recibido por correo | Verifica el token y marca la cuenta como `email_verificado`. |
| `GET` | `/api/auth/verify-email/:email/resend` | Público | Ruta `email`: dirección de correo | Reenvía el enlace de activación únicamente si la cuenta existe, está activa y aún no está verificada. La respuesta no revela si el usuario existe. |
| `POST` | `/api/auth/forgot-password` | Público | `{ "email": "..." }` | Solicita la recuperación de contraseña y envía un enlace temporal válido por 1 hora si la cuenta existe y está activa. La respuesta no revela si el usuario existe. |
| `POST` | `/api/auth/reset-password` | Público | `{ "token": "...", "password": "..." }` | Valida el token de recuperación y reemplaza la contraseña por una nueva de al menos 6 caracteres. |
| `GET` | `/api/auth/me` | Protegido | Sin body | Devuelve el perfil del usuario autenticado: identificador, nombre, email y fecha de creación. |

Campos de registro: `nombre` debe ser texto, `email` debe tener formato válido y `password` debe tener como mínimo 6 caracteres.

### 4.3 Proyectos (`/api/projects`) — Entidad Relacionada

Todos los endpoints requieren `Authorization: Bearer <token>`. Cada operación sólo puede acceder a proyectos propiedad del usuario autenticado.

| Método | Endpoint | Body / parámetros | Finalidad |
|---|---|---|---|
| `GET` | `/api/projects` | Ninguno | Lista los proyectos del usuario y agrega a cada uno el total de tareas y la cantidad de tareas completadas. |
| `GET` | `/api/projects/:project_id` | Ruta `project_id`: ID del proyecto | Obtiene el proyecto y la lista de todas sus tareas pertenecientes al usuario autenticado. |
| `POST` | `/api/projects` | `{ "nombre": "...", "descripcion"?: "...", "color"?: "#4f46e5", "estado"?: "activo" }` | Crea un proyecto. `nombre` es obligatorio (máximo 50 caracteres). Los valores opcionales usan `descripcion = ""`, `color = "#4f46e5"` y `estado = "activo"`. |
| `PUT` | `/api/projects/:project_id` | Ruta `project_id`; body opcional con `nombre`, `descripcion`, `color` o `estado` | Modifica parcialmente los datos permitidos del proyecto. |
| `DELETE` | `/api/projects/:project_id` | Ruta `project_id`: ID del proyecto | Elimina el proyecto y realiza una eliminación en cascada de todas sus tareas asociadas. |

Estados válidos de proyecto: `activo`, `archivado`, `completado`. Máximo de descripción: 500 caracteres.

### 4.4 Tareas (`/api/tasks`) — Entidad Principal

Todos los endpoints requieren `Authorization: Bearer <token>`. Cada operación sólo puede acceder a tareas propiedad del usuario autenticado.

| Método | Endpoint | Query / body / parámetros | Finalidad |
|---|---|---|---|
| `GET` | `/api/tasks` | `?project_id=<id>&estado=<estado>&prioridad=<prioridad>&busqueda=<texto>` | Lista las tareas del usuario, incluyendo los datos básicos del proyecto asociado. Permite filtrar por proyecto, estado, prioridad y coincidencia de texto en título o descripción. |
| `GET` | `/api/tasks/:task_id` | Ruta `task_id`: ID de la tarea | Devuelve el detalle completo de una tarea y los datos de su proyecto asociado. |
| `POST` | `/api/tasks` | `{ "titulo": "...", "fk_id_proyecto": "...", "descripcion"?: "...", "estado"?: "pendiente", "prioridad"?: "media", "fecha_limite"?: "2026-12-31" }` | Crea una tarea dentro de un proyecto propiedad del usuario. `titulo` y `fk_id_proyecto` son obligatorios. |
| `PUT` | `/api/tasks/:task_id` | Ruta `task_id`; body opcional con `titulo`, `descripcion`, `estado`, `prioridad`, `fecha_limite` o `fk_id_proyecto` | Modifica parcialmente una tarea. Permite cambiar sus datos principales o moverla a otro proyecto propiedad del usuario. |
| `DELETE` | `/api/tasks/:task_id` | Ruta `task_id`: ID de la tarea | Elimina una tarea del usuario autenticado. |

Estados válidos de tarea: `pendiente`, `en_progreso`, `completada`.  
Prioridades válidas: `baja`, `media`, `alta`, `urgente`.  
Límite predeterminado: `fecha_limite = null`, `estado = pendiente`, `prioridad = media`.  
Máximo de título: 100 caracteres. Máximo de descripción: 1500 caracteres.

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