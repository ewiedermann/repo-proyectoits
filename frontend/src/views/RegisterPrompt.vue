<template>
  <div class="container">
    <div class="register-prompt">
      <h2>¡Debes registrarte para jugar!</h2>
      <p>Regístrate o inicia sesión para acceder a la sección de juegos</p>

      <div class="button-container">
        <button @click="mostrarFormulario('login')">Iniciar Sesión</button>
        <button @click="mostrarFormulario('register')">Registrarse</button>
      </div>
      <div class="form-container">
        <LoginForm v-if="formularioActual === 'login'" />
        <RegisterForm v-if="formularioActual === 'register'" />
      </div>
    </div>
    <!--
      Si el usuario hace clic en "Iniciar Sesión", el método mostrarFormulario('login')
      cambia formularioActual a 'login', y el componente LoginForm se renderiza.
      Si el usuario hace clic en "Registrarse", formularioActual cambia a 'register',
      y RegisterForm se muestra. Mientras formularioActual sea null, no se muestra ningún formulario.
    -->
  </div>
</template>

<script>
/**
 * @fileoverview Vista que solicita al usuario registrarse o iniciar sesión antes de acceder a ciertas secciones del juego.
 * Muestra dinámicamente los formularios de login o registro según la interacción del usuario.
 *
 * @module views/RegisterPrompt
 */

import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';

export default {
  /**
   * Nombre del componente
   * @type {string}
   */
  name: 'RegisterPrompt',

  /**
   * Componentes hijos utilizados en esta vista
   * @type {Object}
   */
  components: {
    LoginForm,
    RegisterForm
  },

  /**
   * Datos reactivos del componente
   * @returns {Object}
   */
  data() {
    return {
      /**
       * Tipo de formulario actual a mostrar ('login' | 'register' | null)
       * @type {'login'|'register'|null}
       */
      formularioActual: null
    };
  },

  /**
   * Métodos disponibles en el componente
   */
  methods: {
    /**
     * Establece qué formulario se debe mostrar
     *
     * @param {'login'|'register'} tipo - El tipo de formulario a mostrar
     */
    mostrarFormulario(tipo) {
      this.formularioActual = tipo;
    }
  }
};
</script>

<style scoped>
/* Fondo con gif */
.container {
  background: url('https://media.giphy.com/media/mTrUbEjM1Agta/giphy.gif?cid=ecf05e47iniyxxi204okbux26a04cilv18ipw1aj7vvvewtb&ep=v1_gifs_search&rid=giphy.gif&ct=g') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-prompt {
  text-align: center;
  padding: 20px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: 23px;
  background: rgba(0, 0, 0, 0.466);
  border-radius: 10px;
  padding: 30px;
}
.register-prompt h2,p{
color:#fcff49;

}
button {
  background-color: #155335;
  color: #fff;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.9);
}

.form-container {
  margin-top: 20px;
}

.button-container {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}
</style>
