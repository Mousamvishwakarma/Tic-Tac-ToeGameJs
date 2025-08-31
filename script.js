const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('resetBtn');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const popupRestart = document.getElementById('popup-restart');
const themeToggle = document.getElementById('themeToggle');
const playerNamesDisplay = document.getElementById('playerNames');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const vsComputerToggle = document.getElementById('vsComputerToggle');

let currentPlayer = 'X';
let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
let vsComputer = false;

let playerXName = "Player X";
let playerOName = "Player O";
let scoreX = 0;
let scoreO = 0;

const moveSound = new Audio('sounds/move.mp3');
const winSound = new Audio('sounds/win.mp3');
const resetSound = new Audio('sounds/reset.mp3');

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

vsComputerToggle.addEventListener('change', () => {
  vsComputer = vsComputerToggle.checked;
  resetGame();
});

function checkWinner() {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      highlightWinnerCells(a, b, c);
      isGameActive = false;
      winSound.play();
      const winnerName = board[a] === 'X' ? playerXName : playerOName;
      if (board[a] === 'X') {
        scoreX++;
        scoreXDisplay.textContent = `❌ ${scoreX}`;
      } else {
        scoreO++;
        scoreODisplay.textContent = `⭕ ${scoreO}`;
      }
      showPopup(`${winnerName} wins! 🎉`);
      launchConfetti();
      launchEmojiRain(["🎉","😂","💥","👑","🍕"]);
      return;
    }
  }

  if (!board.includes("") && isGameActive) {
    isGameActive = false;
    showPopup(`It's a Draw 🤝`);
    launchEmojiRain(["🤝","😎","✨"]);
  }
}

function highlightWinnerCells(a, b, c) {
  cells[a].classList.add('winner');
  cells[b].classList.add('winner');
  cells[c].classList.add('winner');
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.remove('hidden');
}

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (board[index] !== "" || !isGameActive || (vsComputer && currentPlayer === 'O')) return;
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');
    moveSound.play();
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (vsComputer && currentPlayer === 'O') {
      setTimeout(botMove, 500);
    }
  });
});

function botMove() {
  if (!isGameActive) return;
  let emptyIndexes = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
  if (emptyIndexes.length === 0) return;
  let randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  board[randomIndex] = 'O';
  cells[randomIndex].textContent = 'O';
  cells[randomIndex].classList.add('taken');
  moveSound.play();
  checkWinner();
  currentPlayer = 'X';
}

resetBtn.addEventListener('click', resetGame);
popupRestart.addEventListener('click', () => {
  popup.classList.add('hidden');
  resetGame();
});

function resetGame() {
  resetSound.play();
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove('taken', 'winner');
  });
}

function fullReset() {
  scoreX = 0;
  scoreO = 0;
  scoreXDisplay.textContent = `❌ 0`;
  scoreODisplay.textContent = `⭕ 0`;
  resetGame();
}

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light-mode');
});

const nameModal = new bootstrap.Modal(document.getElementById('nameModal'));
const startGameBtn = document.getElementById('startGameBtn');

window.addEventListener('load', () => {
  nameModal.show();
});

startGameBtn.addEventListener('click', () => {
  const xInput = document.getElementById('playerX').value.trim();
  const oInput = document.getElementById('playerO').value.trim();
  playerXName = xInput !== "" ? xInput : "Player X";
  playerOName = oInput !== "" ? oInput : "Player O";
  playerNamesDisplay.textContent = `${playerXName} vs ${playerOName}`;
  nameModal.hide();
});

function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function launchEmojiRain(emojis) {
  for (let i = 0; i < 30; i++) {
    const emoji = document.createElement('div');
    emoji.classList.add('emoji');
    emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.animationDuration = (Math.random() * 2 + 3) + "s";
    document.body.appendChild(emoji);
    setTimeout(() => { emoji.remove(); }, 5000);
  }
}
