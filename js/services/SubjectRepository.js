import { computeSubjectTraits } from './TagClassifier.js';

const API_URL = 'https://api.syllabus.zen.ac.jp/search';

let genreMapCache = null;
let traitTagMapCache = null;

async function loadGenreMap() {
    if (genreMapCache) return genreMapCache;
    const response = await fetch('./data/genreList.json');
    genreMapCache = await response.json();
    return genreMapCache;
}

export function getGenreFromNumbering(numbering, genreMap) {
    const prefix = numbering.split('-')[0];
    return genreMap[prefix] || null;
}

async function fetchAllPages() {
    const firstResponse = await fetch(`${API_URL}?page=0`);
    const firstData = await firstResponse.json();

    const allSubjects = [...firstData.subjects];
    const totalPages = firstData.totalPages;

    for (let page = 1; page < totalPages; page++) {
        const response = await fetch(`${API_URL}?page=${page}`);
        const data = await response.json();
        allSubjects.push(...data.subjects);
    }

    return allSubjects;
}

export async function fetchSubjects() {
    const genreMap = await loadGenreMap();
    const traitTagMap = await loadTraitTagMap();
    const rawSubjects = await fetchAllPages();

    return rawSubjects
        .map(item => ({
            numbering: item.numbering,
            name: item.name,
            genre: getGenreFromNumbering(item.numbering, genreMap),
            rawTags: item.tags,
            traits: computeSubjectTraits(item.tags, traitTagMap),
            openingYear: item.openingYear
        }))
        .filter(subject => subject.genre !== null);
}

async function loadTraitTagMap() {
    if (traitTagMapCache) return traitTagMapCache;
    const response = await fetch('./data/traitTagMap.json');
    traitTagMapCache = await response.json();
    return traitTagMapCache;
}


export function buildSubjectGenreMap(subjects) {
    const map = new Map();
    for (const subject of subjects) {
        map.set(subject.name, subject.genre);
    }
    return map;
}
