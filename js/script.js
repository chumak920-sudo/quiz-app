console.log("script.js підключено");

// Знаходимо першу статичну картку історії спроб і видаляємо її програмно
const staticCard = document.querySelector(".card");
if (staticCard) {
  staticCard.remove();
}

// Знаходимо наші елементи на сторінці, щоб JavaScript міг з ними працювати
const listContainer = document.querySelector("#questions-list");
const questionsCountElement = document.querySelector("#questions-count");

// Масив об'єктів питань: кожне питання має свої варіанти (options) та індекс правильної відповіді (correctIndex)
const quizData = [
  {
    question: "Яке місто є столицею Австрії?",
    options: ["Відень", "Берлін"],
    correctIndex: 0,
    answer: "Відень",
    answered: false,
    userAnswer: "",
    isCorrect: false,
  },
  {
    question: "Скільки кольорів у веселці?",
    options: ["5", "7"],
    correctIndex: 1,
    answer: "7",
    answered: false,
    userAnswer: "",
    isCorrect: false,
  },
  {
    question: "Яка планета третя від Сонця?",
    options: ["Марс", "Земля"],
    correctIndex: 1,
    answer: "Земля",
    answered: false,
    userAnswer: "",
    isCorrect: false,
  },
];

// Окремий масив для збереження результатів спроб
const quizResults = [];

// --- Функція рендеру списку питань ---
// Крок 7 (Практикум 10): Ручний DOM-рендер закоментовано, оскільки відображення списку
// та підрахунок балів тепер виконує реактивний компонент Vue 3 <quiz-question>.
/*
function renderQuestions(questions) {
  listContainer.innerHTML = "";

  for (const item of questions) {
    const liItem = document.createElement("li");
    liItem.setAttribute("data-answer", item.answer);

    if (item.answered) {
      liItem.classList.add("answered");
      liItem.textContent = `${item.question} — Відповідь: "${item.userAnswer}" (${item.isCorrect ? "правильно" : "неправильно"})`;
    } else {
      liItem.textContent = item.question;
    }

    listContainer.append(liItem);
  }
}
*/

// Функція обробляє масив питань і перевіряє тестову відповідь користувача
function checkQuizAnswers() {
  const userAnswer = "Відень";

  console.log("--- Аналіз питань вікторини ---");

  for (const item of quizData) {
    console.log(`Питання: ${item.question}`);

    if (userAnswer === item.answer) {
      console.log("Результат: правильно ✅");
    } else {
      console.log("Результат: неправильно ❌");
    }
  }
}

checkQuizAnswers();

const calcScorePercent = (correctCount, total) =>
  Math.round((correctCount / total) * 100);

const myScore = calcScorePercent(8, 10);
console.log(`\nТвій результат: ${myScore}% правильних відповідей!`);

// Початковий рендер списку питань та лічильника (замінено на Vue у Практикумі 10)
// renderQuestions(quizData);
// questionsCountElement.textContent = `Кількість питань: ${quizData.length}`;

// --- Обробка подій, форми та валідація ---
const quizForm = document.querySelector("#quiz-form");
const radioButtons = quizForm.querySelectorAll('input[name="user-answer"]');
const nextQuestionBtn = document.querySelector("#next-question-btn");
const formQuestionText = quizForm.querySelector(".question-text");
const questionNumberText = document.querySelector(".question-number");
const progressBarFill = document.querySelector(".progress-bar-fill");
let currentQuestionIndex = 0;

// Допоміжна функція для скидання зеленої/червоної підсвітки кнопок
function clearAnswerStyles() {
  const labels = quizForm.querySelectorAll(".answer-option");
  labels.forEach((label) => {
    label.classList.remove("is-correct", "is-incorrect");
    const indicator = label.querySelector(".status-indicator");
    if (indicator) {
      indicator.textContent = "";
    }
  });
}

// Функція виведення поточного питання та його варіантів відповідей у радіокнопки
function renderCurrentQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];

  formQuestionText.textContent = currentQuestion.question;

  if (questionNumberText) {
    questionNumberText.textContent = `Питання ${currentQuestionIndex + 1}/${quizData.length}`;
  }
  if (progressBarFill) {
    const progressPercent = Math.round(
      ((currentQuestionIndex + 1) / quizData.length) * 100
    );
    progressBarFill.style.width = `${progressPercent}%`;
  }

  // Підставляємо варіанти відповідей поточного питання в радіокнопки
  radioButtons.forEach((radio, index) => {
    const optionValue = currentQuestion.options[index];
    radio.value = optionValue;
    const label = radio.closest(".answer-option");
    const answerTextSpan = label.querySelector(".answer-text");
    if (answerTextSpan) {
      answerTextSpan.textContent = optionValue;
    }
  });

  clearAnswerStyles();
  quizForm.reset();
}

