// js/ui/ResultList.js

export function renderLoading() {
    const container = document.querySelector('#result .recommendation-list');
    container.innerHTML = '';

    const loading = document.createElement('p');
    loading.className = 'loading-message';
    loading.textContent = '診断結果を計算しています…';

    container.appendChild(loading);

    const shareContainer = document.querySelector('#result .share-container');
    shareContainer.innerHTML = '';
}

export function renderResult(recommendations) {
    const container = document.querySelector('#result .recommendation-list');
    container.innerHTML = '';

    if (recommendations.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'おすすめの科目が見つかりませんでした';
        container.appendChild(empty);
        return;
    }

    for (const subject of recommendations) {
        const card = document.createElement('div');
        card.className = 'recommendation-card';

        const name = document.createElement('h3');
        name.textContent = subject.name;

        const genre = document.createElement('p');
        genre.className = 'recommendation-genre';
        genre.textContent = subject.genre;

        const link = document.createElement('a');
        link.href = `https://syllabus.zen.ac.jp/subjects/${subject.openingYear}/${subject.numbering}`;
        link.textContent = 'シラバスを見る';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        card.append(name, genre, link);
        container.appendChild(card);
    }

    renderShareButton(recommendations);
}

function renderShareButton(recommendations) {
    const container = document.querySelector('#result .share-container');
    container.innerHTML = '';

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '診断結果をシェアする';

    button.addEventListener('click', () => {
        shareResult(recommendations);
    });

    container.appendChild(button);
}

async function shareResult(recommendations) {
    const shareText = buildShareText(recommendations);

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'おすすめ履修診断の結果',
                text: shareText
            });
        } catch (error) {
            // ユーザーが共有をキャンセルした場合
        }
    } else {
        await copyToClipboard(shareText);
    }
}

function buildShareText(recommendations) {
    const lines = recommendations.map(subject => `・${subject.name}（${subject.genre}）`);
    return `おすすめ履修診断の結果\n\n${lines.join('\n')}`;
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        alert('結果をコピーしました！');
    } catch (error) {
        alert('コピーに失敗しました。お手数ですが、手動でコピーしてください。');
    }
}