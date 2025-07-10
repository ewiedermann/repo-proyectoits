/**
 * @fileoverview Servicio de autenticación para manejar peticiones HTTP relacionadas con login y registro.
 * Utiliza la instancia de Axios configurada en `api.js`.
 *
 * @module services/authService
 */

import api from './api';

/**
 * Realiza una solicitud de inicio de sesión al backend.
 *
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<any>} Datos de respuesta del servidor (por ejemplo, token o mensaje).
 * @throws {Error} Si ocurre un error durante la solicitud.
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Realiza una solicitud de registro de usuario al backend.
 *
 * @param {string} name - Nombre del nuevo usuario.
 * @param {string} email - Correo electrónico del nuevo usuario.
 * @param {string} password - Contraseña del nuevo usuario.
 * @returns {Promise<any>} Datos de respuesta del servidor (por ejemplo, mensaje de éxito).
 * @throws {Error} Si ocurre un error durante la solicitud.
 */
export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Error en register:', error.response?.data || error.message);
    throw error;
  }
};
