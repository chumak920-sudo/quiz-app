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

// Початковий рендер списку питань та лічильника
renderQuestions(quizData);
questionsCountElement.textContent = `Кількість питань: ${quizData.length}`;

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

  // Перевіряємо відповідь відносно correctIndex ПОТОЧНОГО питання
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

  // Перемальовуємо список питань та оновлюємо підсумок
  renderQuestions(quizData);
  questionsCountElement.textContent = `Кількість питань: ${quizData.length} (перевірено: ${quizResults.length})`;
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