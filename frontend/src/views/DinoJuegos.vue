<template>
  <div class="juegos-container">
    <div class="botones-superiores">
      <!--       Habilitar cuando funcione
      <button @click="verRanking">Ranking</button>
      <button @click="verCarrito">
        <i class="fas fa-shopping-cart"></i> Carrito
      </button>
 -->
      <button @click="cerrarSesion">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>
    </div>
     <h1>
        <i class="fas fa-gamepad"></i>
        Dino Juegos
      </h1>
      <p class="subtitulo">¡Explora y juega con los dinosaurios!</p>

    <div class="juegos-grid">
      <div class="juego-item" @click="seleccionarJuego('memoria')">
        <i class="fas fa-brain"></i>
        <h3>Juego de Memoria</h3>
        <small>Encuentra las parejas en el menor tiempo posible</small>
      </div>
      <div class="juego-item" @click="seleccionarJuego('sopa')">
        <i class="fas fa-running"></i>
        <h3>Carrera Dino</h3>
        <small>Esquiva los obstaculos que mas puedas</small>

      </div>
      <div class="juego-item" @click="seleccionarJuego('rompecabezas')">
        <i class="fas fa-puzzle-piece"></i>
        <h3>Rompecabezas</h3>
        <small class="proximamente">Próximamente</small>
      </div>
      <div class="juego-item" @click="seleccionarJuego('pasapalabra')">
        <i class="fas fa-font"></i>
        <h3>Pasa Palabra</h3>
        <small>Próximamente</small>
        </div>

      </div>
 </div>

</template>


<script>
/**
 * @fileoverview Vista que muestra una lista de juegos disponibles relacionados con dinosaurios.
 * Permite navegar a cada juego o cerrar sesión.
 *
 * @module views/DinoJuegos
 */

import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';


export default {
  /**
   * Configuración del componente Vue
   */
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    /**
     * Cierra la sesión del usuario y redirige al inicio
     */
    const cerrarSesion = () => {
      userStore.logout();
      router.push('/'); // Redirige al Home después de cerrar sesión
    };

    return { cerrarSesion };
  },
  methods: {
    /**
     * Navega al juego seleccionado según su identificador
     *
     * @param {string} juego - Identificador del juego ('memoria', 'sopa', etc.)
     */
    seleccionarJuego(juego) {
      if (juego === 'memoria') {
        this.$router.push('/memory-game');
      } else if (juego === 'sopa') {
        this.$router.push('/sopa-de-letras');
      } else {
        console.log(`Juego seleccionado: ${juego}`);
      }
    },

    /**
     * Muestra el ranking de usuarios (pendiente de implementación)
     */
    verRanking() {
      console.log('Ver ranking');
    },

    /**
     * Muestra el carrito de compras (pendiente de implementación)
     */
    verCarrito() {
      console.log('Ver carrito');
    },
  },

};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap ');

h1{
  font-family: 'Fredoka One', cursive;
  font-size: 2.8rem;

}
.subtitulo{
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
h3{
  color: #f0ead2;
}

small{
  color: rgb(243, 243, 172);
}


.fa-gamepad { /*icono de joystick*/
    color: #4a7a5b;
  animation: zoom 1.5s ease-in-out infinite;
}

@keyframes zoom { /*animacin para el icono */
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.juegos-container {
  background-color: #2e4d3d;
  color: #f0ead2;
  padding: 20px;
  font-family: 'Georgia', serif;
  text-align: center;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
    box-sizing: border-box;
}

.botones-superiores {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  gap: 10px;
}

button {
  background-color: #4a7a5b;
  color: #f0ead2;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}

button:hover {
  background-color: #5b8e6b;
}

.juegos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 16px;
}

.juego-item {
  background: linear-gradient(135deg, #4a7a5b, #5c8a70);
  color: #033b26;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: 'Raleway', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;

}

.juego-item i {
  font-size: 2rem;
  margin-bottom: 8px;
color: #f0ead2;}

.juego-item:before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
  transition: all 0.5s ease;
}

.juego-item:hover:before {
  top: -70%;
  left: -70%;
  background: rgba(255, 255, 255, 0.2);
}

.juego-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .juegos-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .juego-item {
    font-size: 1rem;
    padding: 15px;
  }

  .juego-item i {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .juegos-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .juego-item {
    font-size: 0.9rem;
    padding: 12px;
  }

  .juego-item i {
    font-size: 1.3rem;
  }
}
</style>

