<template>
  <div class="container">
    <h1 class="text-3xl font-bold text-center mt-8">¡DINOSDEVS TE DA LA BIENVENIDA!</h1>
    <h2 class="text-xl text-center mt-4">¿Qué encontrarás?</h2>

    <!-- Cards -->
    <div class="feature-container flex flex-wrap justify-center gap-4 mt-4">
<<<<<<< HEAD
      <!-- Card 1 -->
=======
>>>>>>> qa1
      <div class="card w-full sm:w-[45%] lg:w-[30%] aspect-square bg-green-800 rounded-xl shadow-lg transform transition-transform hover:scale-105">
        <div class="card-header text-white text-lg font-semibold p-4">🦕 <strong>Explora el Mundo Jurásico</strong></div>
        <div class="card-body text-gray-200 text-base p-4">
          Sumérgete en un mundo lleno de información emocionante sobre estos majestuosos reptiles prehistóricos.
        </div>
      </div>
<<<<<<< HEAD
      <!-- Card 2 -->
=======

>>>>>>> qa1
      <div class="card w-full sm:w-[45%] lg:w-[30%] aspect-square bg-green-800 rounded-xl shadow-lg transform transition-transform hover:scale-105">
        <div class="card-header text-white text-lg font-semibold p-4">🦖 <strong>Juegos y Retos</strong></div>
        <div class="card-body text-gray-200 text-base p-4">
          Pon a prueba tu conocimiento en divertidos juegos y gana puntos.
        </div>
      </div>
<<<<<<< HEAD
      <!-- Card 3 -->
=======

>>>>>>> qa1
      <div class="card w-full sm:w-[45%] lg:w-[30%] aspect-square bg-green-800 rounded-xl shadow-lg transform transition-transform hover:scale-105">
        <div class="card-header text-white text-lg font-semibold p-4">🔍 <strong>Realidad Aumentada</strong></div>
        <div class="card-body text-gray-200 text-base p-4">
          ¡Mira a los dinosaurios en 3D en tu propio espacio, como si estuvieran vivos!
        </div>
      </div>
    </div>

    <h2 class="text-xl font-semibold text-center mt-8">¿Listo para la aventura?</h2>

<<<<<<< HEAD
    <!-- Botones principales -->
    <div class="button-container">
      <!-- Si el usuario está autenticado y email verificado -->
      <template v-if="isAuthenticated && isEmailVerified">
        <button
          class="btn-estilos btn-primary"
          @click="irAJuegos"
        >
          🎮 Jugar
        </button>
        <button
          @click="handleLogout"
          class="btn-estilos btn-logout"
        >
          🚪 Cerrar sesión
        </button>
      </template>
      
      <!-- Si el usuario está autenticado pero email NO verificado -->
      <template v-else-if="isAuthenticated && !isEmailVerified">
        <div class="email-verification-notice">
          <div class="notice-content">
            <i class="fas fa-envelope-open-text"></i>
            <h3>¡Verifica tu email!</h3>
            <p>Para acceder a los juegos, necesitas verificar tu dirección de email.</p>
            <button
              @click="goToEmailVerification"
              class="btn-estilos btn-verify"
            >
              ✉️ Verificar Email
            </button>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="btn-estilos btn-logout"
        >
          🚪 Cerrar sesión
        </button>
      </template>
      
      <!-- Si el usuario NO está autenticado -->
      <template v-else>
        <button
          @click="handleLogin"
          class="btn-estilos btn-login"
        >
          🦖 Iniciar Sesión
        </button>
        <button
          @click="handleSignup"
          class="btn-estilos btn-signup"
        >
          🌟 Registrarse
        </button>
      </template>
=======
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
>>>>>>> qa1
    </div>
  </div>
</template>

<<<<<<< HEAD
<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

// Computed para verificar si el email está verificado
const isEmailVerified = computed(() => {
  return user.value?.email_verified || false
})

function irAJuegos() {
  // Esta función ahora es segura porque solo se muestra cuando el email está verificado
  router.push('/juegos')
}

function goToEmailVerification() {
  router.push('/register-prompt')
}

// FUNCIONES CORREGIDAS
function handleLogin() {
  loginWithRedirect({ 
    authorizationParams: { 
      redirect_uri: `${window.location.origin}/callback` // CORRECCIÓN
    } 
  })
}

function handleSignup() {
  loginWithRedirect({ 
    authorizationParams: { 
      screen_hint: 'signup',
      redirect_uri: `${window.location.origin}/callback` // CORRECCIÓN
    } 
  })
}

// Función handleLogout corregida
async function handleLogout() {
  try {
    // Mostrar indicador de carga (opcional)
    const loadingElement = document.createElement('div');
    loadingElement.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Raleway', sans-serif;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        ">
          <div style="
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #155335;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
          "></div>
          <p style="color: #333; font-size: 16px; margin: 0;">Cerrando sesión...</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loadingElement);

    // Esperar un momento para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 500));

    // Realizar logout con URL corregida
    await logout({ 
      logoutParams: {
        returnTo: window.location.origin // CORRECCIÓN
      }
    });

  } catch (error) {
    console.error('Error durante el logout:', error);
    
    // Remover loading si existe
    const loading = document.querySelector('div[style*="position: fixed"]');
    if (loading && loading.parentNode) {
      loading.parentNode.removeChild(loading);
    }
    
    // Fallback: redirigir manualmente
    window.location.href = window.location.origin; // CORRECCIÓN
  }
}

