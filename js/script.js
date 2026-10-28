console.log("script.js підключено");

// Знаходимо першу статичну картку історії спроб і видаляємо її програмно
const staticCard = document.querySelector(".card");
if (staticCard) {
  staticCard.remove();
}

// Знаходимо наші елементи на сторінці, щоб JavaScript міг з ними працювати
const listContainer = document.querySelector("#questions-list");
const questionsCountElement = document.querySelector("#questions-count");

// --- Функція рендеру списку ---
function renderQuestions(questions) {
  // Очищуємо контейнер на випадок, якщо там вже щось було
  listContainer.innerHTML = "";

  // Крок 4: Проходимо масив циклом
  for (const item of questions) {
    // Крок 5: Створюємо елемент li та заповнюємо його текстом питання
    const liItem = document.createElement("li");
    liItem.textContent = item.question;

    // Крок 6: Додаємо атрибут із правильною відповіддю та клас
    liItem.setAttribute("data-answer", item.answer);
    liItem.classList.add("answered");

    // Крок 7: Додаємо готовий елемент у контейнер на сторінці
    listContainer.append(liItem);
  }
}

// Створюємо константу (масив об'єктів), яка зберігає питання та відповіді до них
const quizData = [
  { question: "Яке місто є столицею Австрії?", answer: "Відень" },
  { question: "Скільки кольорів у веселці?", answer: "7" },
  { question: "Яка планета третя від Сонця?", answer: "Земля" },
];

// Функція обробляє масив питань і перевіряє тестову відповідь користувача
function checkQuizAnswers() {
  // Жорстко задана відповідь користувача для тестування умови
  const userAnswer = "Відень";

  console.log("--- Аналіз питань вікторини ---");

  // Використовуємо цикл for...of для перебору нашого масиву
  for (const item of quizData) {
    // Виводимо кожне питання в консоль
    console.log(`Питання: ${item.question}`);

    // Порівнюємо строго відповідь користувача з правильною відповіддю (item.answer)
    if (userAnswer === item.answer) {
      console.log("Результат: правильно ✅");
    } else {
      console.log("Результат: неправильно ❌");
    }
  }
}

// Викликаємо функцію
checkQuizAnswers();

/*
calcScorePercent приймає кількість правильних відповідей (correctCount) та 
загальну кількість питань (total) і повертає округлений відсоток успішності
*/
const calcScorePercent = (correctCount, total) =>
  Math.round((correctCount / total) * 100);

// Викликаємо стрілкову функцію з реальними даними та виводимо результат у консоль
const myScore = calcScorePercent(8, 10);
console.log(`\nТвій результат: ${myScore}% правильних відповідей!`);

// Викликаємо функцію рендеру, передаючи їй наш масив quizData
renderQuestions(quizData);

// Змінюємо текст лічильника, використовуючи довжину масиву (length)
questionsCountElement.textContent = `Кількість питань: ${quizData.length}`;

// --- Обробка подій, форми та валідація ---
const quizForm = document.querySelector("#quiz-form");
const radioButtons = quizForm.querySelectorAll('input[name="user-answer"]');
const nextQuestionBtn = document.querySelector("#next-question-btn");
const formQuestionText = quizForm.querySelector(".question-text");
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

// Обробник відправки форми
quizForm.addEventListener("submit", (event) => {
  // Скасовуємо перезавантаження сторінки
  event.preventDefault();
  clearAnswerStyles();

  // Зчитуємо значення полів та перевіряємо chosenIndex === correctIndex
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

  const correctIndex = 0; // Перший варіант ("Відень") є правильним
  const isCorrect = chosenIndex === correctIndex;
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

  // Збираємо новий об'єкт і додаємо в масив методом push
  const newQuestionRecord = {
    question: `Перевірено відповідь: "${userAnswer}" (${isCorrect ? "правильно" : "неправильно"})`,
    answer: userAnswer,
  };
  quizData.push(newQuestionRecord);

  // Перемальовуємо список та оновлюємо лічильник
  renderQuestions(quizData);
  questionsCountElement.textContent = `Кількість питань: ${quizData.length}`;

  // Очищуємо вибір радіокнопок після успішного додавання
  quizForm.reset();
});

// --- Додаткова клієнтська валідація ---
radioButtons.forEach((radio) => {
  // Якщо користувач натиснув кнопку без вибору відповіді — задаємо повідомлення помилки
  radio.addEventListener("invalid", () => {
    if (!quizForm.querySelector('input[name="user-answer"]:checked')) {
      radio.setCustomValidity(
        "Будь ласка, оберіть один із варіантів відповіді!",
      );
    }
  });

  // На подію change скидаємо помилку валідації та попередню підсвітку
  radio.addEventListener("change", () => {
    clearAnswerStyles();
    radioButtons.forEach((btn) => btn.setCustomValidity(""));
    console.log(`Валідацію пройдено: обрано "${radio.value}"`);
  });
});

// --- Друга подія варіанта (click по кнопці «Наступне питання») ---
nextQuestionBtn.addEventListener("click", () => {
  // Перемикаємо по колу індекс на наступне питання з масиву quizData
  currentQuestionIndex = (currentQuestionIndex + 1) % quizData.length;

  // Оновлюємо текст питання над радіокнопками
  formQuestionText.textContent = `Поточне питання (${currentQuestionIndex + 1}/${quizData.length}): ${quizData[currentQuestionIndex].question}`;

  // Скидаємо кольорову підсвітку та вибрану радіокнопку
  clearAnswerStyles();
  quizForm.reset();

  console.log(`Переключено на питання: ${quizData[currentQuestionIndex].question}`);
});
