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

    // 日付を認識 (YYYY-MM-DD形式を探す)
    const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
    const date = dateMatch ? dateMatch[0] : '不明な日付';

    // タイトル (# Title) を抽出
    const titleMatch = text.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : '無題';

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
