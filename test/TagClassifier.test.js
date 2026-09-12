import { computeSubjectTraits } from '../js/services/TagClassifier.js';

function assertClose(actual, expected, message) {
    const isClose = Math.abs(actual - expected) < 0.0001;
    console.log(isClose ? `✅ ${message}` : `❌ ${message}（実際: ${actual}, 期待: ${expected}）`);
}

const traitTagMap = {
    practicality: ['グループワーク', '作品制作'],
    logic: ['分析力', '思考力'],
    expression: ['創造性', '想像力'],
    career: ['キャリアを考える', '起業したい'],
    exploration: ['自己を知る', '強い心を持ちたい']
};

{
    const rawTags = [
        { id: 101, name: 'グループワーク' },
        { id: 102, name: 'フィールドワーク' },
        { id: 301, name: '分析力' },
        { id: 302, name: '俯瞰力' }
    ];

    const result = computeSubjectTraits(rawTags, traitTagMap);

    // format(百の位1)タグは2個、うちキーワード一致は「グループワーク」の1個 → 1/2=0.5
    assertClose(result.practicality, 0.5, '実践度が正しく計算される');

    // skill(百の位3)タグは2個、うちキーワード一致は「分析力」の1個 → 1/2=0.5
    assertClose(result.logic, 0.5, '論理思考度が正しく計算される');

    // skillタグのうち expression のキーワード('創造性','想像力')には1個も一致しない → 0/2=0
    assertClose(result.expression, 0, '表現度が正しく計算される（一致無し）');
}

{
    const rawTags = [
        { id: 401, name: 'キャリアを考える' },
        { id: 402, name: '自己を知る' }
    ];

    const result = computeSubjectTraits(rawTags, traitTagMap);

    // aspiration(百の位4)タグ2個中、career一致は1個 → 1/2=0.5
    assertClose(result.career, 0.5, 'キャリア志向度が正しく計算される');

    // aspirationタグ2個中、exploration一致は1個 → 1/2=0.5
    assertClose(result.exploration, 0.5, '自己探究度が正しく計算される');
}

{
    const rawTags = [
        { id: 201, name: 'ツールA' }
    ];

    const result = computeSubjectTraits(rawTags, traitTagMap);

    assertClose(result.practicality, 0, '対象カテゴリのタグが無い場合0になる（ゼロ除算されない）');
}

{
    const rawTags = [];

    const result = computeSubjectTraits(rawTags, traitTagMap);

    assertClose(result.practicality, 0, 'タグが1個も無い場合も0になる');
    assertClose(result.career, 0, 'タグが1個も無い場合も0になる（career）');
}

console.log('---');
console.log('TagClassifier テスト完了');