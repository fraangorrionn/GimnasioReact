# Gimnasio Frontend - Cliente React (Docker + Nginx + AWS)

Este proyecto es el cliente web del sistema de gestión de un gimnasio. Permite a los usuarios registrarse, iniciar sesión, suscribirse, ver clases, inscribirse a ellas, y participar en publicaciones y comentarios. Está desarrollado con React y desplegado en AWS EC2 con Nginx.

---

## ¿Por qué es útil?

- Los clientes pueden navegar fácilmente por las clases, suscribirse y ver sus inscripciones.
- Los monitores pueden crear clases, publicar contenido e interactuar.
- Diseño moderno, responsive y funcional.
- Se conecta con la API REST del backend desplegado en AWS.

---

## Enlace a la aplicación (producción)

> http://3.213.43.92  
> *(Solo disponible cuando la instancia EC2 del frontend está encendida)*

---

## Tecnologías utilizadas

- React 18 (Create React App)
- React Router
- Axios
- Swiper.js (carrusel de inicio)
- jwt-decode (para extraer datos del token)
- lucide-react (iconos)
- PayPal JS SDK
- Docker + Docker Compose
- Nginx
- AWS EC2

---

## Instalación local (desarrollo)

### 1. Clona el repositorio

git clone https://github.com/fraangorrionn/GimnasioReact.git
cd GimnasioReact/react-gimnasio

### 2. Instala dependencias

npm install
npm install swiper
npm install jwt-decode
npm install lucide-react

### 3. Crea archivo .env con la URL del backend

cp .env.example .env

Edita .env y asegúrate de tener:

VITE_API_URL=http://localhost:8000

Reemplaza localhost por la IP pública de tu backend si usas backend remoto.

### 4. Ejecuta en modo desarrollo

npm start

El frontend se abrirá automáticamente en: 
> http://localhost:3000

## Despliegue en producción (Docker + AWS)

### 1. Build y push a Docker Hub

docker build -t fraangorrionn/gimnasiofrontend:v1 .
docker push fraangorrionn/gimnasiofrontend:v1

### 2. En tu instancia EC2 del frontend, crea docker-compose.yml

version: '3'
services:
  frontend:
    image: fraangorrionn/gimnasiofrontend:v1
    container_name: gimnasio-frontend
    ports:
      - "80:80"

### 3. Ejecuta el contenedor

sudo docker compose up -d

Y accede a tu web desde el navegador:
> http://3.213.43.92


## Soporte

Si tienes dudas o encuentras errores, puedes contactarme a través de GitHub:
[fraangorrionn](https://github.com/fraangorrionn)

## Documentación adicional

Puedes consultar el documento detallado del proyecto aquí:  
[Documento del Proyecto (Google Docs)](https://docs.google.com/...) *(si lo tienes)*

## Autor
Nombre: Francisco

GitHub: fraangorrionn

