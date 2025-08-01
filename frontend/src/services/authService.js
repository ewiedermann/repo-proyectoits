<<<<<<< HEAD
/* Este archivo manejará las peticiones relacionadas con autenticación (login y registro).
=======
/**
 * @fileoverview Servicio de autenticación para manejar peticiones HTTP relacionadas con login y registro.
 * Utiliza la instancia de Axios configurada en `api.js`.
 *
 * @module services/authService
>>>>>>> qa1
 */

import api from './api';

<<<<<<< HEAD
=======
/**
 * Realiza una solicitud de inicio de sesión al backend.
 *
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<any>} Datos de respuesta del servidor (por ejemplo, token o mensaje).
 * @throws {Error} Si ocurre un error durante la solicitud.
 */
>>>>>>> qa1
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  }
};

<<<<<<< HEAD
export const register = async (name, email, password) => {  // Agregamos 'name'
  try {
    const response = await api.post('/auth/register', { name, email, password });  // Incluimos 'name'
=======
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
>>>>>>> qa1
    return response.data;
  } catch (error) {
    console.error('Error en register:', error.response?.data || error.message);
    throw error;
  }
};
