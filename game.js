// ===============================
// Global Değişkenler
// ===============================
let board = [];
let score = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;
const rows = 4;
const cols = 4;

let howToPlayTimeout = null; // Modal otomatik kapanma zamanlayıcısı

// ===============================
// DOM Elementleri
// ===============================
const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("best-score");
const newGameBtn = document.getElementById("new-game");
const howToPlayBtn = document.getElementById("how-to-play-btn");
const howToPlayModal = document.getElementById("how-to-play-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const closeHowToBtn = document.getElementById("close-how-to");
const gameMessageEl = document.getElementById("game-message");
const messageTextEl = document.getElementById("message-text");
const tryAgainBtn = document.getElementById("try-again");

// ===============================
// Başlangıç
// ===============================
bestScoreEl.innerText = bestScore;
startGame();

// ===============================
// Event Listener'lar
// ===============================
newGameBtn.addEventListener("click", startGame);
tryAgainBtn.addEventListener("click", startGame);
howToPlayBtn.addEventListener("click", openHowToPlay);
closeHowToBtn.addEventListener("click", closeHowToPlay);
modalBackdrop.addEventListener("click", closeHowToPlay); // Arka plana tıklayınca kapat
document.addEventListener("keydown", handleKey);

// ===============================
// Modal Fonksiyonları
// ===============================

/**
 * Nasıl Oynanır modalını açar.
 * 15 saniye sonra otomatik kapanır.
 */
function openHowToPlay() {
    howToPlayModal.classList.remove("hidden");

    // Önceki zamanlayıcıyı temizle
    if (howToPlayTimeout) {
        clearTimeout(howToPlayTimeout);
    }

    // 15 saniye sonra otomatik kapat
    howToPlayTimeout = setTimeout(() => {
        closeHowToPlay();
    }, 15000);
}

/**
 * Modal'ı kapatır ve zamanlayıcıyı temizler.
 */
function closeHowToPlay() {
    howToPlayModal.classList.add("hidden");
    if (howToPlayTimeout) {
        clearTimeout(howToPlayTimeout);
        howToPlayTimeout = null;
    }
}

// ===============================
// Oyun Başlatma
// ===============================
function startGame() {
    boardEl.innerHTML = "";
    gameMessageEl.classList.add("hidden");

    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    score = 0;
    updateScore();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.id = `${r}-${c}`;
            cell.classList.add("cell");
            boardEl.appendChild(cell);
        }
    }

    generateNew();
    generateNew();
}

// ===============================
// Skor Güncelleme
// ===============================
function updateScore() {
    scoreEl.innerText = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        bestScoreEl.innerText = bestScore;
    }
}

// ===============================
// Hücre Güncelleme
// ===============================
function updateCell(r, c) {
    const cell = document.getElementById(`${r}-${c}`);
    const value = board[r][c];

    cell.innerText = "";
    cell.className = "cell";

    if (value > 0) {
        cell.innerText = value;
        if (value <= 8192) {
            cell.classList.add(`x${value}`);
        } else {
            cell.classList.add("x8192");
        }
    }
}

// ===============================
// Klavye Kontrolleri
// ===============================
function handleKey(e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(e.key)) {
        e.preventDefault();
    }

    let moved = false;

    switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            moved = moveUp();
            break;
        case "ArrowDown":
        case "s":
        case "S":
            moved = moveDown();
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            moved = moveLeft();
            break;
        case "ArrowRight":
        case "d":
        case "D":
            moved = moveRight();
            break;
        default:
            return;
    }

    if (moved) {
        generateNew();
        updateScore();
        checkGameStatus();
    }
}

// ===============================
// Kaydırma Mantığı
// ===============================
function slide(row) {
    let arr = row.filter(val => val !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            arr[i + 1] = 0;
            score += arr[i];
        }
    }

    arr = arr.filter(val => val !== 0);
    while (arr.length < cols) {
        arr.push(0);
    }
    return arr;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        const original = [...board[r]];
        board[r] = slide(board[r]);
        if (JSON.stringify(original) !== JSON.stringify(board[r])) moved = true;
        for (let c = 0; c < cols; c++) updateCell(r, c);
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        const original = [...board[r]];
        let row = [...board[r]].reverse();
        row = slide(row);
        board[r] = row.reverse();
        if (JSON.stringify(original) !== JSON.stringify(board[r])) moved = true;
        for (let c = 0; c < cols; c++) updateCell(r, c);
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let c = 0; c < cols; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        const original = [...col];
        col = slide(col);
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            updateCell(r, c);
        }
        if (JSON.stringify(original) !== JSON.stringify(col)) moved = true;
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let c = 0; c < cols; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        const original = [...col];
        col.reverse();
        col = slide(col);
        col.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            updateCell(r, c);
        }
        if (JSON.stringify(original) !== JSON.stringify(col)) moved = true;
    }
    return moved;
}

// ===============================
// Yeni Sayı Üretme
// ===============================
function generateNew() {
    const empty = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 0) empty.push({ r, c });
        }
    }
    if (empty.length === 0) return;

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.1 ? 4 : 2;
    updateCell(r, c);
}

// ===============================
// Oyun Durumu
// ===============================
function hasEmptyCell() {
    return board.some(row => row.includes(0));
}

function canMove() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
            if (board[r][c] === board[r][c + 1]) return true;
        }
    }
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] === board[r + 1][c]) return true;
        }
    }
    return false;
}

function checkGameStatus() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 2048) {
                showMessage("Tebrikler! 2048'e ulaştın 🎉");
                return;
            }
        }
    }
    if (!hasEmptyCell() && !canMove()) {
        showMessage("Oyun Bitti!");
    }
}

function showMessage(text) {
    messageTextEl.innerText = text;
    gameMessageEl.classList.remove("hidden");
}