document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let snake = [{ x: 200, y: 200 }];
    let food = { x: 100, y: 100 };
    let direction = 'right';
    let gameOver = false;
    let difficulty = 'easy';
    let isPaused = false;
    let score = 0;
    let startTime;
    let gameInterval;
    let bestScore = localStorage.getItem('bestScore') || 0;

    document.getElementById('bestScore').textContent = bestScore;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the snake
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, 10, 10);
        });

        // Draw the food (apple)
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 10, 10);
    }

    function update() {
        const head = { ...snake[0] };
        switch (direction) {
            case 'up':
                head.y -= 10;
                break;
            case 'down':
                head.y += 10;
                break;
            case 'left':
                head.x -= 10;
                break;
            case 'right':
                head.x += 10;
                break;
        }
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            food = {
                x: Math.floor(Math.random() * 39) * 10,
                y: Math.floor(Math.random() * 39) * 10
            };
            score++;
        } else {
            snake.pop();
        }

        if (
            head.x < 0 ||
            head.x >= canvas.width ||
            head.y < 0 ||
            head.y >= canvas.height ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            gameOver = true;
            showGameOverModal();
        }
    }

    function gameLoop() {
        if (!gameOver && !isPaused) {
            update();
            draw();
            updateScoreAndTime();
        }
    }

    window.startGame = function (difficultyLevel) {
        difficulty = difficultyLevel;
        document.querySelector('.home-container').style.display = 'none';
        document.getElementById('difficultyModal').style.display = 'none';
        canvas.style.display = 'block';
        document.getElementById('gameContainer').style.display = 'block';
        snake = [{ x: 200, y: 200 }];
        food = { x: 100, y: 100 };
        direction = 'right';
        gameOver = false;
        isPaused = false;
        score = 0;
        startTime = new Date().getTime();
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 200 / (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3));
    };

    window.showDifficultyModal = function () {
        document.getElementById('difficultyModal').style.display = 'block';
    };

    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });

    window.togglePause = function () {
        isPaused = !isPaused;
        document.getElementById('pauseModal').style.display = isPaused ? 'block' : 'none';
        if (isPaused) {
            updatePauseScoreAndTime();
        } else {
            gameLoop();
        }
    };

    window.resumeGame = function () {
        isPaused = false;
        document.getElementById('pauseModal').style.display = 'none';
        gameLoop();
    };

    window.restartGame = function () {
        startGame(difficulty);
        document.getElementById('pauseModal').style.display = 'none';
        document.getElementById('gameOverModal').style.display = 'none';
    };

    window.leaveGame = function () {
        document.querySelector('.home-container').style.display = 'block';
        canvas.style.display = 'none';
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('pauseModal').style.display = 'none';
        document.getElementById('gameOverModal').style.display = 'none';
        clearInterval(gameInterval);
        gameOver = true;
        isPaused = false;
    };

    function showGameOverModal() {
        const endTime = new Date().getTime();
        const timeDuration = Math.floor((endTime - startTime) / 1000);
        document.getElementById('finalScore').textContent = score;
        document.getElementById('finalTime').textContent = `${timeDuration} seconds`;
        document.getElementById('gameOverModal').style.display = 'block';
        canvas.style.display = 'none';
        document.getElementById('gameContainer').style.display = 'none';

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            document.getElementById('bestScore').textContent = bestScore;
        }

        clearInterval(gameInterval);
    }

    function updateScoreAndTime() {
        const currentTime = new Date().getTime();
        const timeDuration = Math.floor((currentTime - startTime) / 1000);
        document.getElementById('score').textContent = `Score: ${score}`;
        document.getElementById('time').textContent = `Time: ${timeDuration}`;
    }

    function updatePauseScoreAndTime() {
        const currentTime = new Date().getTime();
        const timeDuration = Math.floor((currentTime - startTime) / 1000);
        document.getElementById('pauseScore').textContent = score;
        document.getElementById('pauseTime').textContent = `${timeDuration} seconds`;
    }
});