// Ініціалізуємо перше питання при завантаженні
renderCurrentQuestion();

// Обробник відправки форми
quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearAnswerStyles();

  let chosenIndex = -1;
  let userAnswer = "";
  let chosenLabel = null;

  radioButtons.forEach((radio, index) => {
    if (radio.checked) {
      chosenIndex = index;
      userAnswer = radio.value;
      chosenLabel = radio.closest(".answer-option");
    }
  });

  // Перевіряємо відповідь відносно correctIndex поточного питання
  const currentQuestion = quizData[currentQuestionIndex];
  const isCorrect = chosenIndex === currentQuestion.correctIndex;
  console.log(isCorrect ? "Правильно! ✅" : "Неправильно ❌");

  // Динамічно додаємо зелену або червону підсвітку обраній кнопці
  if (chosenLabel) {
    const indicator = chosenLabel.querySelector(".status-indicator");
    if (isCorrect) {
      chosenLabel.classList.add("is-correct");
      if (indicator) indicator.textContent = "✓ Правильно";
    } else {
      chosenLabel.classList.add("is-incorrect");
      if (indicator) indicator.textContent = "✗ Неправильно";
    }
  }

  // Зберігаємо результат перевірки для поточного питання та додаємо запис в окремий масив quizResults
  currentQuestion.answered = true;
  currentQuestion.userAnswer = userAnswer;
  currentQuestion.isCorrect = isCorrect;

  quizResults.push({
    question: currentQuestion.question,
    answer: userAnswer,
    isCorrect: isCorrect,
  });

  // Перемальовуємо список питань та оновлюємо підсумок (замінено на Vue у Практикумі 10)
  // renderQuestions(quizData);
  // const answeredCount = quizData.filter((item) => item.answered).length;
  // questionsCountElement.textContent = `Кількість питань: ${quizData.length} (перевірено: ${answeredCount})`;

  // Очищуємо форму після успішного додавання
  quizForm.reset();
});

// --- Додаткова клієнтська валідація ---
radioButtons.forEach((radio) => {
  radio.addEventListener("invalid", () => {
    if (!quizForm.querySelector('input[name="user-answer"]:checked')) {
      radio.setCustomValidity(
        "Будь ласка, оберіть один із варіантів відповіді!"
      );
    }
  });

  radio.addEventListener("change", () => {
    clearAnswerStyles();
    radioButtons.forEach((btn) => btn.setCustomValidity(""));
    console.log(`Валідацію пройдено: обрано "${radio.value}"`);
  });
});

// --- Друга подія варіанта (click по кнопці «Наступне питання») ---
nextQuestionBtn.addEventListener("click", () => {
  currentQuestionIndex = (currentQuestionIndex + 1) % quizData.length;
  renderCurrentQuestion();
  console.log(
    `Переключено на питання: ${quizData[currentQuestionIndex].question}`
  );
});

// --- Клієнт для відомого API (Open Trivia Database) ---
// Крок 2-3: Створюємо async-функцію запиту, виконуємо fetch і чекаємо відповідь
// Джерело даних: https://opentdb.com/api.php?amount=10&type=multiple
const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";

async function loadQuizData() {
  showLoading(true);

  try {
    const response = await fetch(API_URL);

    // Перевіряємо HTTP-статус відповіді
    if (!response.ok) {
      throw new Error(`Сервер відповів кодом ${response.status}`);
    }

    // Розбираємо тіло відповіді як JSON
    const data = await response.json();
    console.log("Отримані дані з API:", data);

    // Адаптуємо поля results[].question, correct_answer, incorrect_answers
    // та виводимо отримані дані в DOM через функцію рендеру з практикуму 7
    const apiQuestions = data.results.map((item) => {
      const cleanQuestion = decodeHtmlEntities(item.question);
      const cleanCorrect = decodeHtmlEntities(item.correct_answer);
      const cleanIncorrect = item.incorrect_answers
        .map((ans) => decodeHtmlEntities(ans))
        .join(", ");

      return {
        question: `${cleanQuestion} (Правильна: ${cleanCorrect} | Неправильні: ${cleanIncorrect})`,
        answer: cleanCorrect,
      };
    });

    // Ручний рендер у #questions-list вимкнено у Практикумі 10, щоб не перезаписувати Vue-компонент
    // renderQuestions(apiQuestions);
    // questionsCountElement.textContent = `Кількість питань: ${apiQuestions.length}`;
  } catch (error) {
    // Обробляємо помилку (повідомлення на сторінці + деталі в консоль)
    if (errorMessage) {
      errorMessage.textContent =
        "Не вдалося завантажити питання вікторини. Перевірте з'єднання та спробуйте ще раз.";
      errorMessage.hidden = false;
    }
    console.error("Помилка під час завантаження даних з API:", error);
  } finally {
    // Вимикаємо стан завантаження в блоці finally незалежно від результату
    showLoading(false);
  }
}

