function main() {
  const canvas = document.getElementById("game");
  if (!canvas.getContext) {
    return;
  }
  const ctx = canvas.getContext("2d");

  let snake = [
    { x: 160, y: 140 },
    { x: 140, y: 140 },
    { x: 120, y: 140 },
  ];
  let dx = 20;
  let dy = 0;
  let score = 0;
  const scoreDisplay = document.getElementById("score-display");
  
  const drawSnakePart = (part) => {
    ctx.fillStyle = "#D9ED92";
    ctx.strokeStyle = "#168AAD";
    ctx.fillRect(part.x, part.y, 20, 20);
    ctx.strokeRect(part.x, part.y, 20, 20);
  };

  const drawSnake = () => {
    snake.forEach(drawSnakePart);
  };

  const clearCanvas = () => {
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const moveSnake = () => {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      updateScore();
      food = createApple();
      SNAKE_SPEED *= 0.9;
    } else {
      snake.pop();
    }
    snake.unshift(head);
  };

  const updateScore = () => {
    scoreDisplay.innerText = score;
  }

  const createApple = () => {
    // As long as the apple position is generated on a snake part, keep generating a new position
    let foodX, foodY;
    do {
      foodX = Math.floor((Math.random() * canvas.width) / 20) * 20;
      foodY = Math.floor((Math.random() * canvas.width) / 20) * 20;
    } while (snake.some((part) => part.x === foodX && part.y === foodY));
    return { x: foodX, y: foodY };
  };

  let food = createApple();
  function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
  }

  const setupControls = () => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "a") {
        if (dx !== 20) {
          dx = -20;
          dy = 0;
        }
      } else if (event.key === "d") {
        if (dx !== -20) {
          dx = 20;
          dy = 0;
        }
      } else if (event.key === "w") {
        if (dy !== 20) {
          dy = -20;
          dx = 0;
        }
      } else if (event.key === "s") {
        if (dy !== -20) {
          dy = 20;
          dx = 0;
        }
      }
    });
  };

  function checkGameOver() {
    checkBorderCollision();
    checkSelfCollision();
  }

  function checkBorderCollision() {
    const head = snake[0];
    if (
      head.x < 0 ||
      head.x >= canvas.width ||
      head.y < 0 ||
      head.y >= canvas.height
    ) {
      gameOver = true;
    }
  }

  function checkSelfCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        gameOver = true;
      }
    }
  }

  const gameOverMessage = document.getElementById("game-over-message");
  let SNAKE_SPEED = 750;
  let lastRenderTime;
  let gameOver = false;
  const gameLoop = (timeStamp) => {
    if (gameOver) {
      gameOverMessage.toggleAttribute("hidden");
      // if (confirm("GAME OVER Press ok to restart.")) {
      //   window.location.reload(); // Reload the page to restart the game
      // }
      return; // Exit the game loop if game over
    }

    if (lastRenderTime === undefined) {
      lastRenderTime = timeStamp;
    }
    requestAnimationFrame(gameLoop);
    const milsSinceLastRender = Math.floor(timeStamp - lastRenderTime);
    if (milsSinceLastRender < SNAKE_SPEED) {
      return;
    }
    lastRenderTime = timeStamp;
    clearCanvas();
    drawSnake();
    drawApple();
    moveSnake();
    checkGameOver();
  };

  const startButton = document.getElementById("start-game-button");
  startButton.addEventListener("click", (e) => {
    setupControls();
    gameLoop();
  });
}

window.addEventListener("load", main);
