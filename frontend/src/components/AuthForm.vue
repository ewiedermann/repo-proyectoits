<!-- frontend/src/components/AuthForm.vue - Actualizado con validación de edad -->
<template>
  <div class="auth-container">
    <div class="auth-form-wrapper">
      <h2 class="auth-title">
        {{ isLogin ? '🦖 Iniciar Sesión' : '🌟 Registrarse en DinosDev' }}
      </h2>
      
      <!-- Alternador entre Login y Registro -->
      <div class="mode-toggle">
        <button 
          @click="isLogin = true" 
          :class="{ active: isLogin }"
          class="toggle-btn"
        >
          Iniciar Sesión
        </button>
        <button 
          @click="isLogin = false" 
          :class="{ active: !isLogin }"
          class="toggle-btn"
        >
          Registrarse
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Campos para registro -->
        <div v-if="!isLogin" class="form-group">
          <label for="nombre">Nombre completo *</label>
          <input
            id="nombre"
            type="text"
            v-model="form.nombre"
            placeholder="Tu nombre completo"
            required
            class="form-input"
          />
        </div>

        <!-- Email (común para ambos) -->
        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            placeholder="tu@email.com"
            required
            class="form-input"
          />
        </div>

        <!-- Contraseña (común para ambos) -->
        <div class="form-group">
          <label for="password">Contraseña *</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            placeholder="Tu contraseña"
            required
            class="form-input"
          />
        </div>

        <!-- Edad (solo para registro) -->
        <div v-if="!isLogin" class="form-group">
          <label for="edad">Edad *</label>
          <input
            id="edad"
            type="number"
            v-model.number="form.edad"
            placeholder="Tu edad"
            min="1"
            max="120"
            required
            class="form-input"
            @input="handleAgeChange"
          />
          <small class="form-hint">
            Esta información es necesaria para cumplir con nuestras políticas de privacidad
          </small>
        </div>

        <!-- Aviso para menores de 14 años -->
        <div v-if="!isLogin && form.edad && form.edad < 14" class="age-warning">
          <div class="warning-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h4>¡Atención! Menor de 14 años</h4>
            <p>
              Según nuestra política de privacidad, los menores de 14 años requieren 
              autorización expresa de sus padres o tutores legales.
            </p>
          </div>

          <!-- Checkbox de autorización parental -->
          <div class="form-group parental-consent">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="form.autorizacionParental"
                required
              />
              <span class="checkmark"></span>
              Confirmo que tengo autorización de mis padres/tutores para registrarme
            </label>
          </div>

          <!-- Email del tutor -->
          <div class="form-group">
            <label for="emailTutor">Email del padre/tutor *</label>
            <input
              id="emailTutor"
              type="email"
              v-model="form.emailTutor"
              placeholder="email@deltutor.com"
              required
              class="form-input"
            />
            <small class="form-hint">
              Este email se usará para confirmar la autorización parental
            </small>
          </div>
        </div>

        <!-- Aviso para adolescentes (14-17 años) -->
        <div v-if="!isLogin && form.edad && form.edad >= 14 && form.edad < 18" class="age-info">
          <div class="info-content">
            <i class="fas fa-info-circle"></i>
            <p>
              Como menor de 18 años, velaremos por el uso adecuado de tus datos personales, 
              respetando siempre tu privacidad y derechos fundamentales.
            </p>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorMessage }}
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="success-message">
          <i class="fas fa-check-circle"></i>
          {{ successMessage }}
        </div>

        <!-- Botón de envío -->
        <button 
          type="submit" 
          class="submit-btn"
          :disabled="isLoading || (!isLogin && !isFormValid)"
        >
          <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
          <i v-else-if="isLogin" class="fas fa-sign-in-alt"></i>
          <i v-else class="fas fa-user-plus"></i>
          {{ isLoading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse') }}
        </button>
      </form>

      <!-- Política de privacidad -->
      <div v-if="!isLogin" class="privacy-notice">
        <p>
          <small>
            Al registrarte, aceptas nuestra 
            <a href="/politica-privacidad" target="_blank">Política de Privacidad</a>
            y nuestros 
            <a href="/terminos" target="_blank">Términos y Condiciones</a>.
          </small>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Estados reactivos
const isLogin = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  nombre: '',
  email: '',
  password: '',
  edad: null,
  autorizacionParental: false,
  emailTutor: ''
})

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Computed para validar el formulario
const isFormValid = computed(() => {
  if (isLogin.value) {
    return form.email && form.password
  }
  
  // Validaciones para registro
  const basicValid = form.nombre && form.email && form.password && form.edad
  
  if (!basicValid) return false
  
  // Si es menor de 14, requiere autorización parental y email del tutor
  if (form.edad < 14) {
    return form.autorizacionParental && form.emailTutor
  }
  
  return true
})

// Manejar cambio de edad
const handleAgeChange = () => {
  // Limpiar campos de autorización parental si ya no es menor de 14
  if (form.edad >= 14) {
    form.autorizacionParental = false
    form.emailTutor = ''
  }
  clearMessages()
}