defineProps()
=======
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
>>>>>>> qa1
</script>

<style scoped>
.container {
<<<<<<< HEAD
  min-height: 100vh;
  width: 100%;
  max-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('@/assets/fondoinicio.jpg') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  padding: 2rem 1rem;
  animation: fadeIn 1s ease-in;
  font-family: 'Raleway', sans-serif;
  text-align: center;
  margin: 0;
  box-sizing: border-box;
}

.feature-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeIn 1.5s ease-in-out;
  width: 100%;
  max-width: 1200px;
  flex-wrap: wrap;
}

.card {
  flex: 1 1 300px;
  min-width: 280px;
  max-width: 350px;
=======
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
>>>>>>> qa1
  background: #fcf7d09d;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 4px 6px 18px rgba(0, 0, 0, 0.836);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
<<<<<<< HEAD
  box-sizing: border-box;
=======
>>>>>>> qa1
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
<<<<<<< HEAD
  gap: 1.5rem;
  margin-top: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 600px;
  flex-direction: column;
  align-items: center;
}

.email-verification-notice {
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
  max-width: 400px;
  width: 100%;
}

.notice-content {
  text-align: center;
}

.notice-content i {
  font-size: 2.5rem;
  color: #60a5fa;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.notice-content h3 {
  color: #dbeafe;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.notice-content p {
  color: #bfdbfe;
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.4;
}

.btn-estilos {
  border: none;
  padding: 14px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  min-width: 160px;
  max-width: 280px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-estilos::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-estilos:hover::before {
  left: 100%;
}

.btn-estilos:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.btn-estilos:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Botón primario - Jugar */
.btn-primary {
  background: linear-gradient(135deg, #155335, #1d6b3b);
  color: #fff;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1d6b3b, #225c22);
}

/* Botón de Login */
.btn-login {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
}

.btn-login:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
}

/* Botón de Signup */
.btn-signup {
  background: linear-gradient(135deg, #059669, #047857);
  color: #fff;
}

.btn-signup:hover {
  background: linear-gradient(135deg, #047857, #065f46);
}

/* Botón de verificación */
.btn-verify {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  margin-top: 0.5rem;
}

.btn-verify:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

/* Botón de Logout */
.btn-logout {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
}

.btn-logout:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive breakpoints */
@media (max-width: 1024px) {
  .container {
    padding: 1.5rem 1rem;
  }
  
  .feature-container {
    gap: 1rem;
  }
  
  .card {
    min-width: 250px;
=======
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
>>>>>>> qa1
  }
}

@media (max-width: 768px) {
<<<<<<< HEAD
  .container {
    padding: 1rem 0.5rem;
    background-attachment: scroll;
  }
  
  h1 {
    font-size: 1.8rem !important;
    margin-top: 1rem !important;
    padding: 0 1rem;
  }
  
  h2 {
    font-size: 1.2rem !important;
    padding: 0 1rem;
  }
  
  .feature-container {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .card {
    width: 100%;
    max-width: 400px;
    min-width: auto;
  }
  
  .card-header {
    font-size: 1.1rem;
  }
  
  .card-body {
    font-size: 1rem;
  }
  
  .button-container {
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .email-verification-notice {
    max-width: 100%;
    margin-bottom: 1rem;
  }
  
  .btn-estilos {
    width: 100%;
    max-width: 300px;
    min-width: auto;
    padding: 12px 24px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 1rem 0.25rem;
    min-height: 100vh;
  }
  
  h1 {
    font-size: 1.5rem !important;
    line-height: 1.3;
  }
  
  h2 {
    font-size: 1.1rem !important;
  }
  
  .card {
    padding: 12px;
    max-width: 100%;
  }
  
  .card-header {
    font-size: 1rem;
    padding: 8px 0;
  }
  
  .card-body {
    font-size: 0.9rem;
    padding: 8px 0;
  }
  
  .email-verification-notice {
    padding: 15px;
  }
  
  .notice-content h3 {
    font-size: 1.2rem;
  }
  
  .notice-content p {
    font-size: 0.9rem;
  }
  
  .btn-estilos {
    font-size: 1rem;
    padding: 10px 20px;
    max-width: 100%;
  }
}

@media (max-width: 320px) {
  .container {
    padding: 0.5rem 0.25rem;
  }
  
  h1 {
    font-size: 1.3rem !important;
  }
  
  .card {
    padding: 10px;
  }
  
  .email-verification-notice {
    padding: 12px;
  }
  
  .notice-content h3 {
    font-size: 1.1rem;
  }
  
  .notice-content p {
    font-size: 0.8rem;
  }
  
  .btn-estilos {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}
</style>
=======
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
>>>>>>> qa1
