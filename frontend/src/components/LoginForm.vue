<template>
  <div class="container-form">
    <h2>Accede a tu cuenta</h2>
    <form @submit.prevent="handleLogin">
      <div class="input-login-form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button  type="submit">Ingresar🦖 </button>

    </div>

    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    /**
     * Correo electrónico del usuario ingresado en el formulario.
     * @type {import('vue').Ref<string>}
     */
    const email = ref('');

    /**
     * Contraseña ingresada por el usuario.
     * @type {import('vue').Ref<string>}
     */
    const password = ref('');

    /**
     * Store de usuario para gestionar autenticación.
     */
    const userStore = useUserStore();

    /**
     * Instancia del enrutador de Vue Router.
     */
    const router = useRouter();  // Inicializa el enrutador

    /**
     * Función que maneja el proceso de login del usuario.
     * Llama al store para autenticar y redirige en caso de éxito.
     * Muestra un mensaje de error si falla la autenticación.
     * @returns {Promise<void>}
     */
    const handleLogin = async () => {
      const response = await userStore.loginUser({ email: email.value, password: password.value });

      if (response.success) {
        alert('Inicio de sesión exitoso');
        router.push('/juegos'); // Redirigir después del login
      } else {
        alert(response.message); // Muestra el mensaje de error correctamente
      }
    };

    return { email, password, handleLogin };
  }
};
</script>

<style scoped>

.container-form{
  margin-top: 25px;
  background-color: #33633d6c;
  padding: 25px;
  border-radius: 12px;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: rgb(255, 255, 255);
}

form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
}

input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem;
  font-size: 17px;
  background-color: #2f462f;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.897);
}

button:hover {
  background-color: #2e5a2e;
  padding: 10px;
}
</style>
