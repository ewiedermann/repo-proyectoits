<template>
  <div class="runner-container">
    <h2>Dino Runner 🦖</h2>
    <canvas ref="gameCanvas" class="game-canvas"></canvas>

    <!-- Game Over -->
    <div v-if="gameOver" class="game-over-overlay">
      <h3>💥 ¡Perdiste!</h3>
      <p>Puntaje final: {{ score }}</p>
      <button @click="restartGame" class="restart-button">🔄 Reiniciar Juego</button>
    </div>

    <div class="score-display">
      🦖 Puntos: {{ score }}
      <button @click="handleJumpButton" class="jump-button">
        🔺 Saltar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Referencia al canvas
const gameCanvas = ref(null);
const ctx = ref(null);

// Estado del juego
const score = ref(0);
const gameOver = ref(false);
let animationId = null;

// Configuración del dinosaurio
const dino = {
  x: 50,
  y: 160,
  width: 40,
  height: 40,
  image: new Image(),
  velocityY: 0,
  gravity: 0.5,
  jumpStrength: -12,
  grounded: true
};

// Obstáculos
const obstacles = ref([]);

// Cargar imágenes
dino.image.src = 'public/images/dinos-runner/dino.png';

// Escenario
const background = new Image();
background.src = '/images/dinos-runner/escenario.png';

// Funciones del juego

const createObstacle = () => {
  const obstacleImage = new Image();
  obstacleImage.src = '/images/dinos-runner/obstaculo.png';
  return {
    x: 800,
    y: 160,
    width: 40,
    height: 40,
    image: obstacleImage,
    speed: 3 + Math.random() * 1.5
  };
};

const drawGround = () => {
  // Dibujar el escenario
  ctx.value.drawImage(background, 0, 0, canvasWidth.value, canvasHeight.value);
};

const updateDino = () => {
  dino.velocityY += dino.gravity;
  dino.y += dino.velocityY;

  if (dino.y >= canvasHeight.value - dino.height - 10) {
    dino.y = canvasHeight.value - dino.height - 10;
    dino.grounded = true;
    dino.velocityY = 0;
  } else {
    dino.grounded = false;
  }
};

const drawDino = () => {
  ctx.value.drawImage(dino.image, dino.x, dino.y, dino.width, dino.height);
};

const drawObstacles = () => {
  for (let i = obstacles.value.length - 1; i >= 0; i--) {
    const obs = obstacles.value[i];

    obs.x -= obs.speed;

    ctx.value.drawImage(obs.image, obs.x, obs.y, obs.width, obs.height);

    // Colisión
    if (
      dino.x < obs.x + obs.width &&
      dino.x + dino.width > obs.x &&
      dino.y < obs.y + obs.height &&
      dino.y + dino.height > obs.y
    ) {
      endGame();
      return;
    }

    // Fuera de pantalla
    if (obs.x + obs.width < 0) {
      obstacles.value.splice(i, 1);
      score.value++;
    }
  }
};

const generateObstacle = () => {
  if (Math.random() < 0.005) {
    obstacles.value.push(createObstacle());
  }
};

const update = () => {
  ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

  if (gameOver.value) return;

  drawGround();
  updateDino();
  drawDino();
  drawObstacles();
  generateObstacle();

  animationId = requestAnimationFrame(update);
};

const startGame = () => {
  const canvas = gameCanvas.value;
  if (!canvas) {
    console.error('❌ Canvas no encontrado');
    return;
  }

  // Ajustar el tamaño del canvas al tamaño de la pantalla
  resizeCanvas();

  ctx.value = canvas.getContext('2d');
  update();
};

const endGame = () => {
  cancelAnimationFrame(animationId);
  gameOver.value = true;
};

const restartGame = () => {
  score.value = 0;
  obstacles.value = [];
  dino.y = canvasHeight.value - dino.height - 10;
  dino.velocityY = 0;
  dino.grounded = true;
  gameOver.value = false;

  startGame();
};

const handleJumpButton = () => {
  if (dino.grounded && !gameOver.value) {
    dino.velocityY = dino.jumpStrength;
  }
};

function handleKeyDown(e) {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && dino.grounded && !gameOver.value) {
    dino.velocityY = dino.jumpStrength;
  }
}

// Variables para el tamaño del canvas
const canvasWidth = ref(window.innerWidth * 0.9); // 90% del ancho de la pantalla
const canvasHeight = ref(200); // Altura fija

// Redimensionar el canvas al cambiar el tamaño de la ventana
function resizeCanvas() {
  const canvas = gameCanvas.value;
  if (!canvas) return;

  canvas.width = canvasWidth.value;
  canvas.height = canvasHeight.value;

  // Ajustar el tamaño del dino y los obstáculos
  dino.width = canvasWidth.value * 0.05;
  dino.height = dino.width * 1.5;
  dino.y = canvasHeight.value - dino.height - 10;

  obstacles.value.forEach((obstacle) => {
    obstacle.width = canvasWidth.value * 0.03;
    obstacle.height = obstacle.width * 1.5;
    obstacle.y = canvasHeight.value - obstacle.height - 10;
  });
}

onMounted(() => {
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('keydown', handleKeyDown);
  startGame();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('keydown', handleKeyDown);
  cancelAnimationFrame(animationId);
});
</script>

<style scoped>
.runner-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e0f7fa;
  min-height: 100vh;
  color: #333;
  font-family: 'Segoe UI', sans-serif;
}

.game-canvas {
  border: 2px solid #ccc;
  background-color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.score-display {
  margin-top: 10px;
  font-weight: bold;
  font-size: 1.3rem;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #ffcc00;
  color: #333;
  display: flex;
  align-items: center;
}

.jump-button {
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.jump-button:hover {
  background-color: #27ae60;
}

.game-over-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 20px 30px;
  border-radius: 12px;
  text-align: center;
  z-index: 10;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.restart-button {
  margin-top: 15px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.restart-button:hover {
  background-color: #27ae60;
}
</style>
