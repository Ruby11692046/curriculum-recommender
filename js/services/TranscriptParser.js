const TEACHER_NAME_PATTERN = /^[一-龠々ぁ-んァ-ヶーA-Za-z]+[\s・][一-龠々ぁ-んァ-ヶーA-Za-z]+$/;

export function parseCourseNames(rawText) {
    const lines = rawText.split('\n');
    const courseNames = new Set();

    for (const line of lines) {
        const cells = line.split('\t').map(cell => cell.trim());
        const nonEmptyCells = cells.filter(cell => cell !== '');

        if (nonEmptyCells.length < 2) continue;

        const lastCell = nonEmptyCells[nonEmptyCells.length - 1];
        if (!TEACHER_NAME_PATTERN.test(lastCell)) continue;

        let courseName = nonEmptyCells[0];
        if (courseName === '※') {
            courseName = nonEmptyCells[1];
        }

        courseNames.add(courseName);
    }

    return Array.from(courseNames);
}