<template>
  <!-- Para cambiar de MODO CLARO/OSCURO
  <div :class="{'dark': themeStore.isDark}" class="wrapper transition-ease-linear">
    <div class="btn-wrapper">
      <div class="toggle-btn">
        <label for="toggle" class="toggle-label">
          <div class="relative">
            <input @click="changeTheme" type="checkbox" id="toggle" class="sr-only" />
            <div class="toggle-bg"></div>
            <div class="dot">
              <MoonIcon v-if="!themeStore.isDark" class="moon-icon" />
              <SunIcon v-if="themeStore.isDark" class="sun-icon" />
            </div>
          </div>
        </label>
      </div>
    </div>
-->
  <header>
    <img alt="Dinos Devs Logo" class="logo" src="@/assets/logoDinosDevs.png" width="160" height="160" />

    <button class="menu-toggle" @click="toggleMenu">☰</button> <!-- menu hamburguesa -->

    <!--nav tiene una clase dinámica :class="{'open': isMenuOpen}", si isMenuOpen es true, se le añade la clase open, haciendo visible el menú
    Cuando se hace clic en cualquier enlace del menú, también se ejecuta toggleMenu(), cerrando el menú después de la navegación. -->
    <nav :class="{'open': isMenuOpen}">
      <RouterLink to="/" @click="toggleMenu">Home</RouterLink>
      <RouterLink to="/informacion" @click="toggleMenu">Información</RouterLink>
      <RouterLink to="/juegos" @click="toggleMenu">Juegos</RouterLink>
      <!--         reincorporar en su debido tiempo-->
      <!-- <RouterLink to="/realidad-aumentada" @click="toggleMenu">Realidad Aumentada</RouterLink>  -->
    </nav>
  </header>

  <RouterView />
</template>

<script setup>
/* Ambos son componentes de Vue Router, utilizados para manejar la navegación en la aplicación. */
import { RouterLink, RouterView } from 'vue-router';
import { reactive, ref } from 'vue'; /* permiten manejar estados reactivos. */

/**
 * Estado reactivo que controla la visibilidad del menú lateral/hamburguesa.
 * @type {import('vue').Ref<boolean>}
 */
const isMenuOpen = ref(false);

/**
 * Alterna el estado del menú entre abierto y cerrado.
 * Se llama cuando se hace clic en el botón hamburguesa o en un enlace del menú.
 *
 * @function toggleMenu
 * @returns {void}
 */
function toggleMenu() {
  // isMenuOpen.value agarra el valor que definimos en este caso falso e invierte su valor y se actualiza con ese valor
  isMenuOpen.value = !isMenuOpen.value;
}

/* PARA HACER EL CAMBIO DE TEMA EN LA PAGINA (MODO CLARO/OSCURO)
import { useThemeStore } from './stores/ThemeStore';
import { MoonIcon, SunIcon } from '@heroicons/vue/24/solid';

// Instanciar useThemeStore
const themeStore = useThemeStore();
// Crear variable reactiva con objeto useStore
const theme = reactive(themeStore);
function changeTheme() {
  themeStore.cambioDeTema();
}
*/
</script>

<style scoped>
.wrapper.dark {
  background: #434343;
}

.btn-wrapper {
  position: absolute;
  right: 1px;
}

input:checked ~ .dot {
  transform: translateX(1.5rem);
  background-color: rgb(77, 148, 255);
}

.label-text {
  color: black;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.label-text.dark {
  color: white;
}

.todo {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

header {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #172c10;
}

.logo {
  display: block;
  margin-left: 20px;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 2rem;
  display: none;
  cursor: pointer;
}

nav {
  font-size: 25px;
  text-align: right;
  margin-top: 2rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  text-decoration: none;
  color: rgba(33, 143, 36, 0.986);
}

nav a:hover {
  cursor: url('src/assets/garra2.png'), default;
}

nav a.router-link-exact-active {
  color: rgb(197, 188, 57);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  nav {
    color: black;
    display: none;
    flex-direction: column;
    position: absolute;
    top: 70px;
    right: 0;
    width: 50%;
    background-color: #fcfffaec;
    text-align: center;
    padding: 1rem 0;
    margin-right: 20px;
  }

  nav.open {
    display: flex;
  }
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
  margin-right: 30px;
}

.toggle-label {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-bg {
  width: 3.5rem;
  height: 2rem;
  background-color: #2a2b2a;
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.3s ease;
}

.dot {
  position: absolute;
  left: 1.25rem;
  top: 1.2rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: rgb(0, 0, 0);
  border-radius: 9999px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.moon-icon {
  width: 1rem;
  height: 1.5rem;
  color: white;
}

.sun-icon {
  width: 1.5rem;
  height: 1.4rem;
  color: #fbbf24;
}

.sr-only {
  display: none;
}
</style>
