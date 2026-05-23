# COTAL — Conecta de Talentos Locales (Backend - Fase 1)

Este es el backend completo y profesional para la **Fase 1** del proyecto **COTAL**, diseñado bajo principios de arquitectura limpia, modular y escalable. Está construido utilizando **Node.js**, **Express**, **Prisma ORM**, y conecta con **PostgreSQL**.

La autenticación está implementada mediante **JSON Web Tokens (JWT)** con contraseñas seguras hasheadas con **bcrypt**. Toda entrada de datos está validada utilizando **express-validator**.

---

## 🛠️ Tecnologías Obligatorias Utilizadas

*   **Node.js** (v18+)
*   **Express.js** (Entorno de servidor rápido y minimalista)
*   **PostgreSQL** (Motor de base de datos relacional)
*   **Prisma ORM** (Gestor y mapeador de la base de datos)
*   **JSON Web Tokens (jsonwebtoken)** (Autenticación y autorización basada en tokens)
*   **bcrypt** (Algoritmo de hasheo de contraseñas de alta seguridad)
*   **express-validator** (Middleware de validación de datos)
*   **dotenv** (Gestión de variables de entorno)
*   **cors** (Manejo de intercambio de recursos de origen cruzado)
*   **nodemon** (Herramienta de desarrollo para reinicio automático)

---

## 📂 Estructura del Proyecto

El backend se ha organizado en base a capas para mantener la modularidad y facilitar el mantenimiento futuro o escalabilidad:

```text
backend/
│
├── prisma/
│   └── schema.prisma      # Esquema de base de datos y modelos Prisma
│
├── src/
│   ├── config/
│   │   ├── db.js          # Instancia única de Prisma Client
│   │   └── config.js      # Cargador de variables de entorno (.env)
│   │
│   ├── controllers/
│   │   ├── authController.js # Lógica HTTP para registro y login
│   │   └── userController.js # Lógica HTTP para el CRUD de usuarios
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js # Protección de rutas y control de roles
│   │   ├── errorHandler.js   # Manejador centralizado de errores (Prisma, JWT, etc.)
│   │   ├── notFoundHandler.js# Interceptor de rutas inexistentes (404)
│   │   └── validationMiddleware.js # Validaciones de esquemas con express-validator
│   │
│   ├── routes/
│   │   ├── authRoutes.js  # Endpoints de autenticación (/api/auth)
│   │   ├── userRoutes.js  # Endpoints del CRUD de usuarios (/api/users)
│   │   └── index.js       # Agrupador central de rutas de la API
│   │
│   ├── services/
│   │   ├── authService.js # Lógica de negocio de registro e inicio de sesión
│   │   └── userService.js # Lógica de negocio de interacción con la BD (CRUD)
│   │
│   ├── utils/
│   │   ├── customError.js   # Clase extendida para errores HTTP
│   │   └── generateToken.js # Generador de tokens JWT
│   │
│   ├── app.js             # Configuración de Express y middlewares
│   └── server.js          # Punto de arranque y apagado ordenado (graceful shutdown)
│
├── .env.example           # Variables de entorno de referencia
├── .gitignore             # Archivos excluidos de control de versiones
├── package.json           # Dependencias y scripts del proyecto
└── README.md              # Documentación técnica (este archivo)
```

---

## 🚀 Guía de Instalación y Configuración Local

### 1. Requisitos Previos

