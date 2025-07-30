<!-- frontend/src/views/CallbackPage.vue - Versión simplificada -->
<template>
  <div class="callback-container">
    <div class="callback-content">
      <div class="loading-spinner"></div>
      <h2>{{ loadingMessage }}</h2>
      <p>{{ subMessage }}</p>
      
      <!-- Botón de emergencia -->
      <div v-if="showEmergencyButton" class="emergency-section">
        <button @click="emergencyRedirect" class="emergency-btn">
          🏠 Volver al Inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { isAuthenticated, user, handleRedirectCallback } = useAuth0();

const loadingMessage = ref('Procesando autenticación...');
const subMessage = ref('Un momento por favor');
const showEmergencyButton = ref(false);

function emergencyRedirect() {
  // Limpiar todo y volver al inicio
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/';
}

onMounted(async () => {
  try {
    console.log('🔍 Iniciando callback...');
    console.log('Query params:', route.query);

    // Verificar si hay error en la URL
    if (route.query.error) {
      throw new Error(`Auth0 Error: ${route.query.error}`);
    }

    // Verificar parámetros básicos
    if (!route.query.code) {
      throw new Error('Código de autorización faltante');
    }

    loadingMessage.value = 'Verificando con Auth0...';
    
    // Intentar callback simple SIN parámetros adicionales
    await handleRedirectCallback();
    
    console.log('✅ Callback exitoso');
    
    // Esperar a que se actualice el estado
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (isAuthenticated.value) {
      loadingMessage.value = '¡Autenticación exitosa!';
      
      // Redirigir directamente a juegos (sin verificar email por ahora)
      subMessage.value = 'Redirigiendo a juegos...';
      setTimeout(() => {
        router.replace('/juegos');
      }, 1500);
    } else {
      throw new Error('No se pudo autenticar');
    }
    
  } catch (error) {
    console.error('❌ Error en callback:', error);
    
    loadingMessage.value = 'Error en la autenticación';
    subMessage.value = 'No se pudo completar el proceso de login';
    showEmergencyButton.value = true;
    
    // Auto-redirect después de 5 segundos
    setTimeout(() => {
      emergencyRedirect();
    }, 5000);
  }
});
</script>

<style scoped>
.callback-container {
  background: url('@/assets/fondoinicio.jpg') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.callback-content {
  text-align: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  color: #fff;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #4ade80;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #4ade80;
}

p {
  font-size: 1rem;
  color: #e5e7eb;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.emergency-section {
  margin-top: 30px;
}

.emergency-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.emergency-btn:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: translateY(-2px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .callback-content {
    padding: 30px 20px;
  }
  
  h2 {
    font-size: 1.3rem;
  }
  
  p {
    font-size: 0.9rem;
  }
}
</style>