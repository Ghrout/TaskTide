# TaskTide

**TaskTide** es una potente aplicación de gestión de tareas que permite a los usuarios crear, actualizar y eliminar tareas de manera eficiente. Con un diseño moderno y funcionalidades intuitivas, TaskTide facilita la organización y el seguimiento de tareas diarias.

## Tecnologías Utilizadas

- **Backend**: Laravel
- **Frontend**: React, Next.js
- **Base de Datos**: MySQL
- **Control de Versiones**: Git
- **Entorno de Desarrollo**: Laragon

## Instalación

### Backend (Laravel)

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/Ghrout/TaskTide.git
   ```

2. **Navegar al Directorio del Backend**:
   ```bash
   cd TaskTide/backend
   ```

3. **Instalar las Dependencias de Laravel**:
   ```bash
   composer install
   ```

4. **Configurar el Archivo de Entorno**:
   - Copia el archivo `.env.example` a `.env`:
     ```bash
     cp .env.example .env
     ```
   - Configura los detalles de tu base de datos en el archivo `.env`.

5. **Generar la Clave de Aplicación**:
   ```bash
   php artisan key:generate
   ```

6. **Ejecutar las Migraciones**:
   ```bash
   php artisan migrate
   ```

7. **Iniciar el Servidor de Laravel**:
   ```bash
   php artisan serve
   ```

### Frontend (React y Next.js)

1. **Navegar al Directorio del Frontend**:
   ```bash
   cd TaskTide/frontend
   ```

2. **Instalar las Dependencias de Node.js**:
   ```bash
   npm install
   ```

3. **Iniciar el Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```

## Uso

- Accede a la aplicación en [http://localhost:3000](http://localhost:3000).
- Regístrate o inicia sesión para comenzar a gestionar tus tareas de manera eficiente.

## Contribución

¡Las contribuciones son bienvenidas! Si deseas contribuir a TaskTide, sigue estos pasos:

1. **Haz un Fork del Repositorio**.
2. **Crea una Nueva Rama**:
   ```bash
   git checkout -b nombre-de-la-rama
   ```

3. **Realiza tus Cambios y Haz Commit**:
   ```bash
   git commit -m "Descripción de los cambios"
   ```

4. **Envía tus Cambios a tu Fork**:
   ```bash
   git push origin nombre-de-la-rama
   ```

5. **Abre un Pull Request**.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles. 
