<template>
  <div class="contenedor">
    <h2>Menú de Dinosaurios</h2>
    <router-link to="/juegos">Juegos</router-link>
    <router-link to="/informacion">Información de Dinosaurios</router-link>
    <router-link to="/realidad-aumentada">Realidad Aumentada</router-link>
  </div>
</template>

<script>
/**
 * @fileoverview Vista del menú principal que permite navegar entre las diferentes secciones del juego.
 * Contiene enlaces a juegos, información y realidad aumentada.
 *
 * @module views/DinoMenu
 */

export default {
  /**
   * Nombre del componente
   * @type {string}
   */
  name: 'DinoMenu',
};
</script>

<style scoped>
.contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}

a {
  display: block;
  margin: 10px 0;
  font-size: 1.2rem;
  color: #2e4d3d;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

a:hover {
  background-color: #2e4d3d;
  color: #f0ead2;
}
</style>
