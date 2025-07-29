// Данные приложения
let words = [];
let currentWordIndex = 0;

// DOM-элементы
const card = document.getElementById('card');
const front = document.getElementById('front');
const back = document.getElementById('back');
const startBtn = document.getElementById('start-btn');
const flipBtn = document.getElementById('flip-btn');
const knowBtn = document.getElementById('know-btn');
const nextBtn = document.getElementById('next-btn');
const addBtn = document.getElementById('add-btn');

// Загрузка слов
function loadWords() {
  const savedWords = localStorage.getItem('flashcardsWords');
  if (savedWords) {
    words = JSON.parse(savedWords);
  } else {
    words = [
      { russian: "Привет", english: "Hello", learned: false },
      { russian: "Дом", english: "House", learned: false },
      { russian: "Солнце", english: "Sun", learned: false },
      { russian: "Любовь", english: "Love", learned: false }
    ];
    saveWords();
  }
}

// Сохранение слов
function saveWords() {
  localStorage.setItem('flashcardsWords', JSON.stringify(words));
}

// Показать текущее слово с анимацией
function showWord() {
  if (words.length === 0) {
    front.textContent = "Добавьте слова!";
    back.textContent = "";
    return;
  }
  
  card.style.transform = 'rotateY(0deg)';
  front.textContent = words[currentWordIndex].russian;
  back.textContent = words[currentWordIndex].english;
  
  // Анимация появления
  card.style.opacity = '0';
  card.style.transform = 'scale(0.9)';
  setTimeout(() => {
    card.style.opacity = '1';
    card.style.transform = 'scale(1)';
  }, 50);
}

// Переворот карточки
function flipCard() {
  card.classList.toggle('flipped');
  
  // Вибрация для тактильного отклика
  if (navigator.vibrate) navigator.vibrate(20);
}

// Следующее слово
function nextWord() {
  currentWordIndex = (currentWordIndex + 1) % words.length;
  showWord();
}

// Отметить как изученное
function markAsKnown() {
  words[currentWordIndex].learned = true;
  saveWords();
  
  // Анимация "улетания" карточки
  card.style.transform = 'translateX(-100px) rotate(-10deg)';
  card.style.opacity = '0';
  
  setTimeout(() => {
    nextWord();
    card.style.transition = 'none';
    card.style.transform = 'translateX(100px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.transform = 'translateX(0)';
      card.style.opacity = '1';
    }, 10);
  }, 300);
}

// Добавление нового слова
function addWord() {
  const russian = document.getElementById('russian-word').value.trim();
  const english = document.getElementById('english-word').value.trim();

  if (!russian || !english) {
    // Анимация "тряски" формы
    const inputs = document.querySelectorAll('.add-word input');
    inputs.forEach(input => {
      input.style.transform = 'translateX(-5px)';
      setTimeout(() => {
        input.style.transform = 'translateX(5px)';
        setTimeout(() => {
          input.style.transform = 'translateX(0)';
        }, 100);
      }, 100);
    });
    return;
  }

  words.push({ russian, english, learned: false });
  saveWords();
  
  // Анимация успешного добавления
  addBtn.textContent = '✓ Добавлено!';
  addBtn.style.background = 'linear-gradient(45deg, #6bff9e 0%, #2ecc71 100%)';
  
  setTimeout(() => {
    addBtn.textContent = 'Добавить';
    addBtn.style.background = 'linear-gradient(45deg, #b584ff 0%, #9a5cff 100%)';
  }, 1500);
  
  document.getElementById('russian-word').value = '';
  document.getElementById('english-word').value = '';
}

// Инициализация
function init() {
  loadWords();
  
  card.addEventListener('click', flipCard);
  startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    flipBtn.disabled = false;
    knowBtn.disabled = false;
    nextBtn.disabled = false;
    showWord();
  });
  flipBtn.addEventListener('click', flipCard);
  knowBtn.addEventListener('click', markAsKnown);
  nextBtn.addEventListener('click', nextWord);
  addBtn.addEventListener('click', addWord);
}

init();