/**
 * @fileoverview Servicio para gestionar las peticiones HTTP relacionadas con los juegos.
 * Incluye funciones para obtener todos los juegos y uno específico por ID.
 *
 * @module services/juegosService
 */

import axios from 'axios';

/**
 * URL base del endpoint de juegos en el backend.
 * @type {string}
 */
const API_URL = 'http://localhost:3000/juegos'; // URL del backend cambiar puerto 4000

/**
 * Obtiene la lista de todos los juegos desde el backend.
 * Requiere un token de autenticación en el encabezado.
 *
 * @returns {Promise<any>} Datos de respuesta del servidor (lista de juegos).
 * @throws {Error} Si ocurre un error durante la solicitud.
 */
export const getJuegos = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Usa el token de sesión del usuario
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    throw error;
  }
};

/**
 * Obtiene un juego específico por su ID desde el backend.
 * Requiere un token de autenticación en el encabezado.
 *
 * @param {string|number} id - Identificador único del juego.
 * @returns {Promise<any>} Datos de respuesta del servidor (información del juego).
 * @throws {Error} Si ocurre un error durante la solicitud.
 */
export const getJuegoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Usa el token de sesión del usuario
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el juego:', error);
    throw error;
  }
};
