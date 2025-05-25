# Proyecto Integrador DAW

## Descripción

Aplicación fullstack para gestión de encuestas, desarrollada como trabajo integrador para la carrera DAW (Desarrollo de Aplicaciones Web).  
Incluye un backend en Node.js y un frontend en Angular.

## Tecnologías

- **Frontend:** Angular
- **Backend:** Node.js (NestJS)
- **Documentación:** Compodoc

## Estructura del proyecto

```
tfintegrador-daw/
├── backend/
├── frontend/
└── info.txt
```

## Instalación

Clonar el repositorio y luego instalar dependencias en cada carpeta:

```bash
git clone <url-del-repo>
cd tfintegrador-daw

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## Ejecución

Abrir **dos terminales** diferentes:

**Backend:**
```bash
cd backend
npm run start:dev
```
Acceder a: [http://localhost:3000/api/v1/encuestas](http://localhost:3000/api/v1/encuestas)

**Frontend:**
```bash
cd frontend
npm start
```
Acceder a: [http://localhost:4200/](http://localhost:4200/)

## Documentación

Cada carpeta tiene su propia documentación generada con Compodoc.

**Para ver la documentación:**

- **Backend:**  
  ```bash
  cd backend
  npm run compodoc
  ```
  Acceder a: [http://localhost:8080/](http://localhost:8080/)

- **Frontend:**  
  ```bash
  cd frontend
  npm run compodoc
  ```
  Acceder a: [http://localhost:8081/](http://localhost:8081/)

## Generar componentes en frontend

```bash
cd frontend/src/app/components
ng generate component nombreDeComponente --skip-tests
```

---

_Agrega aquí autores, licencia, o cualquier otra sección que desees._
