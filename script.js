loadPosts();

async function loadPosts() {
    const postsContainer = document.getElementById('posts');

    // outputフォルダ内のマークダウンファイルを指定
    const path = 'https://orikamixnep.github.io/knowledge-output/posts/'
    const files = [];
    
    for (let i = 2025; i >= 2024; i--) {
        files.push(path + i + '.md');
    }
    const allPosts = [];

    for (const file of files) {
        const posts = await fetchMarkdown(file);
        allPosts.push(...posts); // 全てのセクションを追加
    }

    // HTMLにレンダリング
    allPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        postElement.innerHTML = `
            <div class="post-title">${post.title}</div>
            <div class="post-date">${post.date}</div>
            <div class="post-content">${marked.parse(post.content)}</div>
        `;

        postsContainer.appendChild(postElement);
    });
}

// セクション区切り文字を使って分割し、それぞれのセクションを処理
async function fetchMarkdown(file) {
    const response = await fetch(file);
    const text = await response.text();

    // 空行2つで分割
    const sections = text.split(/\n\n+/).map(section => section.trim()).filter(Boolean);
    const posts = [];

    for (const section of sections) {
        // 日付を認識 (YYYY-MM-DD形式を探す)
        const dateMatch = section.match(/\d{4}-\d{2}-\d{2}/);
        const date = dateMatch ? dateMatch[0] : '不明な日付';

        // タイトル (# Title) を抽出
        const titleMatch = section.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : '無題';

        // 本文 (タイトルや日付行を除いた内容)
        const content = section
            .replace(dateMatch?.[0] || '', '') // 日付行を削除
            .replace(titleMatch?.[0] || '', '') // タイトル行を削除
            .trim();

        posts.push({ date, title, content });
    }

    return posts;
}
