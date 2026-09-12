const W1 = 0.4; // 難しかった比率の重み
const W2 = 0.6; // 関心の低さの重み
const NEUTRAL_DIFFICULTY_RATIO = 0.5; // 未経験ジャンルの中立値
const GENRE_NEUTRAL_POINT = 0.5; // genreScoreの中立値
const GENRE_WEIGHT = 1.2; // ジャンル傾向の影響力
const RECOMMENDATION_COUNT = 5;

export function computeGenreScores(userProfile, subjectGenreMap) {
    const takenGenres = userProfile.takenSubjects.map(name => subjectGenreMap.get(name));
    const difficultGenres = userProfile.difficultSubjects.map(name => subjectGenreMap.get(name));

    const genreTakenCounts = countByGenre(takenGenres);
    const genreDifficultCounts = countByGenre(difficultGenres);

    const genreScores = {};
    const maxTakenCount = genreTakenCounts.size > 0
        ? Math.max(...genreTakenCounts.values())
        : 0;

    for (const genre of genreTakenCounts.keys()) {
        const takenCount = genreTakenCounts.get(genre);
        const difficultCount = genreDifficultCounts.get(genre) || 0;

        const difficultyRatio = takenCount > 0
            ? difficultCount / takenCount
            : NEUTRAL_DIFFICULTY_RATIO;

        // 一番履修数が多いジャンルを基準(1)にして、他ジャンルはその相対値にする
        const relativeInterest = maxTakenCount > 0 ? takenCount / maxTakenCount : 0;
        const lowInterest = 1 - relativeInterest;

        genreScores[genre] = W1 * difficultyRatio + W2 * lowInterest;
    }

    return genreScores;
}

function countByGenre(genreList) {
    const counts = new Map();
    for (const genre of genreList) {
        if (!genre) continue;
        counts.set(genre, (counts.get(genre) || 0) + 1);
    }
    return counts;
}

export function computeTraitsDistance(userTraits, subjectTraits) {
    const axes = Object.keys(userTraits);

    const squaredSum = axes.reduce((sum, axis) => {
        const diff = userTraits[axis] - (subjectTraits[axis] ?? 0);
        return sum + diff * diff;
    }, 0);

    const distance = Math.sqrt(squaredSum);
    return distance / Math.sqrt(axes.length);
}

export function computeFinalScore(userProfile, subject) {
    const distance = computeTraitsDistance(userProfile.traits, subject.traits);
    const genreScore = userProfile.genreScores[subject.genre] ?? GENRE_NEUTRAL_POINT;
    const genreOffset = genreScore - GENRE_NEUTRAL_POINT;

    return distance + genreOffset * GENRE_WEIGHT;
}

export function selectRecommendedSubjects(userProfile, subjects) {
    const uniqueSubjects = dedupeByName(subjects);

    const withScore = uniqueSubjects.map(subject => ({
        subject,
        finalScore: computeFinalScore(userProfile, subject)
    }));

    withScore.sort((a, b) => a.finalScore - b.finalScore);

    return withScore.slice(0, RECOMMENDATION_COUNT).map(entry => entry.subject);
}

function dedupeByName(subjects) {
    const seen = new Map();
    for (const subject of subjects) {
        if (!seen.has(subject.name)) {
            seen.set(subject.name, subject);
        }
    }
    return Array.from(seen.values());
}