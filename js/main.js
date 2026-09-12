import { showSection } from './ui/Navigation.js';

// 診断を始める → 履修済み科目登録
document.querySelector('#start-button button').addEventListener('click', () => {
    showSection('course-registration');
});

