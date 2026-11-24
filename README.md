# Trabajo Integrador Final — CheckWork (Full-Stack: React + Express + MongoDB)

> **Cátedra:** Programación Web / PWA — Universidad Tecnológica Nacional (UTN)  
> **Tema / Dominio:** Sistema de Gestión de Tareas y Proyectos (**CheckWork**)  
> **Entidad Principal:** Tareas (`Task`) con CRUD completo, estados, prioridades, fechas de vencimiento y relación.  
> **Entidad Relacionada:** Proyectos (`Project`) con CRUD completo, colores identificatorios y cálculo de progreso.  

---

## 📋 Cumplimiento de Requisitos de la Consigna

| Requisito de la Consigna | Estado | Implementación en este proyecto |
|---|---|---|
| **Frontend: React (Vite) UI Responsiva (320px a 2000px)** | ✅ Cumplido | Desarrollado en React 19 + Vite con CSS Variables responsivas, Navbar móvil, modales y grillas fluidas. |
| **Backend: Node.js + Express** | ✅ Cumplido | Desarrollado en Node.js (ES Modules `"type": "module"`) y Express 5. |
| **Base de Datos: MongoDB** | ✅ Cumplido | Modelado en MongoDB con ODM Mongoose, relaciones con `ObjectId`, `ref` y `populate`. |
| **Arquitectura en 4 Capas** | ✅ Cumplido | Separación estricta: `routes/` → `controllers/` → `services/` → `repositories/`. |
| **Middlewares Obligatorios** | ✅ Cumplido | `cors()`, validación de campos (`validateRequiredFields`), manejo de errores (`errorHandlerMiddleware`), autenticación JWT (`authMiddleware`). |
| **Seguridad: bcrypt + JWT** | ✅ Cumplido | Hash de passwords con `bcrypt` (10 rondas), tokens JWT Bearer con expiración y validación estricta de firma. |
| **Verificación por Correo** | ✅ Cumplido | Tokens firmados de 7 días enviados vía `nodemailer` con plantilla HTML; endpoints para verificar y reenviar. |
| **Recuperación de Contraseña** | ✅ Cumplido | Token firmado de 1 hora con `purpose: 'password_reset'` y plantilla HTML para cambio seguro de clave. |
| **Variables de Entorno** | ✅ Cumplido | Gestionadas con `dotenv` en `.env` (puerto, base de datos, claves secretas, credenciales de correo y URLs). |
| **Documentación** | ✅ Cumplido | `README.md` completo en raíz, Backend y Frontend, colección Postman exportada y Swagger UI interactivo en `/api/docs`. |
| **Pantallas de Frontend** | ✅ Cumplido | Login, Registro, Verificación de Email, Reenvío de enlace, Olvidé mi contraseña, Reset de contraseña, Dashboard (`Home`), Listado y Detalle de Proyectos, Listado y Detalle de Tareas, Creación, Edición y Borrado de ambas entidades. |
| **Despliegues Públicos** | ✅ Preparado | Archivos `vercel.json` configurados tanto en Backend (Serverless Node) como en Frontend (SPA routing). |

---

## 📂 Estructura del Repositorio

```
Trabajo_Integrador_Final/
├── Backend/                                  # Servidor API REST en Express 5 + MongoDB
│   ├── docs/
│   │   └── Gestor_Tareas_API.postman_collection.json # Colección Postman para pruebas
│   ├── src/
│   │   ├── config/                           # Conexión a MongoDB, Nodemailer y variables de entorno
│   │   ├── controllers/                      # Capa HTTP (auth, project, task)
│   │   ├── docs/                             # Especificación OpenAPI 3.1 para Swagger UI
│   │   ├── middlewares/                      # Auth JWT, validación de inputs y errorHandler central
│   │   ├── models/                           # Esquemas Mongoose (User, Project, Task)
│   │   ├── repositories/                     # Acceso a datos y queries Mongoose (Patrón Repository)
│   │   ├── routes/                           # Enrutadores Express documentados con JSDoc
│   │   ├── services/                         # Lógica de negocio, hash, tokens y envío de mails
│   │   ├── utils/                            # ServerError, utilidades bcrypt y templates HTML
│   │   └── main.js                           # Punto de entrada de la aplicación
│   ├── .env.example
│   ├── package.json
│   ├── README.md                             # Documentación exhaustiva de endpoints y respuestas
│   └── vercel.json
├── Frontend/                                 # Aplicación web cliente en React 19 + Vite
│   ├── public/
│   ├── src/
│   │   ├── Components/                       # Navbar, Modales, Alerts, Forms, ProjectCard, TaskCard
│   │   ├── Contexts/                         # AuthContext (usuario en sesión, token, login/logout)
│   │   ├── hooks/                            # Custom hooks (useForm, useRequest)
│   │   ├── Middlewares/                      # AuthMiddleware para protección de rutas privadas
│   │   ├── screens/                          # Vistas de Auth, Dashboard, Proyectos y Tareas (CRUDs)
│   │   ├── services/                         # Clientes HTTP (authService, projectService, taskService)
│   │   ├── App.jsx                           # Árbol de rutas públicas y privadas
│   │   ├── globals.css                       # Variables CSS y diseño responsivo (320px - 2000px)
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── README.md                             # Documentación del Frontend y componentes
│   └── vite.config.js
└── README.md
```

---

## 🚀 Puesta en Marcha Rápida

### 1. Iniciar el Backend

```bash
cd Backend
npm install
cp .env.example .env     # Configura tu MONGO_DB_URI y credenciales
npm run dev
```
* **API operativa en:** `http://localhost:8080`
* **Swagger UI interactivo en:** `http://localhost:8080/api/docs`

### 2. Iniciar el Frontend

En otra terminal:

```bash
cd Frontend
npm install
cp .env.example .env     # Asegúrate de que apunte a http://localhost:8080
npm run dev
```
* **Aplicación Web en:** `http://localhost:5173`
