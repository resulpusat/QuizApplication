const fetchQuestions = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        let data = await response.json();

        // Veriyi rastgele karıştır
        data = shuffle(data);

        // İlk 10 soruyu al
        const questions = data.slice(0, 10);

        return questions;
    } catch (error) {
        console.error('Soruları alırken bir hata oluştu:', error);
    }
};

// Fisher-Yates karıştırma algoritması
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // Remainder elements to shuffle
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Swap the elements
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

let currentQuestionIndex = 0;
let questions = [];
let countdownTimer;

// Quiz uygulamasının ana fonksiyonu
const startQuiz = async () => {
    questions = await fetchQuestions();
    showQuestion();
};

const showQuestion = () => {
    const quizContainer = document.getElementById('quiz-app');
    quizContainer.innerHTML = '';

    const questionCard = document.createElement('div');
    questionCard.classList.add('question-card');

    const questionTitle = questions[currentQuestionIndex].title;
    const options = questions[currentQuestionIndex].body.split('\n');

questionCard.innerHTML = `
    <h2>Soru ${currentQuestionIndex + 1}</h2>
    <p>${questionTitle}</p>
    <div class="options">
        <label><input type="radio" name="question${currentQuestionIndex}" value="${options[0]}"> A) ${options[0]}</label><br>
        <label><input type="radio" name="question${currentQuestionIndex}" value="${options[1]}"> B) ${options[1]}</label><br>
        <label><input type="radio" name="question${currentQuestionIndex}" value="${options[2]}"> C) ${options[2]}</label><br>
        <label><input type="radio" name="question${currentQuestionIndex}" value="${options[3]}"> D) ${options[3]}</label><br>
    </div>
    <button id="next-question" class="button block mx-auto mt-8">İleri</button>
    <div id="timer" class="timer">Kalan Süre: 30 saniye</div>
`;


    quizContainer.appendChild(questionCard);

    // İleri düğmesine tıklama olayını dinle
    document.getElementById('next-question').addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            clearInterval(countdownTimer); // Önceki süreyi durdur
            showQuestion();
        } else {
            clearInterval(countdownTimer); // Önceki süreyi durdur
            endQuiz();
        }
    });

    // Süreyi başlat
    startCountdown();
};









// Süre sayacını başlat
const startCountdown = () => {
    let timeLeft = 30;
    const timerElement = document.getElementById('timer');

    countdownTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            timeLeft = 0;
            timerElement.textContent = 'Süre Doldu!';
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                endQuiz();
            }
        } else {
            timerElement.textContent = `Kalan Süre: ${timeLeft} saniye`;
            timeLeft--;
        }
    }, 1000);
};

const endQuiz = () => {
    // Tüm soru cevaplarını topla
    const results = [];
    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption) {
            results.push(selectedOption.value); // Kullanıcının verdiği cevabı ekle
        } else {
            results.push("Belirtilmedi"); // Kullanıcı cevap vermediyse, "Belirtilmedi" metnini ekle
        }
    });

    // Sonuçları göster
    const resultsTable = document.getElementById('results-table');
    resultsTable.innerHTML = '';
    questions.forEach((question, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border border-gray-400 px-4 py-2">Soru ${index + 1}</td>
            <td class="border border-gray-400 px-4 py-2">${results[index]}</td>
        `;
        resultsTable.appendChild(row);
    });

    // Sonuçları gösterme konteynerini göster
    document.getElementById('results').classList.remove('hidden');
};







// Quiz başlatma düğmesine tıklama olayını dinle
document.getElementById('start-quiz').addEventListener('click', () => {
    startQuiz();

    // Başlat düğmesini gizle, Bitir düğmesini göster
    document.getElementById('start-quiz').classList.add('hidden');
    document.getElementById('end-quiz').classList.remove('hidden');
});
// Diğer fonksiyonlar burada...

// Sonuçları gösterme düğmesine tıklama olayını dinle
document.getElementById('show-results').addEventListener('click', () => {
    endQuiz();
});

// Quiz'i yeniden başlatma düğmesine tıklama olayını dinle
document.getElementById('restart-quiz').addEventListener('click', () => {
    startQuiz();

    // Sonuçları gizle, Quiz'i Başlat düğmesini göster
    document.getElementById('results').classList.add('hidden');
    document.getElementById('show-results').classList.add('hidden');
    document.getElementById('start-quiz').classList.remove('hidden');
});

// Quiz başlatma düğmesine tıklama olayını dinle
document.getElementById('start-quiz').addEventListener('click', () => {
    startQuiz();

    // Başlat düğmesini gizle, Sonuçları Göster ve Quiz'i Tekrar Başlat düğmelerini göster
    document.getElementById('start-quiz').classList.add('hidden');
    document.getElementById('show-results').classList.remove('hidden');
    document.getElementById('restart-quiz').classList.remove('hidden');
});