*   Instalar [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada).
*   Tener una instancia de [PostgreSQL](https://www.postgresql.org/) instalada y corriendo localmente, o una base de datos PostgreSQL remota (por ejemplo en Neon, Supabase, etc.).

### 2. Clonar e Instalar Dependencias

Navega hasta la carpeta del proyecto e instala las librerías:

```bash
cd backend
npm install
```

### 3. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del directorio `backend` tomando como base el archivo `.env.example`:

```bash
cp .env.example .env
```

Abre el archivo `.env` y define tus variables:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/cotal_db?schema=public"
JWT_SECRET="tu_secreto_super_seguro_de_jwt"
```

*Nota: Asegúrate de reemplazar `usuario`, `contraseña` y `cotal_db` con tus credenciales locales de PostgreSQL.*

### 4. Ejecución de Migraciones de Prisma

Prisma requiere crear las tablas en tu base de datos PostgreSQL a partir del esquema definido. Corre el siguiente comando para generar y aplicar la migración:

```bash
npx prisma migrate dev --name init
```

Este comando:
1. Crea la base de datos `cotal_db` si no existe.
2. Crea la tabla `users` (mapeada a partir del modelo `User`) con los tipos e índices correctos.
3. Genera internamente el **Prisma Client** para poder usarlo en Javascript.

Si en algún momento necesitas regenerar el cliente manualmente, puedes ejecutar:

```bash
npm run prisma:generate
```

---

## 🏃 Ejecución del Servidor

### Modo Desarrollo (con reinicio automático usando Nodemon):

```bash
npm run dev
```

El servidor iniciará localmente en el puerto configurado (ej: `http://localhost:3000`). Podrás observar un banner en consola indicando el éxito de la conexión.

### Modo Producción:

```bash
npm start
```

---

## 🧪 Pruebas de la API (Endpoints)

La API cuenta con endpoints públicos para la autenticación y endpoints privados protegidos por tokens Bearer para la administración. El formato de las respuestas siempre es **JSON**.

### 1. Endpoints Públicos de Autenticación (`/api/auth`)

#### **Registro de Usuario**
*   **Método:** `POST`
*   **Ruta:** `/api/auth/register`
*   **Cuerpo de la Solicitud (JSON):**
    ```json
    {
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@example.com",
      "password": "mipasswordseguro",
      "rol": "USER"
    }
    ```
    *Valores válidos para `rol`: `USER`, `HOST`, o `ADMIN`. Si no se provee, se asignará `USER` por defecto.*
*   **Respuesta Exitosa (201 Created):**
    ```json
    {
      "success": true,
      "message": "Usuario registrado exitosamente.",
      "data": {
        "id": "a9a3b6bf-4638-4b72-b883-7c5ef2256df2",
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "juan.perez@example.com",
        "rol": "USER",
        "createdAt": "2026-05-22T23:50:00.000Z",
        "updatedAt": "2026-05-22T23:50:00.000Z"
      }
    }
    ```

#### **Inicio de Sesión**
*   **Método:** `POST`
*   **Ruta:** `/api/auth/login`
*   **Cuerpo de la Solicitud (JSON):**
    ```json
    {
      "email": "juan.perez@example.com",
      "password": "mipasswordseguro"
    }
    ```
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "message": "Inicio de sesión exitoso.",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": "a9a3b6bf-4638-4b72-b883-7c5ef2256df2",
          "nombre": "Juan",
          "apellido": "Pérez",
          "email": "juan.perez@example.com",
          "rol": "USER",
          "createdAt": "2026-05-22T23:50:00.000Z",
          "updatedAt": "2026-05-22T23:50:00.000Z"
        }
      }
    }
    ```

---

### 2. Endpoints Protegidos del CRUD de Usuarios (`/api/users`)

> 🔒 **Requisito de Seguridad:** Todas las siguientes rutas requieren que se adjunte el token JWT obtenido en el login en la cabecera HTTP de la petición:
> `Authorization: Bearer <token_jwt>`

#### **Obtener todos los usuarios**
*   **Método:** `GET`
*   **Ruta:** `/api/users`
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "count": 1,
      "data": [
        {
          "id": "a9a3b6bf-4638-4b72-b883-7c5ef2256df2",
          "nombre": "Juan",
          "apellido": "Pérez",
          "email": "juan.perez@example.com",
          "rol": "USER",
          "createdAt": "2026-05-22T23:50:00.000Z",
          "updatedAt": "2026-05-22T23:50:00.000Z"
        }
      ]
    }
    ```

