export function showSection(id) {
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.toggle('is-active', section.id === id);
    });
}