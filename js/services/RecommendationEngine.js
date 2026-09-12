const W1 = 0.4; // 難しかった比率の重み
const W2 = 0.6; // 関心の低さの重み
const NEUTRAL_DIFFICULTY_RATIO = 0.5; // 未経験ジャンルの中立値
const GENRE_PENALTY_WEIGHT = 0.5;
const RECOMMENDATION_COUNT = 5;

export function computeGenreScores(userProfile, subjectGenreMap) {
    const takenGenres = userProfile.takenSubjects.map(name => subjectGenreMap.get(name));
    const difficultGenres = userProfile.difficultSubjects.map(name => subjectGenreMap.get(name));

    const totalTakenCount = takenGenres.filter(Boolean).length;

    const genreTakenCounts = countByGenre(takenGenres);
    const genreDifficultCounts = countByGenre(difficultGenres);

    const genreScores = {};

    for (const genre of genreTakenCounts.keys()) {
        const takenCount = genreTakenCounts.get(genre);
        const difficultCount = genreDifficultCounts.get(genre) || 0;

        const difficultyRatio = takenCount > 0
            ? difficultCount / takenCount
            : NEUTRAL_DIFFICULTY_RATIO;

        const interestRatio = totalTakenCount > 0
            ? takenCount / totalTakenCount
            : 0;

        const lowInterest = 1 - interestRatio;

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
    const genrePenalty = userProfile.genreScores[subject.genre] ?? 0;

    return distance + genrePenalty * GENRE_PENALTY_WEIGHT;
}

export function selectRecommendedSubjects(userProfile, subjects) {
    const withScore = subjects.map(subject => ({
        subject,
        finalScore: computeFinalScore(userProfile, subject)
    }));

    withScore.sort((a, b) => a.finalScore - b.finalScore);

    return withScore.slice(0, RECOMMENDATION_COUNT).map(entry => entry.subject);
}