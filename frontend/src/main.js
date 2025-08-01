<<<<<<< HEAD
// frontend/src/main.js - Fix final para errores 401 y split
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'
import './index.css'

const app = createApp(App)

// Variables de entorno para Auth0
const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID

console.log('🔧 Configuración Auth0:')
console.log('Domain:', domain)
console.log('Client ID:', clientId)

// Validar variables de entorno
if (!domain || !clientId) {
  console.error('❌ Faltan variables de entorno de Auth0')
  console.error('Asegúrate de tener VITE_AUTH0_DOMAIN y VITE_AUTH0_CLIENT_ID en tu .env')
}

// CONFIGURACIÓN SIMPLIFICADA PARA EVITAR ERRORES
app.use(
  createAuth0({
    domain: domain,
    clientId: clientId,
    authorizationParams: {
      redirect_uri: window.location.origin + '/callback',
      // NO incluir audience para SPA simple
      scope: 'openid profile email'
    },
    
    // Configuración mínima para evitar errores
    cacheLocation: 'localstorage',
    useRefreshTokens: false,
    
    // Configuración específica para desarrollo
    ...(import.meta.env.DEV && {
      httpTimeoutMs: 10000,
    })
  })
)

// Limpiar localStorage corrupto al inicio
if (import.meta.env.DEV) {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.includes('@@auth0spajs@@')) {
        localStorage.removeItem(key);
      }
    });
    console.log('🧹 localStorage de Auth0 limpiado');
  } catch (error) {
    console.warn('Error limpiando localStorage:', error);
  }
}

app.use(router)

app.mount('#app')

console.log('🚀 Aplicación iniciada correctamente')
=======
/**
 * @file main.js - Punto de entrada principal de la aplicación Vue.
 * Configura la instancia de la aplicación, plugins y monta el componente raíz.
 */

// Importamos las funciones necesarias desde 'vue'
import { createApp } from 'vue'

// Importamos el componente raíz App.vue
import App from './App.vue'

// Importamos el enrutador configurado para la navegación
import router from './router'

// Importamos Pinia para manejo del estado global
import { createPinia } from 'pinia'

// Importamos los estilos de FontAwesome para íconos
import '@fortawesome/fontawesome-free/css/all.css'

/**
 * @type {Vue.App}
 * @see https://vuejs.org/v2/api/#vm-$mount
 */
const app = createApp(App)

/**
 * Registramos Pinia como plugin de la aplicación.
 * Esto habilita el uso de stores a lo largo de la aplicación.
 */
app.use(createPinia())

/**
 * Registramos el enrutador Vue Router.
 * Esto permite la navegación entre componentes basada en URL.
 */
app.use(router)

/**
 * Montamos la aplicación en el elemento del DOM
 * con el ID '#app' definido en index.html.
 */
app.mount('#app')
>>>>>>> qa1
