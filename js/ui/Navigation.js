export function showSection(containerSelector, targetId) {
    document.querySelectorAll(`${containerSelector} > *[id]`).forEach(el => {
        el.classList.toggle('is-active', el.id === targetId);
    });
}