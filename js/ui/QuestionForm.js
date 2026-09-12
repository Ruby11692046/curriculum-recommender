import { fetchSubjects } from '../services/SubjectRepository.js';

const ANSWER_OPTIONS = [
    { label: 'はい', score: 1 },
    { label: '多分はい', score: 0.75 },
    { label: '多分いいえ', score: 0.25 },
    { label: 'いいえ', score: 0 }
];

let questions = [];
let currentIndex = 0;
let answers = {};
let subjectsPromise = null;

export async function initQuestionForm() {
    subjectsPromise = fetchSubjects();
    const response = await fetch('./data/questions.json');
    questions = await response.json();
    currentIndex = 0;
    answers = {};
    renderCurrentQuestion();
}

function renderCurrentQuestion() {
    const question = questions[currentIndex];
    const container = document.querySelector('#diagnosis .question-container');
    container.innerHTML = '';

    const progress = document.createElement('p');
    progress.className = 'question-progress';
    progress.textContent = `${currentIndex + 1} / ${questions.length}`;

    const text = document.createElement('h3');
    text.textContent = question.text;

    const optionList = document.createElement('div');
    optionList.className = 'option-list';

    for (const option of ANSWER_OPTIONS) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'option-card';
        card.textContent = option.label;

        card.addEventListener('click', () => {
            answers[question.trait] = option.score;
            goToNextQuestion();
        });

        optionList.appendChild(card);
    }

    container.append(progress, text, optionList);
}

function goToNextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        renderCurrentQuestion();
    } else {
        document.dispatchEvent(new CustomEvent('questions-completed', { detail: answers }));
    }
}

export async function getSubjects() {
    return subjectsPromise;
}