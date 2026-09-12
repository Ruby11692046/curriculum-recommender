import { computeGenreScores, computeFinalScore } from '../js/services/RecommendationEngine.js';

function assertTrue(condition, message) {
    console.log(condition ? `✅ ${message}` : `❌ ${message}`);
}

function assertClose(actual, expected, message) {
    const isClose = Math.abs(actual - expected) < 0.0001;
    console.log(isClose ? `✅ ${message}` : `❌ ${message}（実際: ${actual}, 期待: ${expected}）`);
}

const subjectGenreMap = new Map([
    ['科目A', '情報'],
    ['科目B', '情報'],
    ['科目C', '数理'],
    ['科目D', '数理'],
    ['科目E', '文化・思想']
]);

{
    const userProfile = {
        takenSubjects: ['科目A', '科目B', '科目C', '科目D'],
        difficultSubjects: ['科目A']
    };

    const result = computeGenreScores(userProfile, subjectGenreMap);

    // 情報：難しかった比率=1/2=0.5、関心比率=2/4=0.5、関心の低さ=0.5
    // genreScore = 0.4*0.5 + 0.6*0.5 = 0.5
    assertClose(result['情報'], 0.5, '情報ジャンルのgenreScoreが正しい');

    // 数理：難しかった比率=0/2=0、関心比率=2/4=0.5、関心の低さ=0.5
    // genreScore = 0.4*0 + 0.6*0.5 = 0.3
    assertClose(result['数理'], 0.3, '数理ジャンルのgenreScoreが正しい');
}

{
    const userProfile = {
        takenSubjects: ['科目A'],
        difficultSubjects: []
    };

    const result = computeGenreScores(userProfile, subjectGenreMap);

    assertTrue(!('文化・思想' in result), '未履修ジャンル「文化・思想」は出力されない');
}

{
    const userProfile = {
        takenSubjects: ['科目A', '科目B'],
        difficultSubjects: ['科目A', '科目B']
    };

    const result = computeGenreScores(userProfile, subjectGenreMap);

    // 難しかった比率=2/2=1、関心比率=2/2=1、関心の低さ=0
    // genreScore = 0.4*1 + 0.6*0 = 0.4
    assertClose(result['情報'], 0.4, '全科目が難しかった場合のgenreScoreが正しい');
}

{
    const userProfile = {
        takenSubjects: [],
        difficultSubjects: []
    };

    const result = computeGenreScores(userProfile, subjectGenreMap);

    assertTrue(Object.keys(result).length === 0, '履修データが無い場合、空オブジェクトが返る（エラーにならない）');
}

{
    const userProfile = {
        traits: { practicality: 1, logic: 0.5, expression: 0, career: 0.5, exploration: 1 },
        genreScores: { '情報': 0.8 }
    };

    const subject = {
        genre: '情報',
        traits: { practicality: 1, logic: 0.5, expression: 0, career: 0.5, exploration: 1 }
    };

    // traitsが完全一致 → distance=0、genreScore=0.8 → finalScore = 0 + 0.8*0.5 = 0.4
    assertClose(computeFinalScore(userProfile, subject), 0.4, 'traits完全一致でも苦手ジャンルはペナルティが乗る');
}

{
    const userProfile = {
        traits: { practicality: 1, logic: 0.5, expression: 0, career: 0.5, exploration: 1 },
        genreScores: {}
    };

    const subject = {
        genre: '数理',
        traits: { practicality: 1, logic: 0.5, expression: 0, career: 0.5, exploration: 1 }
    };

    // 未経験ジャンルはペナルティ0 → finalScore = distance(0) + 0 = 0
    assertClose(computeFinalScore(userProfile, subject), 0, '未経験ジャンルはペナルティが乗らない');
}

console.log('---');
console.log('RecommendationEngine テスト完了');