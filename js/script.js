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