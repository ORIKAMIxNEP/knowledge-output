const postsContainer = document.getElementById('posts');

// outputフォルダ内のマークダウンファイルを指定
const path = 'https://orikamixnep.github.io/knowledge-output/posts/'
const files = [];

for (let i = 2024; i <= 2025; i++) {
    files.push(path + i + '.md');
}

// マークダウンファイルを読み込む
async function fetchMarkdown(file) {
    const response = await fetch(file);
    const text = await response.text();

    // 日付・タイトルを抽出
    const lines = text.split('\n');
    const date = lines[0]?.match(/\d{4}-\d{2}-\d{2}/)?.[0] || 'Undefined';
    const title = lines[1]?.replace('# ', '').trim() || 'Undefined';

    // 本文 (タイトルや日付行を除いた内容)
    const content = text
        .replace(dateMatch?.[0] || '', '') // 日付行を削除
        .replace(titleMatch?.[0] || '', '') // タイトル行を削除
        .trim();

    return { date, title, content };
}

// 投稿をレンダリング
async function loadPosts() {
    const posts = [];

    for (const file of files) {
        const { date, title, content } = await fetchMarkdown(file);
        const htmlContent = marked(content); // マークダウンをHTMLに変換
        posts.push({ date, title, htmlContent });
    }

    // 日付順に並び替え
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // HTMLにレンダリング
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        postElement.innerHTML = `
            <div class="post-title">${post.title}</div>
            <div class="post-date">${post.date}</div>
            <div class="post-content">${post.htmlContent}</div>
        `;

        postsContainer.appendChild(postElement);
    });
}

loadPosts();
