🛍️ Tienda Frontend

Aplicación desarrollada con React + Vite, lista para producción que implementa la interfaz de usuario de una tienda en línea, conectada a un backend desarrollado en Django REST Framework.

El backend se encuentra disponible aquí:

👉 https://github.com/Patogol35/Ecommerce-Django

---

✨ Características principales

Autenticación con JWT

- Registro e inicio de sesión de usuarios.

- Persistencia de sesión mediante tokens de acceso y refresh.


Carrito de compras dinámico

- Agregar y eliminar productos en tiempo real.

- Persistencia del carrito para cada usuario.


Gestión de pedidos

- Creación de pedidos a partir del carrito.

- Visualización del historial de pedidos del usuario.


Integración con API REST

- Conexión directa al backend en Django REST Framework.

- Manejo de peticiones protegidas con autenticación JWT.

--- 

💻 Ver la aplicación desplegada en Vercel:

https://ecommerce-jorge-patricio.vercel.app/

---

⚙️ Tecnologías utilizadas

- React con Vite

- React Router 

- Context API / Local Storage

- JavaScript

- Material UI (MUI)

--- 

📦 Instalación y ejecución

1. Clona el repositorio:

```bash

git clone https://github.com/Patogol35/Ecommerce-React

```

2. Ingresa a la carpeta del proyecto:

```bash

cd Ecommerce-React

```

3. Instala las dependencias:

```bash
  
npm install

```

4. Ejecuta el proyecto:

```bash

npm run dev

```

5. Abre en el navegador:
  
http://localhost:5173

6. Para producción crea un archivo .env en la raíz del proyecto y añade:

```bash

VITE_API_URL=https://TU_API_URL/aquí

```

De esta manera, cualquiera puede reemplazar https://TU_API_URL/aquí con la URL de su propio backend en producción.



---

👨‍💻 Autor

Jorge Patricio Santamaría Cherrez

Máster en Ingeniería de Software y Sistemas Informáticos

