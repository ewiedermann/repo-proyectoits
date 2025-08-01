<<<<<<< HEAD
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
=======
/**
 * @fileoverview Configuración de Axios para las peticiones HTTP a la API del backend.
 * Este archivo crea una instancia preconfigurada de Axios para comunicarse con el servidor.
 *
 * @module services/api
 */

import axios from 'axios';

/**
 * Instancia de Axios configurada para interactuar con el backend.
 * Utiliza la URL base `http://localhost:4000` y establece el tipo de contenido como JSON.
 *
 * @type {Object}
 */
const api = axios.create({
  baseURL: 'http://localhost:4000', // Puerto donde esta corriendo el backend
>>>>>>> qa1
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