// --- Допоміжні елементи та функції для Кроків 6-7 ---
const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");
const reloadBtn = document.querySelector("#reload-btn");

// Розкодування HTML-сутностей (&quot;, &#039;, &amp; тощо) для Кроку 6
function decodeHtmlEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

// Керування індикатором завантаження для Кроку 7
function showLoading(isLoading) {
  if (loadingMessage) {
    loadingMessage.hidden = !isLoading;
  }
  if (reloadBtn) {
    reloadBtn.disabled = isLoading;
  }
  if (isLoading && errorMessage) {
    errorMessage.hidden = true;
    errorMessage.textContent = "";
  }
}

// Прив'язуємо повторний виклик loadQuizData() до кнопки «Оновити»
if (reloadBtn) {
  reloadBtn.addEventListener("click", () => {
    loadQuizData();
  });
}

// Запускаємо завантаження даних при відкритті сторінки
loadQuizData();

// Переносимо масив питань варіанта та лічильник балів у реактивний стан data()
const app = Vue.createApp({
  data() {
    return {
      score: 0,
      questions: [
        {
          id: 1,
          question: "Яке місто є столицею Австрії?",
          options: ["Відень", "Берлін"],
          correctIndex: 0,
          answered: false,
          userAnswer: "",
          isCorrect: false,
        },
        {
          id: 2,
          question: "Скільки кольорів у веселці?",
          options: ["5", "7"],
          correctIndex: 1,
          answered: false,
          userAnswer: "",
          isCorrect: false,
        },
        {
          id: 3,
          question: "Яка планета третя від Сонця?",
          options: ["Марс", "Земля"],
          correctIndex: 1,
          answered: false,
          userAnswer: "",
          isCorrect: false,
        },
      ],
    };
  },
  // Обробка події answer(selectedIndex) у батьківському компоненті
  methods: {
    checkAnswer(questionId, selectedIndex) {
      const item = this.questions.find((q) => q.id === questionId);
      if (!item) return;

      // Якщо раніше вже була правильна відповідь, знімаємо попередній бал при перевиборі
      if (item.answered && item.isCorrect) {
        this.score--;
      }

      item.answered = true;
      item.userAnswer = item.options[selectedIndex];
      item.isCorrect = selectedIndex === item.correctIndex;

      if (item.isCorrect) {
        this.score++;
      }
    },
  },
});

// Окремий компонент QuizQuestion із props, рендером v-for та подією $emit('answer', selectedIndex)
app.component("quiz-question", {
  props: ["question", "options", "correctIndex", "answered", "userAnswer", "isCorrect"],
  emits: ["answer"],
  template: `
    <li :class="{ answered: answered }" style="margin-bottom: 12px;">
      <strong>{{ question }}</strong>
      <div style="margin-top: 6px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <button
          v-for="(option, index) in options"
          :key="index"
          type="button"
          @click="$emit('answer', index)"
          style="padding: 4px 12px; cursor: pointer;"
        >
          {{ option }}
        </button>
        <span v-if="answered" :style="{ color: isCorrect ? '#2e7d32' : '#c62828', fontWeight: '600' }">
          — Відповідь: "{{ userAnswer }}" ({{ isCorrect ? 'правильно ✓' : 'неправильно ✗' }})
        </span>
      </div>
    </li>
  `,
});

// Монтуємо Vue-застосунок у секцію списку питань
app.mount("#vue-quiz-app");

// --- Локальні сховища даних ---

// Модель даних результатів проходжень квізу (id, date, score, total)
const STORAGE_KEY = "quizResultsStorage";
const resultsContainer = document.querySelector("#results .cards");

const defaultQuizHistory = [
  { id: 1, date: "16 вересня", score: 10, total: 10 },
  { id: 2, date: "17 вересня", score: 9, total: 10 },
  { id: 3, date: "15 вересня", score: 8, total: 10 },
];

// Збереження та читання даних із localStorage з обробкою помилок у try/catch
function saveToLocalStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Пошкоджені дані в localStorage:", error);
    return [];
  }
}

