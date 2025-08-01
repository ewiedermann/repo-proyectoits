<template>
<<<<<<< HEAD
  <div class="wrapper transition-ease-linear">
    <header>
      <img alt="Dinos Devs Logo" class="logo" src="@/assets/logoDinosDevs.png" width="160" height="160" />
       
      <!-- Botón hamburguesa -->
      <button class="menu-toggle" @click="toggleMenu">☰</button>
       
      <!-- Menú de navegación -->
      <nav :class="{ open: isMenuOpen }">
        <RouterLink to="/" @click="toggleMenu">Home</RouterLink>
        <RouterLink to="/informacion" @click="toggleMenu">Información</RouterLink>
        <RouterLink to="/juegos" @click="toggleMenu">Juegos</RouterLink>
      </nav>
    </header>
     
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
/* Base styles */
.wrapper {
  width: 100%;
  min-height: 100vh;
}

.wrapper.dark {
  background: #434343;
  min-height: 100vh;
}

/* Header responsivo */
=======
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

>>>>>>> qa1
header {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #172c10;
<<<<<<< HEAD
  padding: 0 clamp(1rem, 3vw, 2rem);
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* Logo responsivo */
.logo {
  margin-left: clamp(10px, 2vw, 20px);
  width: clamp(80px, 15vw, 160px);
  height: auto;
  max-width: 160px;
  flex-shrink: 0;
}

/* Botón hamburguesa */
.menu-toggle {
  background: none;
  border: none;
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #218f24;
  display: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.menu-toggle:hover {
  background-color: rgba(33, 143, 36, 0.1);
}

/* Navegación */
nav {
  font-size: clamp(18px, 3vw, 25px);
  text-align: right;
  margin-top: 2rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  align-items: center;
=======
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
>>>>>>> qa1
}

nav a {
  display: inline-block;
<<<<<<< HEAD
  padding: clamp(0.3rem, 1vw, 1rem);
  text-decoration: none;
  color: rgba(33, 143, 36, 0.986);
  transition: color 0.3s ease;
  white-space: nowrap;
  border-radius: 4px;
=======
  padding: 0 1rem;
  text-decoration: none;
  color: rgba(33, 143, 36, 0.986);
>>>>>>> qa1
}

nav a:hover {
  cursor: url('src/assets/garra2.png'), default;
<<<<<<< HEAD
  color: #4ade80;
  background-color: rgba(33, 143, 36, 0.1);
=======
>>>>>>> qa1
}

nav a.router-link-exact-active {
  color: rgb(197, 188, 57);
<<<<<<< HEAD
  background-color: rgba(197, 188, 57, 0.1);
}

/* Tablets grandes y desktop pequeño */
@media (max-width: 1024px) {
  nav {
    font-size: clamp(16px, 2.5vw, 22px);
    gap: clamp(0.3rem, 1.5vw, 0.8rem);
  }
  
  nav a {
    padding: clamp(0.2rem, 0.8vw, 0.8rem);
  }
}

/* Tablets */
@media (max-width: 768px) {
  header {
    height: clamp(100px, 15vw, 130px);
    padding: 0 clamp(0.5rem, 2vw, 1rem);
  }
  
  .menu-toggle {
    display: block;
    z-index: 1001;
  }
   
  nav {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: clamp(10px, 3vw, 20px);
    width: clamp(200px, 50vw, 300px);
    background-color: #fcfffaec;
    text-align: center;
    padding: clamp(0.5rem, 2vw, 1rem) 0;
    margin-top: 0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    gap: 0;
  }
   
  nav.open {
    display: flex;
  }
  
  nav a {
    display: block;
    width: 100%;
    padding: clamp(0.8rem, 3vw, 1rem);
    margin: 0;
    color: #172c10;
    font-size: clamp(16px, 4vw, 20px);
    border-bottom: 1px solid rgba(23, 44, 16, 0.1);
  }
  
  nav a:last-child {
    border-bottom: none;
  }
  
  nav a:hover {
    background-color: rgba(33, 143, 36, 0.1);
    color: #218f24;
  }
  
  nav a.router-link-exact-active {
    color: rgb(197, 188, 57);
    background-color: rgba(197, 188, 57, 0.15);
  }
}

/* Móviles */
@media (max-width: 480px) {
  header {
    height: clamp(80px, 18vw, 110px);
    padding: 0 clamp(0.5rem, 3vw, 1rem);
  }
  
  .logo {
    margin-left: clamp(5px, 2vw, 10px);
    width: clamp(60px, 18vw, 100px);
  }
  
  .menu-toggle {
    font-size: clamp(1.2rem, 5vw, 1.8rem);
    padding: clamp(0.3rem, 1vw, 0.5rem);
  }
  
  nav {
    right: clamp(5px, 2vw, 15px);
    width: clamp(180px, 60vw, 250px);
    padding: clamp(0.5rem, 3vw, 1rem) 0;
  }
  
  nav a {
    font-size: clamp(14px, 4.5vw, 18px);
    padding: clamp(0.6rem, 3vw, 1rem);
  }
}

/* Móviles muy pequeños */
@media (max-width: 320px) {
  header {
    height: clamp(70px, 20vw, 90px);
    padding: 0 0.5rem;
  }
  
  .logo {
    width: clamp(50px, 20vw, 80px);
    margin-left: 5px;
  }
  
  nav {
    width: clamp(160px, 70vw, 200px);
    right: 5px;
  }
  
  nav a {
    font-size: clamp(12px, 5vw, 16px);
    padding: clamp(0.5rem, 3vw, 0.8rem);
  }
}

/* Landscape en móviles */
@media (max-height: 500px) and (orientation: landscape) {
  header {
    height: clamp(60px, 12vh, 90px);
  }
  
  .logo {
    width: clamp(40px, 10vh, 80px);
  }
  
  nav {
    top: 100%;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  nav a {
    padding: clamp(0.4rem, 2vh, 0.8rem);
  }
}

/* Asegurar que el contenido no se desborde */
* {
  box-sizing: border-box;
}

/* Prevenir scroll horizontal */
html, body {
  overflow-x: hidden;
  width: 100%;
}

/* Transiciones suaves para cambios de tamaño */
.logo, nav, nav a, .menu-toggle {
  transition: all 0.3s ease;
}

/* Asegurar que el menú se cierre al hacer click fuera (opcional) */
@media (max-width: 768px) {
  .wrapper {
    position: relative;
  }
}
</style>
=======
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
>>>>>>> qa1
