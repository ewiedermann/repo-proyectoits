<template>
<<<<<<< HEAD
  <div class="memory-game">
=======


  <div class="memory-game">

<div class="botones-superiores">
  <button @click="volverjuegos">
    <i class="fas fa-sign-out-alt"></i> Volver a juegos
  </button>
</div>

    <!-- Título del juego -->
    <h2>Juego de Memoria: Dinosaurios 🦖</h2>

    <!-- Estadísticas -->
    <div class="game-stats">
      <div class="stat-box">
        <p>Tiempo</p>
        <span>{{ formattedTime }} seg</span>
      </div>
      <div class="stat-box">
        <p>Movimientos</p>
        <span>{{ moves }}</span>
      </div>
      <div class="stat-box">
        <p>Puntaje</p>
        <span>{{ score }}/10</span>
      </div>
    </div>

    <!-- Tablero de cartas -->
>>>>>>> qa1
    <div class="game-board">
      <div
        class="card"
        v-for="(card, index) in shuffledCards"
<<<<<<< HEAD
        :key="`${gameKey}-${index}`"
        @click="flipCard(card)"
        :class="{'flipped': card.flipped || card.matched, 'matched': card.matched}"
      >
        <div class="card-inner">
          <div class="card-front">
            <img v-if="card.flipped || card.matched" :src="card.image" alt="Dinosaurio" />
          </div>
=======
        :key="index"
        @click="flipCard(card)"
        :class="{
          'flipped': card.flipped || card.matched,
          'matched-animation': card.matched
        }"
      >
        <div class="card-inner">
          <!-- Frente de la carta -->
          <div class="card-front">
            <img v-if="card.flipped || card.matched" :src="card.image" alt="Dinosaurio" />
          </div>
          <!-- Dorso de la carta -->
>>>>>>> qa1
          <div class="card-back">
            <div class="card-back-content">🦖</div>
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  </div>
</template>

<script>
=======

    <!-- Mensaje de fin del juego -->
    <div v-if="gameOver" class="game-over-container">
      <p class="game-over-text">🎉 ¡Juego Terminado! Has ganado 🎉</p>
      <p class="score">⏱️ {{ formattedTime }} seg | 🧠 {{ moves }} movs | 🏆 {{ score }}/10 pts</p>
      <div class="game-buttons">
        <button @click="restartGame" class="btn-restart">🔄 Reiniciar</button>
        <router-link to="/juegos" class="btn-menu">🏠 Volver al Menú</router-link>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * Componente Vue para un juego de memoria con cartas de dinosaurios.
 * Este componente implementa la lógica básica de emparejamiento de cartas,
 * temporizador, puntuación y animaciones.
 */
>>>>>>> qa1
import dino1 from '@/assets/dino1.png';
import dino2 from '@/assets/dino2.png';
import dino3 from '@/assets/dino3.png';

