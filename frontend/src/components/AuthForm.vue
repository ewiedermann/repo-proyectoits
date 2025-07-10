<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

/**
 * Datos reactivos del formulario de inicio de sesión.
 * @type {{ username: string, password: string }}
 */
const form = reactive({
  username: '',
  password: ''
})

/**
 * Store de autenticación proporcionado por Pinia.
 */
const authStore = useAuthStore()

/**
 * Instancia del enrutador de Vue Router.
 */
const router = useRouter()

/**
 * Maneja el envío del formulario de inicio de sesión.
 * Si los campos están completos, simula el inicio de sesión
 * y redirige al usuario a la ruta '/juegos'. Si faltan datos,
 * se muestra un error en la consola.
 */
const handleSubmit = () => {
  // Simular la lógica de inicio de sesión
  if (form.username && form.password) {
    console.log('Iniciar sesión con:', form.username, form.password)
    authStore.login(form.username) // Inicia sesión usando Pinia
    router.push('/juegos') // Redirige a /juegos
  } else {
    //Mostrar un mensaje de error si falta alguna credencial
    console.error('Por favor, ingresa tu usuario y contraseña.')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input type="text" placeholder="Usuario" v-model="form.username" />
    <input type="password" placeholder="Contraseña" v-model="form.password" />
    <button type="submit" class="btn-estilos">Iniciar Sesión</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn-estilos {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
