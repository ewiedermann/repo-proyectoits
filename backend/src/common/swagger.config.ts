// backend/src/common/swagger.config.ts
export const swaggerConfig = {
  title: 'Juegos Dinosaurios API',
  description: `
    API backend para aplicación de juegos de dinosaurios con autenticación Auth0.
    
    ## Autenticación
    Esta API utiliza Auth0 para la autenticación. Para usar los endpoints protegidos:
    1. Obtén un token JWT de Auth0
    2. Inclúyelo en el header Authorization: \`Bearer <token>\`
    3. Algunos endpoints requieren que el email esté verificado
    
    ## Endpoints principales
    - **Auth**: Gestión de autenticación y perfil de usuario
    - **Juegos**: Gestión de juegos, puntajes y estadísticas
    
    ## Códigos de estado
    - **200**: Operación exitosa
    - **201**: Recurso creado
    - **400**: Datos inválidos
    - **401**: Token inválido o expirado
    - **403**: Sin permisos (email no verificado)
    - **404**: Recurso no encontrado
    - **429**: Demasiadas peticiones
    - **500**: Error interno del servidor
  `,
  version: '1.0',
  tags: [
    {
      name: 'auth',
      description: 'Endpoints de autenticación y gestión de usuarios con Auth0'
    },
    {
      name: 'juegos',
      description: 'Endpoints para gestión de juegos, puntajes y estadísticas'
    }
  ],
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Servidor de desarrollo'
    },
    {
      url: 'https://api.tudominio.com',
      description: 'Servidor de producción'
    }
  ],
  contact: {
    name: 'Equipo de Desarrollo',
    url: 'https://tu-sitio.com',
    email: 'contacto@tu-sitio.com'
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  }
};