// Функція рендеру карток найкращих результатів (сортування за спаданням score)
function renderResultsHistory(resultsList) {
  if (!resultsContainer) return;
  resultsContainer.innerHTML = "";

  const sortedResults = [...resultsList].sort((a, b) => b.score - a.score);

  for (const item of sortedResults) {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <h3>Спроба: ${item.date}</h3>
      <p>Результат: <strong>${item.score}/${item.total}</strong> правильних відповідей</p>
    `;
    resultsContainer.append(card);
  }
}

// Ініціалізуємо початкові дані в localStorage, якщо сховище ще порожнє
let savedHistory = loadFromLocalStorage();
if (savedHistory.length === 0) {
  savedHistory = defaultQuizHistory;
  saveToLocalStorage(savedHistory);
}
renderResultsHistory(savedHistory);

// Прив'язуємо збереження результату до дій користувача (після перевірки відповіді/завершення квізу)
quizForm.addEventListener("submit", () => {
  // Рахуємо поточний результат за всіма перевіреними питаннями
  const answeredQuestions = quizData.filter((q) => q.answered);
  const currentScore = answeredQuestions.filter((q) => q.isCorrect).length;

  // Коли користувач відповів на всі питання квізу - зберігаємо спробу в localStorage
  if (answeredQuestions.length === quizData.length) {
    const currentHistory = loadFromLocalStorage();
    const nextId =
      currentHistory.length > 0
        ? Math.max(...currentHistory.map((item) => item.id)) + 1
        : 1;
    const newResult = {
      id: nextId,
      date: new Date().toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }),
      score: currentScore,
      total: quizData.length,
    };

    currentHistory.push(newResult);
    saveToLocalStorage(currentHistory);
    renderResultsHistory(currentHistory);
    console.log("Результат квізу збережено в localStorage:", newResult);
  }
});

// Проєктуємо схему IndexedDB (назва бази "QuizDB", версія 1, сховище "results", keyPath "id", autoIncrement: true)
const DB_NAME = "QuizDB";
const DB_VERSION = 1;
const STORE_NAME = "results";

// Реалізуємо openDB() з обробником onupgradeneeded для створення сховища
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        console.log(`Об'єктне сховище "${STORE_NAME}" успішно створено.`);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Реалізуємо CRUD-функції addItem та getAllItems через транзакції readwrite/readonly
async function addItem(resultItem) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(resultItem);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("Помилка під час додавання запису в IndexedDB:", error);
  }
}

async function getAllItems() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Помилка під час читання з IndexedDB:", error);
    return [];
  }
}

// Виконуємо одноразову міграцію з localStorage у IndexedDB при першому запуску
async function migrateFromLocalStorage() {
  const isMigrated = localStorage.getItem("dbMigrated");
  if (isMigrated) return;

  try {
    const localDataRaw = localStorage.getItem("quizResultsStorage");
    if (localDataRaw) {
      const localItems = JSON.parse(localDataRaw);
      const dbItems = await getAllItems();

      if (dbItems.length === 0 && localItems.length > 0) {
        for (const item of localItems) {
          // Видаляємо старий ручний id, щоб IndexedDB згенерувала його автоматично через autoIncrement
          const { id, ...itemWithoutId } = item;
          await addItem(itemWithoutId);
        }
        console.log("Успішна міграція даних із localStorage в IndexedDB!");
      }
    }
    localStorage.setItem("dbMigrated", "true");
  } catch (error) {
    console.error("Помилка під час міграції даних:", error);
  }
}

