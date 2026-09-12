export function renderCourseCards(courseNames) {
    const container = document.querySelector('#difficulty-step .course-list');
    container.innerHTML = '';

    for (const name of courseNames) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'course-card';
        card.dataset.courseName = name;
        card.textContent = name;

        card.addEventListener('click', () => {
            card.classList.toggle('is-selected');
        });

        container.appendChild(card);
    }
}

export function getSelectedCourses() {
    const selectedCards = document.querySelectorAll('#difficulty-step .course-card.is-selected');
    return Array.from(selectedCards).map(card => card.dataset.courseName);
}