// Limpiar mensajes
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

// Manejar envío del formulario
const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  clearMessages()
  isLoading.value = true
  
  try {
    if (isLogin.value) {
      await handleLogin()
    } else {
      await handleRegister()
    }
  } catch (error) {
    console.error('Error en formulario:', error)
    errorMessage.value = error.message || 'Ocurrió un error inesperado'
  } finally {
    isLoading.value = false
  }
}

// Manejar login
const handleLogin = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en el login')
    }
    
    // Guardar token en localStorage (temporal, podrías usar un store)
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user_info', JSON.stringify(data.user))
    
    successMessage.value = '¡Login exitoso! Redirigiendo...'
    
    // Redirigir según el grupo de edad
    setTimeout(() => {
      if (data.user.ageGroup === 'child') {
        router.push('/supervision-required')
      } else {
        router.push('/juegos')
      }
    }, 1500)
    
  } catch (error) {
    throw new Error(error.message || 'Error en el login')
  }
}

// Manejar registro
const handleRegister = async () => {
  try {
    const registerData = {
      nombre: form.nombre,
      email: form.email,
      edad: form.edad
    }
    
    // Agregar campos de autorización parental si es menor de 14
    if (form.edad < 14) {
      registerData.autorizacionParental = form.autorizacionParental
      registerData.emailTutor = form.emailTutor
    }
    
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro')
    }
    
    successMessage.value = data.message
    
    // Mostrar mensaje específico según la edad
    if (data.requiresParentalConsent) {
      successMessage.value += ' Se ha enviado un email de confirmación al tutor.'
    }
    
    successMessage.value += ' Por favor, verifica tu email para continuar.'
    
    // Cambiar a modo login después de un registro exitoso
    setTimeout(() => {
      resetForm()
      isLogin.value = true
    }, 3000)
    
  } catch (error) {
    throw new Error(error.message || 'Error en el registro')
  }
}

// Resetear formulario
const resetForm = () => {
  Object.assign(form, {
    nombre: '',
    email: '',
    password: '',
    edad: null,
    autorizacionParental: false,
    emailTutor: ''
  })
  clearMessages()
}

// Limpiar mensajes cuando cambia el modo
const toggleMode = (mode) => {
  isLogin.value = mode
  clearMessages()
  if (mode) {
    // Si cambia a login, limpiar campos específicos de registro
    form.nombre = ''
    form.edad = null
    form.autorizacionParental = false
    form.emailTutor = ''
  }
}
</script>

<style scoped>
.auth-container {
  background: url('@/assets/fondoinicio.jpg') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Raleway', sans-serif;
}

.auth-form-wrapper {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-title {
  text-align: center;
  color: #4ade80;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.mode-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 2rem;
  backdrop-filter: blur(5px);
}

.toggle-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: #d1d5db;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #155335, #1d6b3b);
  color: white;
  box-shadow: 0 4px 12px rgba(21, 83, 53, 0.4);
}

.toggle-btn:not(.active):hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e5e7eb;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.form-input:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
  background: rgba(255, 255, 255, 0.15);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-hint {
  color: #9ca3af;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.age-warning {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.warning-content {
  text-align: center;
  margin-bottom: 1.5rem;
}

.warning-content i {
  font-size: 2rem;
  color: #fbbf24;
  margin-bottom: 0.5rem;
}

.warning-content h4 {
  color: #fbbf24;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.warning-content p {
  color: #fde68a;
  line-height: 1.5;
  font-size: 0.9rem;
}

.age-info {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
}

.info-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-content i {
  color: #60a5fa;
  font-size: 1.2rem;
  margin-top: 0.1rem;
}

.info-content p {
  color: #bfdbfe;
  line-height: 1.4;
  font-size: 0.9rem;
  margin: 0;
}

.parental-consent {
  margin: 1rem 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  color: #e5e7eb;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  position: relative;
  margin-top: 0.1rem;
}

.checkbox-label input[type="checkbox"]:checked {
  background: #4ade80;
  border-color: #4ade80;
}

.checkbox-label input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.error-message {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-message {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-btn {
  background: linear-gradient(135deg, #155335, #1d6b3b);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(21, 83, 53, 0.3);
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d6b3b, #225c22);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(21, 83, 53, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.privacy-notice {
  margin-top: 1.5rem;
  text-align: center;
  color: #9ca3af;
}

.privacy-notice a {
  color: #4ade80;
  text-decoration: none;
}

.privacy-notice a:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .auth-container {
    padding: 1rem 0.5rem;
  }
  
  .auth-form-wrapper {
    padding: 2rem 1.5rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
  
  .toggle-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .form-input {
    padding: 10px 14px;
  }
}

@media (max-width: 480px) {
  .auth-form-wrapper {
    padding: 1.5rem 1rem;
  }
  
  .auth-title {
    font-size: 1.3rem;
  }
  
  .age-warning {
    padding: 1rem;
  }
  
  .warning-content i {
    font-size: 1.5rem;
  }
}
</style>