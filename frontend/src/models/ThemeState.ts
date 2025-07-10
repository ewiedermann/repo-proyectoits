/**
 * @fileoverview Define la interfaz para el estado del tema de la aplicación.
 * Incluye información sobre si el modo oscuro está activado y el nombre del modo actual.
 *
 * @module store/interfaces/ThemeState
 */

/**
 * Interfaz que representa el estado actual del tema en la aplicación.
 *
 * @interface ThemeState
 */
export interface ThemeState {
  /**
   * Indica si el modo oscuro está activado (`true`) o desactivado (`false`).
   *
   * @type {boolean}
   */
  isDark: boolean;

  /**
   * Nombre del modo actual. Ejemplos comunes: "light", "dark", "system".
   *
   * @type {string}
   */
  mode: string;
}