// Функція рендеру карток найкращих результатів на сторінці
function renderResultsHistory(resultsList) {
  if (!resultsContainer) return;
  resultsContainer.innerHTML = "";

  const sortedResults = [...resultsList].sort((a, b) => b.score - a.score);

  for (const item of sortedResults) {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <h3>Спроба: ${item.date} (ID: ${item.id})</h3>
      <p>Результат: <strong>${item.score}/${item.total}</strong> правильних відповідей</p>
    `;
    resultsContainer.append(card);
  }
}

// Переводимо первинний рендер на асинхронне читання даних з IndexedDB
async function initResults() {
  await migrateFromLocalStorage();
  const items = await getAllItems();
  
  // Якщо база взагалі порожня - додаємо дефолтні спроби для краси
  if (items.length === 0) {
    const defaults = [
      { date: "16 вересня", score: 10, total: 10 },
      { date: "17 вересня", score: 9, total: 10 },
      { date: "15 вересня", score: 8, total: 10 },
    ];
    for (const d of defaults) {
      await addItem(d);
    }
    renderResultsHistory(await getAllItems());
  } else {
    renderResultsHistory(items);
  }
}

initResults();

// Оновлюємо обробник форми: після завершення квізу зберігаємо результат в IndexedDB та обробляємо помилки
quizForm.addEventListener("submit", async () => {
  const answeredQuestions = quizData.filter((q) => q.answered);
  const currentScore = answeredQuestions.filter((q) => q.isCorrect).length;

  if (answeredQuestions.length === quizData.length) {
    const newResult = {
      date: new Date().toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }),
      score: currentScore,
      total: quizData.length,
    };

    try {
      await addItem(newResult);
      const updatedItems = await getAllItems();
      renderResultsHistory(updatedItems);
      console.log("Результат успішно збережено в IndexedDB:", newResult);
    } catch (error) {
      // Обробка помилки відкриття/запису бази (наприклад, у режимі приватного перегляду)
      console.error("IndexedDB недоступна:", error);
      alert("Не вдалося зберегти результат: сховище IndexedDB заблоковане або недоступне.");
    }
  }
});

// --- Анімований таймер зворотного відліку на Canvas ---

// Отримуємо <canvas> та 2D-контекст для малювання
const timerCanvas = document.querySelector("#quiz-timer");
const timerCtx = timerCanvas ? timerCanvas.getContext("2d") : null;

// Функція розрахунку ліміту часу на основі даних масиву quizData
function getQuestionTimeLimit() {
  const currentQuestion = quizData[currentQuestionIndex];
  const optionsCount = currentQuestion ? currentQuestion.options.length : 2;
  return optionsCount * 5; // 5 секунд на кожен варіант відповіді (для 2 варіантів = 10 с)
}

// Функція відображення поточного стану таймера через ctx.arc()
function drawTimer(remainingTime, totalTime) {
  if (!timerCtx || !timerCanvas) return;

  const centerX = timerCanvas.width / 2;
  const centerY = timerCanvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  const progress = Math.max(0, remainingTime / totalTime);

  // Очищуємо полотно перед перемальовуванням кадру
  timerCtx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);

  // Фонове сіре кільце
  timerCtx.beginPath();
  timerCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  timerCtx.strokeStyle = "#e0e0e0";
  timerCtx.lineWidth = 8;
  timerCtx.stroke();

  // Активна дуга, що зменшується щокадру (починається зверху: -Math.PI / 2)
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + Math.PI * 2 * progress;

  timerCtx.beginPath();
  timerCtx.arc(centerX, centerY, radius, startAngle, endAngle);
  timerCtx.strokeStyle = progress > 0.3 ? "#6200ea" : "#c62828";
  timerCtx.lineWidth = 8;
  timerCtx.lineCap = "round";
  timerCtx.stroke();

  // Текст із залишком секунд у центрі кола
  timerCtx.fillStyle = "#222222";
  timerCtx.font = "bold 20px Montserrat, sans-serif";
  timerCtx.textAlign = "center";
  timerCtx.textBaseline = "middle";
  timerCtx.fillText(`${Math.ceil(remainingTime)} с`, centerX, centerY);
}

// Цикл анімації через requestAnimationFrame
let timerAnimationId = null;
let timerStartTime = null;
let currentTotalTime = getQuestionTimeLimit();

function animateTimer(timestamp) {
  if (!timerStartTime) {
    timerStartTime = timestamp;
  }

  const elapsedSeconds = (timestamp - timerStartTime) / 1000;
  const remainingTime = Math.max(0, currentTotalTime - elapsedSeconds);

  drawTimer(remainingTime, currentTotalTime);

  if (remainingTime > 0) {
    timerAnimationId = requestAnimationFrame(animateTimer);
  } else {
    stopTimer();
    console.log("Час на відповідь вичерпано!");
  }
}

function startTimer() {
  stopTimer();
  currentTotalTime = getQuestionTimeLimit();
  timerStartTime = null;
  drawTimer(currentTotalTime, currentTotalTime);
  timerAnimationId = requestAnimationFrame(animateTimer);
}

function stopTimer() {
  if (timerAnimationId !== null) {
    cancelAnimationFrame(timerAnimationId);
    timerAnimationId = null;
  }
}

// Запускаємо таймер при відкритті сторінки
startTimer();

// Прив'язуємо анімацію таймера до реальних дій користувача
quizForm.addEventListener("submit", () => {
  stopTimer();
  console.log("Таймер зупинено після відправки відповіді.");
});

nextQuestionBtn.addEventListener("click", () => {
  startTimer();
  console.log("Таймер перезапущено для нового питання.");
});

// Коректне завершення анімації при переході на іншу вкладку або закритті сторінки
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTimer();
    console.log("Вкладку приховано — анімацію зупинено через cancelAnimationFrame.");
  }
});

window.addEventListener("beforeunload", () => {
  stopTimer();
});