const CATEGORY_BY_HUNDREDS = {
    1: 'format',      // 授業形式
    2: 'tool',        // ツール
    3: 'skill',       // 身につけたい力
    4: 'aspiration'   // なりたい姿
};

function getCategory(tagId) {
    const hundreds = Math.floor(tagId / 100);
    return CATEGORY_BY_HUNDREDS[hundreds] || null;
}

export function computeSubjectTraits(rawTags, traitTagMap) {
    const traits = {
        practicality: computeAxisRatio(rawTags, 'format', traitTagMap.practicality),
        logic: computeAxisRatio(rawTags, 'skill', traitTagMap.logic),
        expression: computeAxisRatio(rawTags, 'skill', traitTagMap.expression),
        career: computeAxisRatio(rawTags, 'aspiration', traitTagMap.career),
        exploration: computeAxisRatio(rawTags, 'aspiration', traitTagMap.exploration)
    };

    return traits;
}

function computeAxisRatio(rawTags, targetCategory, keywordList) {
    const categoryTags = rawTags.filter(tag => getCategory(tag.id) === targetCategory);

    if (categoryTags.length === 0) return 0;

    const matchedCount = categoryTags.filter(tag => keywordList.includes(tag.name)).length;

    return matchedCount / categoryTags.length;
}