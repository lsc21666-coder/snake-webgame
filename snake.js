const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const grid = 20;
let snake, apple, score, running, speed, frameInterval, frameCount;
let rankings = JSON.parse(localStorage.getItem('snake_rankings') || '[]');

const gameoverPanel = document.getElementById('gameover-panel');
const gameoverMsg = document.getElementById('gameover-msg');
const restartBtn = document.getElementById('restart-btn');

function setSpeed(mode) {
    if (mode === 'slow') frameInterval = 8;
    else if (mode === 'fast') frameInterval = 2;
    else frameInterval = 4; // normal
    speed = mode;
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.speed === mode);
    });
}
function initGame() {
    snake = {
        x: 160,
        y: 160,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 4
    };
    apple = {
        x: getRandomInt(0, 20) * grid,
        y: getRandomInt(0, 20) * grid
    };
    score = 0;
    running = true;
    frameCount = 0;
    updateScoreBoard();
    updateRankingBoard();
    gameoverPanel.style.display = 'none';
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function updateScoreBoard() {
    document.getElementById('score-board').innerText = 'Score: ' + score;
}
function updateRankingBoard() {
    let html = '<b>Top 5 랭킹</b><br>';
    rankings.slice(0,5).forEach((s, i) => {
        html += `${i+1}위: ${s}<br>`;
    });
    document.getElementById('ranking-board').innerHTML = html;
}
function saveRanking(newScore) {
    rankings.push(newScore);
    rankings.sort((a,b)=>b-a);
    rankings = rankings.slice(0, 5);
    localStorage.setItem('snake_rankings', JSON.stringify(rankings));
}
function showGameOverPanel() {
    let rank = rankings.indexOf(score) + 1;
    let html = `<h2>Game Over!</h2><div style='margin:8px 0;'>점수: <b>${score}</b></div>`;
    html += `<div style='margin-bottom:8px;'>랭킹: <b>${rank}위</b></div>`;
    html += '<b>Top 5 랭킹</b><br>';
    rankings.slice(0,5).forEach((s, i) => {
        html += `${i+1}위: ${s}<br>`;
    });
    gameoverMsg.innerHTML = html;
    gameoverPanel.style.display = 'block';
}
function gameOver() {
    running = false;
    saveRanking(score);
    updateRankingBoard();
    showGameOverPanel();
}
function gameLoop() {
    if (!running) return;
    requestAnimationFrame(gameLoop);
    frameCount++;
    if (frameCount < frameInterval) return;
    frameCount = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({x: snake.x, y: snake.y});
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid-2, grid-2);

    ctx.fillStyle = '#0f0';
snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid-2, grid-2);
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
            updateScoreBoard();
        }
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                gameOver();
            }
        }
    });

    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 390);
}
document.addEventListener('keydown', function(e) {
    if (!running) return;
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});
restartBtn.addEventListener('click', function() {
    initGame();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(gameLoop);
});
document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        setSpeed(btn.dataset.speed);
    });
});

// 초기화
setSpeed('normal');
initGame();
requestAnimationFrame(gameLoop);
