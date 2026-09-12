import { showSection } from './ui/Navigation.js';
import { parseCourseNames } from './services/TranscriptParser.js';
import { renderCourseCards, getSelectedCourses } from './ui/DifficultyStep.js';
import { userProfile } from './models/UserProfile.js';

// 診断を始める → 履修済み科目登録
document.querySelector('#start-button button').addEventListener('click', () => {
    showSection('main', 'course-registration');
});

// 登録する → 難しかった科目選択ステップ
document.querySelector('#register-button').addEventListener('click', () => {
    const rawText = document.querySelector('#course-paste').value;
    const courseNames = parseCourseNames(rawText);

    userProfile.takenSubjects = courseNames;

    renderCourseCards(courseNames);
    showSection('#course-registration', 'difficulty-step');
});

// 登録する → 診断
document.querySelector('#difficulty-confirm-button').addEventListener('click', () => {
    userProfile.difficultSubjects = getSelectedCourses();

    console.log(userProfile);

    showSection('main', 'diagnosis');
});