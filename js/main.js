import { showSection } from './ui/Navigation.js';

// 診断を始める → 履修済み科目登録
document.querySelector('#start-button button').addEventListener('click', () => {
    showSection('main', 'course-registration');
});

// 登録する → 難しかった科目選択ステップ
document.querySelector('#register-button').addEventListener('click', () => {
    showSection('#course-registration', 'difficulty-step');
});

