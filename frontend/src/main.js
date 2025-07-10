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
