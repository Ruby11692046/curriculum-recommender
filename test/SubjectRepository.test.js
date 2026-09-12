import { getGenreFromNumbering } from '../js/services/SubjectRepository.js';

function assertEqual(actual, expected, message) {
    console.log(actual === expected ? `✅ ${message}` : `❌ ${message}（実際: ${actual}, 期待: ${expected}）`);
}

const genreMap = {
    'INT': '導入科目',
    'BSC': '基礎科目',
    'CAR': '社会接続',
    'OPT': '自由'
};

assertEqual(getGenreFromNumbering('BSC-1-A2-1234-016', genreMap), '基礎科目', 'BSCプレフィックスが正しく判定される');
assertEqual(getGenreFromNumbering('CAR-1-C1-0204-004', genreMap), '社会接続', 'CARプレフィックスが正しく判定される');
assertEqual(getGenreFromNumbering('GRAD-1-A1-0001-001', genreMap), null, '未対応prefix「GRAD」はnullになる');

console.log('---');
console.log('SubjectRepository テスト完了');