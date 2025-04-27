const board = document.getElementById('board');
const restartBtn = document.getElementById('restart');
const modal = document.getElementById('winnerModal');
const modalMessage = document.getElementById('modalMessage');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

let currentPlayer = 'X';
let cells = [];
let scores = { X: 0, O: 0 };

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createCell(index) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.dataset.index = index;
  cell.addEventListener('click', () => makeMove(cell));
  return cell;
}

function makeMove(cell) {
  if (cell.textContent || checkWinner()) return;
  cell.textContent = currentPlayer;
  if (checkWinner()) {
    drawWinLine();
    explodeParticles();
    scores[currentPlayer]++;
    updateScoreboard();
    setTimeout(() => showModal(`${currentPlayer} wins!`), 300);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

function setupBoard() {
  board.innerHTML = '';
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = createCell(i);
    cells.push(cell);
    board.appendChild(cell);
  }
}

function checkWinner() {
  return winCombos.find(combo => {
    const [a, b, c] = combo;
    return cells[a].textContent &&
           cells[a].textContent === cells[b].textContent &&
           cells[a].textContent === cells[c].textContent;
  });
}

function drawWinLine() {
  const combo = checkWinner();
  if (!combo) return;

  const [start, , end] = combo;
  const startCell = cells[start].getBoundingClientRect();
  const endCell = cells[end].getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const x1 = startCell.left + startCell.width / 2 - boardRect.left;
  const y1 = startCell.top + startCell.height / 2 - boardRect.top;
  const x2 = endCell.left + endCell.width / 2 - boardRect.left;
  const y2 = endCell.top + endCell.height / 2 - boardRect.top;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  const line = document.createElement('div');
  line.classList.add('win-line');
  line.style.width = `${length}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.transform = `rotate(${angle}deg)`;

  board.appendChild(line);
}

function explodeParticles() {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.setProperty('--x', `${Math.random() * 400 - 200}px`);
    particle.style.setProperty('--y', `${Math.random() * 400 - 200}px`);
    board.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

function updateScoreboard() {
  scoreX.textContent = `X Wins: ${scores.X}`;
  scoreO.textContent = `O Wins: ${scores.O}`;
}

function showModal(message) {
  modalMessage.textContent = message;
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.style.display = 'none';
    restartGame();
  }, 1500);
}

function restartGame() {
  setupBoard();
  currentPlayer = 'X';
}

restartBtn.addEventListener('click', restartGame);

board.addEventListener('mousemove', (e) => {
  const { width, height, left, top } = board.getBoundingClientRect();
  const x = e.clientX - left;
  const y = e.clientY - top;
  const rotateX = ((y / height) - 0.5) * 20;
  const rotateY = ((x / width) - 0.5) * -20;
  board.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

board.addEventListener('mouseleave', () => {
  board.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
});

setupBoard();
