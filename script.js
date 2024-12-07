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

    // 日付・タイトル・本文を抽出
    const lines = text.split('\n');
    const date = lines[0]?.match(/\d{4}-\d{2}-\d{2}/)?.[0] || 'Undefined';
    const title = lines[1]?.replace('# ', '').trim() || 'Undefined';
    const content = lines.slice(2).join('\n');

    return { date, title, content };
}

// 投稿をレンダリング
async function loadPosts() {
    const posts = [];

    for (const file of files) {
        const { date, title, content } = await fetchMarkdown(file);

        // Markdownを簡易的にHTMLに変換
        const htmlContent = content
            .replace(/^- (.+)$/gm, '<li>$1</li>') // リスト
            .replace(/\n/g, '<br>'); // 改行

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
