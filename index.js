// script.js

let currentQuestionIndex = -1;
let questions;
let isQuestionAnswered = false;

function playQuiz() {
    window.location.href = 'quiz.html';
}

function openAbout() {
    window.location.href = 'about.html';
}

function openHowToPlay() {
    window.location.href = 'howtoplay.html'
}

function fetchQuestionsAndStartQuiz() {
    // Fetch questions from the JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            nextQuestion();
        });
}

function quit() {
    window.location.href = 'index.html';
}

var isAudioPlaying = true; // Variable to store the state of the audio toggle

function toggleMusic() {
    var audio = document.getElementById("audioPlayer");
    var button = document.getElementById("toggleMusic");

    if (isAudioPlaying) {
        audio.pause();
        button.textContent = "Audio: Off!";
        isAudioPlaying = false;
    } else {
        audio.play();
        button.textContent = "Audio: On!";
        isAudioPlaying = true;
    }
}

function nextQuestion() {
    // Display the next random unanswered question
    do {
        currentQuestionIndex = Math.floor(Math.random() * questions.length);
    } while (questions[currentQuestionIndex].answered);

    isQuestionAnswered = false;

    displayQuestion(questions[currentQuestionIndex]);
}

function displayQuestion(question) {
    const questionCount = questions.filter(q => q.answered).length + 1;
    document.getElementById('question').textContent = `Question ${questionCount}: ${question.question}`;
    document.getElementById('questionImage').src = question.image;
    document.querySelectorAll('.option').forEach((button, index) => {
        button.textContent = question.options[index];
        button.classList.remove('selected');
        button.disabled = false;
    });
}

function checkAnswer(selectedOption) {
    if (isQuestionAnswered) {
        return;
    }

    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    document.querySelectorAll('.option').forEach(button => {
        button.disabled = true; // Disable all options after answering
    });

    if (selectedOption === correctAnswer) {
        // Correct answer
        document.body.style.backgroundColor = '#2ecc71'; // Green background color
        questions[currentQuestionIndex].answered = true;
        isQuestionAnswered = true;

        setTimeout(() => {
            document.body.style.backgroundColor = ''; // Reset background color
            if (questions.every(question => question.answered)) {
                // All questions answered, reset
                questions.forEach(question => {
                    question.answered = false;
                });
            }
            nextQuestion();
        }, 1500);
    } else {
        // Wrong answer
        document.body.style.backgroundColor = '#e74c3c'; // Red background color
        isQuestionAnswered = true;

        setTimeout(() => {
            document.body.style.backgroundColor = ''; // Reset background color
            quit();
        }, 1500);
    }
}

// Call fetchQuestionsAndStartQuiz when the quiz page is loaded
if (window.location.href.includes('quiz.html')) {
    fetchQuestionsAndStartQuiz();
}