<<<<<<< HEAD
export default {
  emits: ['game-started', 'card-flipped', 'game-finished'],
  data() {
    return {
      gameKey: 0, // Para forzar re-render cuando se reinicia
=======

export default {
  /**
   * Nombre del componente
   * @type {string}
   */
  name: 'MemoryGame',

  data() {
    return {
      /**
       * Lista de cartas disponibles en el juego, cada una con imagen, estado flipped y matched
       * @type {Array<{image: string, flipped: boolean, matched: boolean}>}
       */
>>>>>>> qa1
      cards: [
        { image: dino1, flipped: false, matched: false },
        { image: dino1, flipped: false, matched: false },
        { image: dino2, flipped: false, matched: false },
        { image: dino2, flipped: false, matched: false },
        { image: dino3, flipped: false, matched: false },
        { image: dino3, flipped: false, matched: false },
      ],
<<<<<<< HEAD
      flippedCards: [],
      gameOver: false,
      gameStarted: false,
    };
  },
  computed: {
    shuffledCards() {
      return this.shuffleCards([...this.cards]);
    }
  },
  methods: {
    shuffleCards(cards) {
      return cards.sort(() => Math.random() - 0.5);
    },
    flipCard(card) {
      if (this.flippedCards.length === 2 || card.flipped || card.matched) return;

      // Emitir evento de inicio del juego en el primer movimiento
      if (!this.gameStarted) {
        this.gameStarted = true;
        this.$emit('game-started');
      }

      card.flipped = true;
      this.flippedCards.push(card);

      // Emitir evento de carta volteada (solo cuando se voltean 2 cartas para contar como intento)
      if (this.flippedCards.length === 2) {
        this.$emit('card-flipped');
        setTimeout(this.checkMatch, 1000);
      }
    },
=======

      /**
       * Arreglo que almacena las cartas actualmente volteadas
       * @type {Array<{image: string, flipped: boolean, matched: boolean}>}
       */
      flippedCards: [],

      /**
       * Indicador de si el juego ha terminado
       * @type {boolean}
       */
      gameOver: false,

      /**
       * Número total de movimientos realizados
       * @type {number}
       */
      moves: 0,

      /**
       * Tiempo transcurrido desde el inicio del juego (en segundos)
       * @type {number}
       */
      timeElapsed: 0,

      /**
       * Identificador del intervalo del temporizador
       * @type {number|null}
       */
      timerInterval: null,
    };
  },

  computed: {
    /**
     * Retorna una versión barajada de las cartas
     * @returns {Array<{image: string, flipped: boolean, matched: boolean}>}
     */
    shuffledCards() {
      return this.shuffleCards([...this.cards]);
    },

    /**
     * Calcula el puntaje final basado en tiempo y movimientos
     * @returns {number}
     */
    score() {
      const baseScore = 10;
      const timePenalty = Math.floor(this.timeElapsed / 10);
      const movePenalty = Math.max(0, this.moves - 3);
      return Math.max(0, baseScore - timePenalty - movePenalty);
    },

    /**
     * Retorna el tiempo formateado como número entero
     * @returns {string}
     */
    formattedTime() {
      return this.timeElapsed.toFixed(0);
    },

  },

  methods: {
    /**
     * Baraja un arreglo de cartas aleatoriamente
     * @param {Array} cards - Arreglo de cartas a barajar
     * @returns {Array} Arreglo barajado
     */
    shuffleCards(cards) {
      return cards.sort(() => Math.random() - 0.5);
    },

    /**
     * Inicia el temporizador del juego
     */
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timeElapsed += 0.1;
      }, 100);
    },

    /**
     * Detiene el temporizador del juego
     */
    stopTimer() {
      clearInterval(this.timerInterval);
    },

    /**
     * Voltea una carta y verifica si se puede hacer coincidencia
     * @param {{image: string, flipped: boolean, matched: boolean}} card - Carta seleccionada
     */
    flipCard(card) {
      if (this.flippedCards.length === 2 || card.flipped || card.matched) return;

      card.flipped = true;
      this.flippedCards.push(card);

      if (this.flippedCards.length === 2) {
        this.moves++;
        setTimeout(this.checkMatch, 800);
      }

      if (!this.timerInterval && this.moves === 1) {
        this.startTimer();
      }
    },

    /**
     * Verifica si las dos cartas volteadas son iguales
     */
>>>>>>> qa1
    checkMatch() {
      const [card1, card2] = this.flippedCards;

      if (card1.image === card2.image) {
        card1.matched = true;
        card2.matched = true;
      } else {
        card1.flipped = false;
        card2.flipped = false;
      }

      this.flippedCards = [];

      if (this.cards.every(card => card.matched)) {
<<<<<<< HEAD
        this.gameOver = true;
        this.$emit('game-finished');
      }
    },
    reiniciarJuego() {
=======
        this.stopTimer();
        this.gameOver = true;
      }
    },

    /**
     * Reinicia el juego a su estado inicial
     */
    restartGame() {
      this.stopTimer();

>>>>>>> qa1
      this.cards.forEach(card => {
        card.flipped = false;
        card.matched = false;
      });
<<<<<<< HEAD
      this.flippedCards = [];
      this.gameOver = false;
      this.gameStarted = false;
      this.gameKey++; // Incrementa la key para forzar re-render
    }
=======

      this.flippedCards = [];
      this.gameOver = false;
      this.moves = 0;
      this.timeElapsed = 0;
    },
    /**
 * Vuelve al menú principal de juegos
 */
volverjuegos() {
  this.$router.push('/juegos');
}

  },

  /**
   * Hook beforeUnmount: detiene el temporizador antes de desmontar el componente
   */
  beforeUnmount() {
    this.stopTimer();
>>>>>>> qa1
  }
};
</script>

<style scoped>
<<<<<<< HEAD
=======

@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap ');

