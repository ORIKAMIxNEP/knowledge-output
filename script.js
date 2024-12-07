const postsContainer = document.getElementById('posts');

// outputフォルダ内のマークダウンファイルを指定
const files = ['https://orikamixnep.github.io/knowledge-output/output/pos1.md'];

// マークダウンを取得してHTMLに変換
async function fetchMarkdown(file) {
    const response = await fetch(file);
    const text = await response.text();

    // YAML frontmatterの解析
    const frontmatterMatch = text.match(/^---\n([\s\S]+?)\n---/);
    let metadata = {};
    let content = text;

    if (frontmatterMatch) {
        const yaml = frontmatterMatch[1];
        content = text.replace(frontmatterMatch[0], '');
        metadata = Object.fromEntries(
            yaml.split('\n').map(line => {
                const [key, ...value] = line.split(':');
                return [key.trim(), value.join(':').trim()];
            })
        );
    }

    return { metadata, content };
}

// 投稿を表示
async function loadPosts() {
    const posts = [];

    for (const file of files) {
        const { metadata, content } = await fetchMarkdown(file);
        const htmlContent = marked(content);
        posts.push({ ...metadata, htmlContent });
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
