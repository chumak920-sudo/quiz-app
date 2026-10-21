console.log('script.js підключено');

// Знаходимо першу статичну картку історії спроб і видаляємо її програмно
const staticCard = document.querySelector('.card');
if (staticCard) {
    staticCard.remove();
}

// Знаходимо наші елементи на сторінці, щоб JavaScript міг з ними працювати
const listContainer = document.querySelector('#questions-list');
const questionsCountElement = document.querySelector('#questions-count');

// --- Функція рендеру списку ---
function renderQuestions(questions) {
    // Очищуємо контейнер на випадок, якщо там вже щось було
    listContainer.innerHTML = ''; 

    // Крок 4: Проходимо масив циклом
    for (const item of questions) {
        
        // Крок 5: Створюємо елемент li та заповнюємо його текстом питання
        const liItem = document.createElement('li');
        liItem.textContent = item.question;
        
        // Крок 6: Додаємо атрибут із правильною відповіддю та клас
        liItem.setAttribute('data-answer', item.answer);
        liItem.classList.add('answered'); 
        
        // Крок 7: Додаємо готовий елемент у контейнер на сторінці
        listContainer.append(liItem);
    }
}

// Створюємо константу (масив об'єктів), яка зберігає питання та відповіді до них
const quizData = [
    { question: "Яке місто є столицею Австрії?", answer: "Відень" },
    { question: "Скільки кольорів у веселці?", answer: "7" },
    { question: "Яка планета третя від Сонця?", answer: "Земля" }
];

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
const calcScorePercent = (correctCount, total) => Math.round(correctCount / total * 100);

// Викликаємо стрілкову функцію з реальними даними та виводимо результат у консоль
const myScore = calcScorePercent(8, 10);
console.log(`\nТвій результат: ${myScore}% правильних відповідей!`);

// Викликаємо функцію, передаючи їй наш масив quizData
renderQuestions(quizData);

// Змінюємо текст лічильника, використовуючи довжину масиву (length)
questionsCountElement.textContent = `Кількість питань: ${quizData.length}`;
