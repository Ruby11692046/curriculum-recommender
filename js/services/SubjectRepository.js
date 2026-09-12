const API_URL = 'https://api.syllabus.zen.ac.jp/search';

let genreMapCache = null;

async function loadGenreMap() {
    if (genreMapCache) return genreMapCache;
    const response = await fetch('./data/genreList.json');
    genreMapCache = await response.json();
    return genreMapCache;
}

export function getGenreFromNumbering(numbering, genreMap) { //テストのためexportをつけた
    const prefix = numbering.split('-')[0];
    return genreMap[prefix] || null;
}

export async function fetchSubjects() {
    const genreMap = await loadGenreMap();
    const response = await fetch(API_URL);
    const rawData = await response.json();

    return rawData
        .map(item => ({
            numbering: item.numbering,
            name: item.name,
            genre: getGenreFromNumbering(item.numbering, genreMap),
            rawTags: item.tags
        }))
        .filter(subject => subject.genre !== null);
}

export function buildSubjectGenreMap(subjects) {
    const map = new Map();
    for (const subject of subjects) {
        map.set(subject.name, subject.genre);
    }
    return map;
}