### 🧠 Proyecto: Automation Hours Tracking Microservice

Sistema desacoplado para registrar y visualizar horas de automatización mediante un microservicio en Node.js y un plugin de WordPress como capa de presentación.

---

### 🎯 Objetivo

Construir un sistema que:

- Reciba horas de automatización vía API (POST)
- Almacene los datos en base de datos
- Permita consulta por rango o año (GET)
- Sea independiente de WordPress
- Sea escalable y migrable a cloud

---

### 1️⃣ Microservicio Backend (Node.js)

Tecnología:
- Node.js
- Express

Responsabilidades:
- Validar API Key
- Recibir JSON estructurado
- Guardar datos en base de datos
- Exponer endpoints de consulta
- Sanitizar y validar input

Endpoints:

POST /api/hours  
GET /api/hours?year=2026  
GET /api/stats  

Ejemplo de payload:

{
  "date": "2026-02-18",
  "hours": 4.5,
  "source": "automation-batch"
}

---

### 2️⃣ Base de Datos

MVP:
- SQLite (simple y rápido)

Estructura de tabla:

hours  
- id  
- date (YYYY-MM-DD)  
- hours (float)  
- source (string)  
- created_at  

Migración futura:
- PostgreSQL
- DynamoDB (AWS)

---

### 3️⃣ Seguridad

Implementada desde el inicio:

- API Key en header
- Validación estricta
- Rate limiting básico
- CORS restringido

Header requerido:

x-api-key: TU_CLAVE_PRIVADA

---

### 4️⃣ WordPress (Capa de Visualización)

Implementado como plugin independiente.

Responsabilidades:
- Consumir la API vía GET
- Renderizar grid tipo GitHub
- Mostrar estadísticas básicas

Restricciones:
- No almacenar datos
- No lógica de negocio
- No usar functions.php
- No depender del tema activo

---

### 5️⃣ Despliegue Inicial

Entorno recomendado:

- VPS Linux
- Node ejecutándose con PM2
- Nginx como reverse proxy
- HTTPS con Certbot

Migración futura posible a:

- AWS (EC2, Lambda, DynamoDB, S3)

---

### 6️⃣ Estructura del Proyecto Node

automation-hours-service/

src/
- routes/
- controllers/
- middleware/
- database/
- utils/

.env  
server.js  
package.json  

---

### 🔥 Filosofía del Sistema

- Arquitectura desacoplada
- Backend independiente
- WordPress solo como visor
- Escalable
- Migrable a cloud
- Enfocado en microservicio real
