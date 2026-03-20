# 🚀 Automation Hours Grid

Sistema de visualización de horas automatizadas mediante un grid interactivo, desplegado en infraestructura cloud (AWS) y construido con un backend modular en Node.js.

---

## 🧠 Overview

Este proyecto permite:

- Centralizar horas generadas por procesos automatizados  
- Visualizar actividad en un grid tipo HEATMAP 
- Consultar datos en tiempo real desde una API  
- Eliminar seguimiento manual de productividad  

---

## 🏗️ Arquitectura

El sistema sigue una arquitectura cliente-servidor simple pero eficiente:

Cliente (Frontend)  
↓  
Nginx (Reverse Proxy)  
↓  
Node.js (Express API)  
↓  
SQLite (Persistencia)  

---

## ☁️ Infraestructura

El sistema está desplegado en AWS Lightsail.

### Características:

- Servidor Linux (Ubuntu)
- IP pública estática
- Recursos dedicados (CPU, RAM, SSD)
- Firewall configurado
- Entorno listo para producción

---

## 🖥️ Configuración del servidor

Dentro de la instancia se configuró el siguiente stack:

### 🌐 Web Server
- Nginx  
  - Reverse proxy  
  - Manejo de tráfico HTTP/HTTPS  
  - Servido de archivos estáticos  

### 🧠 Backend
- Node.js  
- Express.js  

### ⚙️ Procesos
- PM2  
  - Gestión de procesos  
  - Reinicio automático  
  - Logs  

### ⏱️ Automatización
- Cron jobs  
  - Ejecución programada de scripts  

### 🔒 Seguridad
- Firewall (Lightsail + sistema)  
- Certificados SSL (Let's Encrypt)  

---

## 📦 Estructura del proyecto

root/
│
├── src/
│ ├── database/
│ └── middleware/
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── README.md
├── Tesis.txt
├── database.sqlite
├── package.json
├── package-lock.json
└── server.js



---

## 🧩 Backend

El backend está construido con Node.js y sigue una estructura modular:

- server.js  
  - Punto de entrada  
  - Configuración de Express  
  - Definición de rutas  

- src/database/  
  - Conexión a SQLite  
  - Queries y acceso a datos  

- src/middleware/  
  - Validación de requests  
  - Manejo de errores  
  - Procesamiento previo  

### Funcionalidades:

- Cálculo de horas automatizadas  
- Agrupación por fecha  
- Exposición de endpoints API  

---

## 🗄️ Base de datos

- SQLite  
  - Base de datos ligera embebida  
  - Ideal para lectura rápida y baja complejidad  
  - Persistencia local eficiente  

---

## 🎨 Frontend

- HTML, CSS, JavaScript  
- Grid interactivo tipo heatmap  
- Visualización por fechas  
- Interacción por clic (detalle por celda)  
- Adaptado a desktop y mobile  

---

## 🔄 Flujo del sistema

1. Usuario accede al frontend  
2. Nginx recibe la petición  
3. Redirige al backend (Node.js)  
4. Middleware procesa la request  
5. Consulta a SQLite  
6. API devuelve JSON  
7. Frontend renderiza el grid  

---

## 🐳 Contenerización

El proyecto incluye soporte para Docker:

- Dockerfile  
  - Define el entorno de ejecución  

- .dockerignore  
  - Optimiza el build  

### Beneficios:

- Portabilidad entre entornos  
- Consistencia en despliegues  
- Base para escalabilidad futura  

---

## 🚀 Resultado

- Visualización clara del progreso de automatización  
- Sistema centralizado de métricas  
- Reducción del trabajo manual  
- Respuesta rápida en tiempo real  

---

## 💡 Impacto

- Eliminación del seguimiento manual de horas  
- Mejora en la toma de decisiones basada en datos  
- Base reutilizable para dashboards futuros  
- Infraestructura replicable para múltiples proyectos  

---

## 🧱 Stack Tecnológico

- AWS Lightsail  
- Nginx  
- Node.js  
- Express.js  
- SQLite  
- PM2  
- Docker  
- HTML, CSS, JavaScript  

---

## 📌 Notas

Este proyecto prioriza:

- Simplicidad  
- Eficiencia  
- Rapidez de implementación  

Sobre arquitecturas complejas innecesarias, manteniendo una base sólida para escalar en el futuro.








----


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