#### **Obtener un usuario por ID**
*   **Método:** `GET`
*   **Ruta:** `/api/users/:id` (ej. `/api/users/a9a3b6bf-4638-4b72-b883-7c5ef2256df2`)
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "id": "a9a3b6bf-4638-4b72-b883-7c5ef2256df2",
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "juan.perez@example.com",
        "rol": "USER",
        "createdAt": "2026-05-22T23:50:00.000Z",
        "updatedAt": "2026-05-22T23:50:00.000Z"
      }
    }
    ```

#### **Crear usuario administrativamente**
*   **Método:** `POST`
*   **Ruta:** `/api/users`
*   **Cuerpo de la Solicitud (JSON):**
    ```json
    {
      "nombre": "Carlos",
      "apellido": "Gómez",
      "email": "carlos.gomez@example.com",
      "password": "passwordsegura123",
      "rol": "HOST"
    }
    ```
*   **Respuesta Exitosa (201 Created):**
    ```json
    {
      "success": true,
      "message": "Usuario creado exitosamente.",
      "data": {
        "id": "d820ff56-11b3-4670-bbcf-84e5e4fa4498",
        "nombre": "Carlos",
        "apellido": "Gómez",
        "email": "carlos.gomez@example.com",
        "rol": "HOST",
        "createdAt": "2026-05-22T23:52:00.000Z",
        "updatedAt": "2026-05-22T23:52:00.000Z"
      }
    }
    ```

#### **Actualizar usuario por ID**
*   **Método:** `PUT`
*   **Ruta:** `/api/users/:id`
*   **Cuerpo de la Solicitud (JSON):** *(Puedes enviar solo los campos que deseas modificar)*
    ```json
    {
      "nombre": "Juan Carlos",
      "rol": "ADMIN"
    }
    ```
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "message": "Usuario actualizado exitosamente.",
      "data": {
        "id": "a9a3b6bf-4638-4b72-b883-7c5ef2256df2",
        "nombre": "Juan Carlos",
        "apellido": "Pérez",
        "email": "juan.perez@example.com",
        "rol": "ADMIN",
        "createdAt": "2026-05-22T23:50:00.000Z",
        "updatedAt": "2026-05-22T23:54:00.000Z"
      }
    }
    ```

#### **Eliminar usuario por ID**
*   **Método:** `DELETE`
*   **Ruta:** `/api/users/:id`
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "message": "Usuario eliminado exitosamente."
    }
    ```

---

## 🛡️ Estilo de Manejo de Errores y Validaciones

Si alguna validación falla o sucede un error en base de datos, la API responderá con códigos de estado HTTP semánticos (por ejemplo, `400 Bad Request`, `401 Unauthorized`, `409 Conflict`, `404 Not Found`, etc.) y un formato de error claro:

### Ejemplo de error de validación (400 Bad Request):
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Los datos enviados en la solicitud no son válidos.",
  "errors": [
    {
      "campo": "email",
      "mensaje": "Debe proporcionar una dirección de correo electrónico válida."
    },
    {
      "campo": "password",
      "mensaje": "La contraseña debe tener al menos 6 caracteres."
    }
  ]
}
```

### Ejemplo de error de email duplicado (409 Conflict):
```json
{
  "success": false,
  "error": "ConflictError",
  "message": "El valor proporcionado para email ya está registrado en el sistema."
}
```

---

## ☁️ Preparación para Despliegue en Render

El backend está preparado al 100% para ser desplegado en [Render](https://render.com/) de forma rápida y sencilla:

### 1. Scripts en `package.json`
Render lee automáticamente los scripts del proyecto:
*   **Comando de Compilación (Build Command):** `npm run build` (que ejecuta `prisma generate` para construir el cliente de Prisma).
*   **Comando de Inicio (Start Command):** `npm start` (inicia el servidor con `node src/server.js`).

### 2. Puerto Dinámico
El servidor está configurado para escuchar en `process.env.PORT` provisto por Render de manera dinámica, cayendo a `3000` si es local.

### 3. Conexión de Base de Datos
En producción, Render requiere que configures las variables de entorno en su panel de administración. Deberás añadir:
*   `DATABASE_URL`: La URL de conexión externa de tu base de datos PostgreSQL provista por Render u otro proveedor Cloud.
*   `JWT_SECRET`: Una cadena larga, aleatoria y ultra secreta de producción.
*   `NODE_ENV`: `production`

### 4. Flujo de Migración en Render
Para ejecutar las migraciones de Prisma automáticamente en producción en cada despliegue, puedes establecer tu **Build Command** en Render como:
```bash
npm install && npx prisma migrate deploy && npm run build
```
*(El comando `prisma migrate deploy` ejecuta las migraciones pendientes en PostgreSQL sin reiniciar la base de datos o requerir confirmación interactiva)*.
