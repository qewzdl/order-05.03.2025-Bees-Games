// Определяем буквы для игрового поля
const letters = [
    'Б', 'В', 'Г', 'У', 'А', 'Л', 'С', 'О', 'Р', 'Ф',
    'З', 'Е', 'У', 'П', 'Ч', 'Е', 'Л', 'А', 'М', 'Х',
    'И', 'П', 'Р', 'С', 'О', 'А', 'У', 'Л', 'Е', 'Й',
    'М', 'О', 'В', 'О', 'С', 'К', 'И', 'К', 'А', 'П',
    'А', 'Р', 'К', 'Т', 'И', 'К', 'А', 'Л', 'М', 'Н',
    'И', 'В', 'Г', 'Ы', 'А', 'О', 'К', 'С', 'П', 'Т'
];

// Определяем правильные слова
const correctWords = [
    'ПЧЕЛА', 
    'МЕД', 
    'УЛЕЙ', 
    'ВОСК', 
    'АРКТИКА', 
    'СНЕГ', 
    'ЛЕД'
];

// Переменные для отслеживания состояния игры
let selectedLetters = [];
let foundWords = [];
let isSelecting = false;
let startCell = null;

// Создаем игровое поле
function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    
    // Очищаем игровое поле
    gameBoard.innerHTML = '';
    
    // Добавляем буквы на игровое поле
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 10; j++) {
            const letterIndex = i * 10 + j;
            if (letterIndex < letters.length) {
                const letterElement = document.createElement('div');
                letterElement.className = 'letter';
                letterElement.textContent = letters[letterIndex];
                letterElement.dataset.row = i;
                letterElement.dataset.col = j;
                
                // Добавляем обработчики событий
                letterElement.addEventListener('mousedown', startSelection);
                letterElement.addEventListener('mouseover', continueSelection);
                letterElement.addEventListener('mouseup', endSelection);
                
                gameBoard.appendChild(letterElement);
            }
        }
    }
    
    // Обработчик для отмены выделения при клике вне игрового поля
    document.addEventListener('mouseup', endSelection);
}

// Начало выделения
function startSelection(event) {
    isSelecting = true;
    selectedLetters = [];
    clearSelection();
    
    const letterElement = event.target;
    if (letterElement.classList.contains('letter') && !letterElement.classList.contains('found')) {
        startCell = letterElement;
        selectLetter(letterElement);
    }
}

// Продолжение выделения
function continueSelection(event) {
    if (!isSelecting) return;
    
    const letterElement = event.target;
    if (letterElement.classList.contains('letter') && !letterElement.classList.contains('found')) {
        const row = parseInt(letterElement.dataset.row);
        const col = parseInt(letterElement.dataset.col);
        const startRow = parseInt(startCell.dataset.row);
        const startCol = parseInt(startCell.dataset.col);
        
        // Проверяем, что выделение идет по прямой линии (горизонтально или вертикально)
        if (row === startRow || col === startCol) {
            clearSelection();
            selectedLetters = [];
            
            // Выделяем все буквы между начальной и текущей
            const minRow = Math.min(row, startRow);
            const maxRow = Math.max(row, startRow);
            const minCol = Math.min(col, startCol);
            const maxCol = Math.max(col, startCol);
            
            for (let i = minRow; i <= maxRow; i++) {
                for (let j = minCol; j <= maxCol; j++) {
                    const cell = document.querySelector(`.letter[data-row="${i}"][data-col="${j}"]`);
                    if (cell && !cell.classList.contains('found')) {
                        selectLetter(cell);
                    }
                }
            }
        }
    }
}

// Завершение выделения
function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;
    
    // Формируем слово из выбранных букв
    const selectedWord = selectedLetters.map(letter => letter.textContent).join('');
    
    if (correctWords.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        // Слово найдено
        foundWords.push(selectedWord);
        
        // Отмечаем буквы как найденные
        selectedLetters.forEach(letter => {
            letter.classList.remove('selected');
            letter.classList.add('found');
        });
        
        // Можно добавить оповещение о найденном слове, если нужно
        // alert(`Найдено слово: ${selectedWord}`);
    } else {
        // Слово не найдено или уже было найдено ранее
        clearSelection();
    }
    
    selectedLetters = [];
    startCell = null;
}

// Выбор буквы
function selectLetter(letterElement) {
    letterElement.classList.add('selected');
    selectedLetters.push(letterElement);
}

// Очистка выделения
function clearSelection() {
    const selectedElements = document.querySelectorAll('.letter.selected');
    selectedElements.forEach(element => {
        if (!element.classList.contains('found')) {
            element.classList.remove('selected');
        }
    });
}

// Обновление списка найденных слов
function updateFoundWordsList() {
    const foundWordsList = document.getElementById('found-words-list');
    const foundCountElement = document.getElementById('found-count');
    
    // Очищаем список
    foundWordsList.innerHTML = '';
    
    // Добавляем найденные слова
    foundWords.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        foundWordsList.appendChild(listItem);
    });
    
    // Обновляем счетчик
    foundCountElement.textContent = foundWords.length;
    
    // Проверяем, если все слова найдены
    if (foundWords.length === correctWords.length) {
        setTimeout(() => {
            alert('Поздравляем! Вы нашли все слова!');
        }, 500);
    }
}

// Инициализация игры
window.addEventListener('DOMContentLoaded', () => {
    createGameBoard();
});