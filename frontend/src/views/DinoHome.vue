<template>
  <div class="container">
    <h1 class="text-3xl font-bold text-center mt-8">¡DINOSDEVS TE DA LA BIENVENIDA!</h1>
    <h2 class="text-xl text-center mt-4">¿Qué encontrarás?</h2>

    <!-- Cards -->
    <div class="feature-container flex flex-wrap justify-center gap-4 mt-4">
      <div class="card w-full sm:w-[45%] lg:w-[30%] aspect-square bg-green-800 rounded-xl shadow-lg transform transition-transform hover:scale-105">
        <div class="card-header text-white text-lg font-semibold p-4">🦕 <strong>Explora el Mundo Jurásico</strong></div>
        <div class="card-body text-gray-200 text-base p-4">
          Sumérgete en un mundo lleno de información emocionante sobre estos majestuosos reptiles prehistóricos.
        </div>
      </div>

      <div class="card w-full sm:w-[45%] lg:w-[30%] aspect-square bg-green-800 rounded-xl shadow-lg transform transition-transform hover:scale-105">
        <div class="card-header text-white text-lg font-semibold p-4">🦖 <strong>Juegos y Retos</strong></div>
        <div class="card-body text-gray-200 text-base p-4">
          Pon a prueba tu conocimiento en divertidos juegos y gana puntos.
        </div>
      </div>

      <div class="card w-full sm:w-[45%] lg:w-[30%] aspect-square bg-green-800 rounded-xl shadow-lg transform transition-transform hover:scale-105">
        <div class="card-header text-white text-lg font-semibold p-4">🔍 <strong>Realidad Aumentada</strong></div>
        <div class="card-body text-gray-200 text-base p-4">
          ¡Mira a los dinosaurios en 3D en tu propio espacio, como si estuvieran vivos!
        </div>
      </div>
    </div>

    <h2 class="text-xl font-semibold text-center mt-8">¿Listo para la aventura?</h2>

    <div class="button-container ">
      <button
        v-if="!isAuthenticated"
        @click="toggleLogin"
        class="btn-estilos"
      >
        Iniciar sesión
      </button>

      <button
        v-if="!isAuthenticated"
        @click="toggleRegister"
        class="btn-estilos bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700"
      >
        Registrarse
      </button>
    </div>

    <!-- Formularios -->
    <div>
      <LoginForm
        v-if="showLogin"
        @close="showLogin = false"
        class="mt-6"
      />
      <RegisterForm
        v-if="showRegister"
        @close="showRegister = false"
        class="mt-6"
      />
    </div>
  </div>
</template>

<script>
/**
 * @fileoverview Vista principal de la aplicación que muestra una introducción al juego,
 * botones para iniciar sesión o registrarse y formularios modales asociados.
 *
 * @module views/DinoHome
 */

import { ref } from 'vue'; // Importar ref para reactividad
import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';

export default {
  /**
   * Nombre del componente
   * @type {string}
   */
  name: 'DinoHome',

  /**
   * Componentes hijos utilizados en esta vista
   * @type {Object}
   */
  components: {
    LoginForm,
    RegisterForm,
  },

  setup() {
    /**
     * Indica si el formulario de inicio de sesión debe mostrarse
     * @type {import('vue').Ref<boolean>}
     */
    const showLogin = ref(false);

    /**
     * Indica si el formulario de registro debe mostrarse
     * @type {import('vue').Ref<boolean>}
     */
    const showRegister = ref(false);

    /**
     * Indica si el usuario está autenticado
     * @type {import('vue').Ref<boolean>}
     */
    const isAuthenticated = ref(false); // Valor para saber si el usuario está autenticado

    /**
     * Alterna la visibilidad del formulario de inicio de sesión
     */
    const toggleLogin = () => {
      showLogin.value = !showLogin.value;
      if (showLogin.value) {
        showRegister.value = false; // Cerrar Register si Login está activo
      }
    };

    /**
     * Alterna la visibilidad del formulario de registro
     */
    const toggleRegister = () => {
      showRegister.value = !showRegister.value;
      if (showRegister.value) {
        showLogin.value = false; // Cerrar Login si Register está activo
      }
    };

    /**
     * Simula el inicio de sesión del usuario
     */
    const login = () => {
      isAuthenticated.value = true;  // Marcar al usuario como autenticado
      showLogin.value = false; // Cerrar el formulario de Login si se inicia sesión
    };

    /**
     * Simula el cierre de sesión del usuario
     */
    const logout = () => {
      // Lógica para cerrar sesión
      isAuthenticated.value = false; // Marcar al usuario como no autenticado
    };

    return {
      showLogin,
      showRegister,
      toggleLogin,
      toggleRegister,
      login,
      logout,
      isAuthenticated,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('@/assets/fondoinicio.jpg') no-repeat center center;
  background-size: cover;
  padding: 40px;
  animation: fadeIn 1s ease-in;
  font-family: 'Raleway', sans-serif;
  text-align: center;
}

h1 {
  color: #f5fffb;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-shadow:rgb(0, 2, 1) 5px 5px 6px;
  animation: fadeIn 1s ease-in-out;
}

h2 {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  color: #e1ff74;
  font-size: 2.5rem;
  font-weight: 600;
  margin-top: 2rem;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
  text-shadow:rgba(0, 0, 0, 1) 5px 5px 6px;
}


.feature-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  animation: fadeIn 1.5s ease-in-out;
  overflow: hidden;
}

ul {
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.card {
  max-width: 90%;
  background: #fcf7d09d;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 4px 6px 18px rgba(0, 0, 0, 0.836);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-header {
  font-size: 1.3rem;
  color: #063b11;
  font-weight: 600;
}

.card-body {
  font-size: 1.1rem;
  color: #000000;
  margin-top: 0.5rem;
}

.button-container {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  justify-content: center;
}

.btn-estilos {
  background-color:#155335;
  color: #fff;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.897);
}

.btn-estilos:hover {
  background-color: #225c22;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2rem;
  }

  .btn-estilos {
    padding: 10px 20px;
    font-size: 1rem;
  }

  .feature-container {
    flex-direction: column;
    align-items: center;
  }

  .card {
    width: 90%;
  }
}
</style>
