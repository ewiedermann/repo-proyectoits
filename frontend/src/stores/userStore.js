/**
 * @fileoverview Store de Pinia para gestionar el estado del usuario (login, registro, sesión).
 * Utiliza cookies para persistir el token de autenticación.
 *
 * @module stores/useUserStore
 */

import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { login, register } from '@/services/authService';

/**
 * Hook que crea y retorna el store para la gestión del usuario.
 *
 * @returns {*} Instancia del store con estado, acciones y getters relacionados al usuario.
 */
export const useUserStore = defineStore('user', {
  /**
   * Estado inicial del store.
   * @returns {Object} Retorna un objeto con el estado inicial del usuario.
   */
  state: () => ({
    /**
     * Información del usuario autenticado.
     * @type {Object|null}
     */
    user: null,

    /**
     * Token JWT del usuario autenticado.
     * @type {string|null}
     */
    token: null,

    /**
     * Indicador de si hay una acción en curso (ej: login o registro).
     * @type {boolean}
     */
    loading: false,

    /**
     * Mensaje de error en caso de fallo durante una acción.
     * @type {string|null}
     */
    error: null,
  }),

  /**
   * Acciones para modificar el estado del store.
   */
  actions: {
    /**
     * Inicia sesión del usuario con las credenciales proporcionadas.
     * Almacena el token en el estado y en una cookie.
     *
     * @param {Object} credentials - Objeto con email y contraseña del usuario.
     * @param {string} credentials.email - Correo electrónico del usuario.
     * @param {string} credentials.password - Contraseña del usuario.
     * @returns {Promise<Object>} Resultado de la operación.
     * - `success`: boolean indica si fue exitosa
     * - `message`: string opcional, mensaje adicional
     */
    async loginUser(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const data = await login(credentials.email, credentials.password);
        // Guardar el usuario y el token en el estado y cookies

        this.user = data.user;  // Almacenar el usuario completo
        this.token = data.token;
        Cookies.set('token', data.token, { expires: 1 });
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Registra un nuevo usuario con los datos proporcionados.
     * Valida los campos antes de enviarlos y almacena el token en el estado y en una cookie.
     *
     * @param {Object} credentials - Objeto con nombre, email y contraseña del nuevo usuario.
     * @param {string} credentials.name - Nombre del nuevo usuario.
     * @param {string} credentials.email - Correo electrónico del nuevo usuario.
     * @param {string} credentials.password - Contraseña del nuevo usuario.
     * @returns {Promise<Object>} Resultado de la operación.
     * - `success`: boolean indica si fue exitosa
     * - `message`: string opcional, mensaje adicional
     */
    async registerUser(credentials) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Datos de registro:', {
          name: credentials.name,
          email: credentials.email,
          password: '******'
        });

        // Verifica que los datos sean correctos antes de enviarlos
        if (!credentials.name || !credentials.email || !credentials.password) {
          throw new Error('Todos los campos son requeridos');
        }

        const data = await register(credentials.name, credentials.email, credentials.password);

        // Verifica si los datos devueltos son correctos
        console.log('Datos de registro recibidos:', data);

        this.user = data.user;
        this.token = data.token;
        Cookies.set('token', data.token, { expires: 1 });

        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error al registrar usuario';
        console.error('Error al registrar usuario:', this.error);  // Verifica el error completo
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Cierra la sesión del usuario eliminando el estado y el token almacenado.
     */
    logout() {
      this.user = null;
      this.token = null;
      Cookies.remove('token');
    }
  },

  /**
   * Getters para obtener información del estado.
   */
  getters: {
    /**
     * Verifica si el usuario está autenticado comprobando si hay un token válido en las cookies.
     * Si lo hay, lo sincroniza con el estado.
     *
     * @param {Object} state - Estado actual del store.
     * @returns {boolean} `true` si el usuario está autenticado, `false` en caso contrario.
     */
    isAuthenticated: (state) => {
      const token = Cookies.get('token');
      if (token) {
        state.token = token;
        return true;
      }
      return false;
    },
  }
});

/*
Login: Realiza una solicitud de inicio de sesión, guarda los datos del usuario y token en el estado y las cookies.
Registro: Realiza una solicitud de registro, valida los datos del usuario, y guarda la información del usuario y token si la operación es exitosa.
Logout: Limpia los datos del usuario y el token del estado y elimina las cookies.
Autenticación: Verifica si hay un token válido en las cookies para determinar si el usuario está autenticado.
*/
