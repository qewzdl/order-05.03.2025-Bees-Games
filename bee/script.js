// Game variables
let score = 0
let gameStarted = false
const bees = []
let beeId = 0
let gameArea
let gameAreaRect
const MAX_BEES = 30 // Изменить константу MAX_BEES на 30

let remainingBees = MAX_BEES // Добавить переменную для отслеживания оставшихся пчел

// DOM elements
const startScreen = document.getElementById("start-screen")
const startButton = document.getElementById("start-button") // Added startButton
const gameScreen = document.getElementById("game-screen")
const scoreElement = document.getElementById("score")
const gameAreaElement = document.getElementById("game-area")
const rotationMessage = document.getElementById("rotation-message") // Added rotationMessage

// Start the game when clicking the start button
startButton.addEventListener("click", startGame) // Changed event listener to startButton

// Check orientation on load and when orientation changes
checkOrientation()
window.addEventListener("resize", checkOrientation)
window.addEventListener("orientationchange", checkOrientation)

// Function to check device orientation
function checkOrientation() {
  // Only show rotation message on mobile devices
  if (window.innerWidth < 768) {
    if (window.innerWidth < window.innerHeight) {
      // Portrait mode
      rotationMessage.style.display = "flex"
      if (gameStarted) {
        gameScreen.style.display = "none"
      }
    } else {
      // Landscape mode
      rotationMessage.style.display = "none"
      if (gameStarted) {
        gameScreen.style.display = "block"
      }
    }
  } else {
    // Desktop or tablet - always hide rotation message
    rotationMessage.style.display = "none"
  }
}

// Start the game
function startGame() {
  gameStarted = true
  startScreen.style.display = "none"
  gameScreen.style.display = "block"

  // Initialize game area
  gameArea = document.getElementById("game-area")
  gameAreaRect = gameArea.getBoundingClientRect()

  // Spawn initial bees
  for (let i = 0; i < MAX_BEES; i++) {
    spawnBee()
  }

  // Add some decorative flowers
  addFlowers()

  // Start animation loop
  requestAnimationFrame(updateGame)
}

// Add decorative flowers to the background
function addFlowers() {
  const flowerColors = ["#FF5252", "#FFEB3B", "#4CAF50", "#2196F3", "#9C27B0"]

  for (let i = 0; i < 10; i++) {
    const flower = document.createElement("div")
    flower.className = "flower"
    flower.style.left = `${Math.random() * 100}%`
    flower.style.bottom = `${Math.random() * 20}%`

    // Random color for the flower
    const color = flowerColors[Math.floor(Math.random() * flowerColors.length)]

    // Create SVG flower
    flower.innerHTML = `
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Flower petals -->
        <circle cx="20" cy="10" r="8" fill="${color}" />
        <circle cx="30" cy="20" r="8" fill="${color}" />
        <circle cx="20" cy="30" r="8" fill="${color}" />
        <circle cx="10" cy="20" r="8" fill="${color}" />
        
        <!-- Flower center -->
        <circle cx="20" cy="20" r="6" fill="#FFEB3B" />
      </svg>
    `

    gameArea.appendChild(flower)
  }
}

// Spawn a new bee
function spawnBee() {
  const bee = document.createElement("div")
  const id = beeId++

  bee.className = "bee"
  bee.id = `bee-${id}`
  bee.style.left = `${Math.random() * 90}%`
  bee.style.top = `${Math.random() * 80}%`

  // Получаем числовые значения без '%'
  let xPos = Number.parseFloat(bee.style.left)
  let yPos = Number.parseFloat(bee.style.top)

  // Проверяем на NaN
  if (isNaN(xPos)) xPos = Math.random() * 90
  if (isNaN(yPos)) yPos = Math.random() * 80

  // Add SVG bee image inside the div
  bee.innerHTML = `
    D

  `

  // Random movement properties - с гарантированной минимальной скоростью
  const minSpeed = 0.3 // Минимальная скорость
  const maxSpeed = 0.6 // Максимальная скорость
  const speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
  const directionX = Math.random() > 0.5 ? 1 : -1
  const directionY = Math.random() > 0.5 ? 1 : -1

  // Store bee data
  bees.push({
    element: bee,
    id: id,
    x: xPos,
    y: yPos,
    speedX: speed * directionX,
    speedY: speed * directionY,
  })

  // Add click event to catch the bee
  bee.addEventListener("click", () => catchBee(id))

  // Add to game area
  gameArea.appendChild(bee)
}

// Catch a bee when clicked
function catchBee(id) {
  const beeIndex = bees.findIndex((bee) => bee.id === id)

  if (beeIndex !== -1) {
    const bee = bees[beeIndex]

    // Play disappearing animation
    bee.element.classList.add("disappearing")

    // Remove bee after animation completes
    setTimeout(() => {
      if (bee.element.parentNode) {
        bee.element.parentNode.removeChild(bee.element)
      }
      bees.splice(beeIndex, 1)

      // Уменьшаем счетчик оставшихся пчел
      remainingBees--

      // Проверяем, закончилась ли игра
      if (remainingBees === 0) {
        endGame()
      }
    }, 500)

    // Increase score
    score++
    scoreElement.textContent = score
  }
}

// Добавить функцию окончания игры
function endGame() {
  // Создаем экран окончания игры
  const endScreen = document.createElement("div")
  endScreen.className = "end-screen"
  endScreen.innerHTML = `
    <div class="end-message">
      <h1>Игра окончена!</h1>
      <p>Вы поймали всех пчел!</p>
      <p>Ваш счет: ${score}</p>
      <button id="restart-button">Играть снова</button>
    </div>
  `

  document.querySelector(".game-container").appendChild(endScreen)

  // Добавляем обработчик для кнопки перезапуска
  document.getElementById("restart-button").addEventListener("click", () => {
    location.reload() // Перезагружаем страницу для новой игры
  })
}

// Update game state
function updateGame() {
  gameAreaRect = gameArea.getBoundingClientRect()

  // Update each bee's position
  bees.forEach((bee) => {
    // Update position
    bee.x += bee.speedX
    bee.y += bee.speedY

    // Boundary checking
    if (bee.x < 0) {
      bee.x = 0
      bee.speedX *= -1
    } else if (bee.x > 90) {
      bee.x = 90
      bee.speedX *= -1
    }

    if (bee.y < 0) {
      bee.y = 0
      bee.speedY *= -1
    } else if (bee.y > 80) {
      bee.y = 80
      bee.speedY *= -1
    }

    // Проверка на минимальную скорость
    const minSpeed = 0.3
    if (Math.abs(bee.speedX) < minSpeed) {
      bee.speedX = minSpeed * (bee.speedX < 0 ? -1 : 1)
    }
    if (Math.abs(bee.speedY) < minSpeed) {
      bee.speedY = minSpeed * (bee.speedY < 0 ? -1 : 1)
    }

    // Apply new position and rotation
    bee.element.style.left = `${bee.x}%`
    bee.element.style.top = `${bee.y}%`
    // Зеркальное отражение в зависимости от направления движения
    if (bee.speedX > 0) {
      // Движение вправо - зеркальное отражение
      bee.element.style.transform = "scaleX(-1)"
    } else {
      // Движение влево - оригинальное изображение
      bee.element.style.transform = "scaleX(1)"
    }
  })

  // Continue animation loop
  requestAnimationFrame(updateGame)
}

