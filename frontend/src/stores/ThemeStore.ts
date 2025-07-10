/**
 * @fileoverview Store de Pinia para gestionar el estado del tema (modo claro/oscuro).
 * Define el estado inicial y una acción para alternar entre modos.
 *
 * @module stores/useThemeStore
 */

import { defineStore } from 'pinia';
import type { ThemeState } from '../models/ThemeState';

/**
 * Hook que crea y retorna el store para el tema de la aplicación.
 *
 * @returns {ReturnType<typeof defineStore>} Instancia del store con estado y acciones relacionadas al tema.
 */
export const useThemeStore = defineStore({
  /**
   * Identificador único del store. Usado por Pinia para reconocerlo internamente.
   * @type {string}
   */
  id: "theme",

  /**
   * Estado inicial del store.
   * @returns {ThemeState} Retorna un objeto con el estado inicial del tema.
   */
  state: (): ThemeState => ({
    /**
     * Indica si el modo oscuro está activado.
     * @type {boolean}
     */
    isDark: false,

    /**
     * Nombre del modo actual (ej: 'Light Mode', 'Dark Mode').
     * @type {string}
     */
    mode: "Light Mode"
  }),

  /**
   * Acciones disponibles en el store.
   */
  actions: {
    /**
     * Alterna entre modo claro y oscuro, y actualiza el nombre del modo correspondiente.
     */
    cambioDeTema() {
      this.isDark = !this.isDark;
      this.mode = this.isDark ? 'Dark Mode' : 'Light Mode';
    },
  },
});
