console.log('script.js підключено');

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