.botones-superiores {
  display: flex;
  justify-content: flex-end; /* Alinea los botones a la derecha */
  margin-bottom: 20px; /* Espacio debajo de los botones */
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

>>>>>>> qa1
.memory-game {
  background-color: #2e4d3d;
  color: #f0ead2;
  padding: 20px;
  text-align: center;
<<<<<<< HEAD
  font-family: 'Raleway', sans-serif;
=======
  font-family: 'Fredoka One', cursive;
  height: 100vh;
>>>>>>> qa1
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
<<<<<<< HEAD
  box-sizing: border-box;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  margin: 20px auto;
  justify-items: center;
  width: 100%;
=======
  min-height: 100vh;
  box-sizing: border-box;
}

h2 {
  font-size: 2.5rem;
  color: #d4c9a1;
  margin-bottom: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Estilos para las estadísticas */
.game-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-box {
  background-color: #3c6652;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100px;
  transition: transform 0.3s ease;
}

.stat-box:hover {
  transform: scale(1.05);
}

.stat-box p {
  font-size: 0.9rem;
  margin: 0;
  color: #f8eac8;
}

.stat-box span {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fffdd0;
  display: block;
  margin-top: 4px;
}

/* Tablero de cartas */
.game-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  justify-items: center;
  width: 60%;
>>>>>>> qa1
  max-width: 600px;
  overflow: hidden;
}

.card {
  width: 150px;
  height: 150px;
  background-color: #3c6652;
  color: #f0ead2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  transform-style: preserve-3d;
<<<<<<< HEAD
  transition: transform 0.3s, box-shadow 0.3s ease, background-color 0.4s;
=======
  transition: transform 0.6s, box-shadow 0.3s ease, background-color 0.4s;
>>>>>>> qa1
  overflow: hidden;
}

.card:hover {
<<<<<<< HEAD
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card.matched {
  background: linear-gradient(135deg, #5b8e6b, #6ba57a);
  box-shadow: 0 0 20px rgba(212, 201, 161, 0.3);
=======
  transform: scale(1.07);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
>>>>>>> qa1
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
<<<<<<< HEAD
  border-radius: 15px;
=======
  border-radius: 10px;
>>>>>>> qa1
  visibility: hidden;
  transition: visibility 0.5s ease;
}

.card.flipped img {
  visibility: visible;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

<<<<<<< HEAD
.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  border-radius: 15px;
}

.card-front {
  background: linear-gradient(135deg, #4a7a5b, #5c8a70);
  transform: rotateY(180deg);
}

.card-back {
  background: linear-gradient(135deg, #3c6652, #4a7a5b);
}

=======
>>>>>>> qa1
.card-back-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
<<<<<<< HEAD
  font-size: 2.5rem;
=======
  font-size: 2rem;
  transition: all 0.3s ease;
}

.card-back-content:hover {
  transform: rotate(5deg);
}

.matched-animation {
  animation: pop 0.5s ease-in-out;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Fin del juego */
.game-over-container {
  margin-top: 30px;
  text-align: center;
}

.game-over-text {
  font-size: 1.6rem;
  color: #fff;
  font-weight: bold;
  margin-bottom: 10px;
}

.score {
  font-size: 1.2rem;
  color: #f8eac8;
  margin-bottom: 20px;
}

.game-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-restart,
.btn-menu {
  background-color: #5e8b64;
  color: #fff;
  border: none;
  padding: 12px 25px;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.btn-restart:hover,
.btn-menu:hover {
  background-color: #4a7150;
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
>>>>>>> qa1
}

@media (max-width: 768px) {
  .game-board {
    grid-template-columns: repeat(3, 1fr);
<<<<<<< HEAD
    grid-template-rows: repeat(2, 1fr);
    width: 100%;
    gap: 10px;
=======
    width: 100%;
>>>>>>> qa1
  }

  .card {
    width: 120px;
    height: 120px;
  }

<<<<<<< HEAD
  .card-back-content {
=======
  .stat-box {
    width: 90px;
  }

  h2 {
>>>>>>> qa1
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .game-board {
    grid-template-columns: repeat(2, 1fr);
<<<<<<< HEAD
    grid-template-rows: repeat(3, 1fr);
    width: 90%;
    gap: 8px;
=======
    width: 90%;
>>>>>>> qa1
  }

  .card {
    width: 90px;
    height: 90px;
  }

<<<<<<< HEAD
  .card-back-content {
    font-size: 1.5rem;
  }
}
</style>
=======
  .stat-box {
    font-size: 0.8rem;
    width: 80px;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>
>>>>>>> qa1
