<!-- Conectado correctamente con userStore para registrar usuarios. -->
<template>
  <div class="container-form">
    <h2>¿No tenes cuenta? ¡Registrate!</h2>
    <form @submit.prevent="handleRegister">
      <div class="input-login-form">
        <input v-model="name" type="text" placeholder="Name" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Registrate 🦖</button>
      </div>
    </form>
  </div>
</template>

<script>
/**
 * Componente Vue para el registro de nuevos usuarios.
 * Utiliza el store `useUserStore` para manejar la lógica de registro.
 */
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

export default {
  setup() {
    /**
     * Referencia reactiva para el nombre del usuario
     * @type {import('vue').Ref<string>}
     */
    const name = ref('');

    /**
     * Referencia reactiva para el correo electrónico del usuario
     * @type {import('vue').Ref<string>}
     */
    const email = ref('');

    /**
     * Referencia reactiva para la contraseña del usuario
     * @type {import('vue').Ref<string>}
     */
    const password = ref('');

    /**
     * Instancia del store de usuario para manejar el registro
     * @type {ReturnType<typeof useUserStore>}
     */
    const userStore = useUserStore();

    /**
     * Manejador para el evento de registro de usuario.
     * Llama al método del store y muestra un mensaje de éxito o error.
     * @async
     * @returns {Promise<void>}
     */
    const handleRegister = async () => {
      try {
        await userStore.registerUser({ name: name.value, email: email.value, password: password.value });
        alert('Registro exitoso');
      } catch (error) {
        console.error('Error al registrar usuario:', error);
      }
    };

    return { name, email, password, handleRegister };
  }
};
</script>

<style scoped>
.container-form {
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
  width: 150px;
  font-size: 17px;
  background-color: #2f462f;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.897);
  align-items: center;
}

button:hover {
  background-color: #2e5a2e;
  padding: 10px;
}
</style>
