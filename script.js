main();

async function main() {
    const postElements = document.getElementById('posts');
    const postFileUrls = createPostFileUrls();
    const posts = await fetchAllPosts(postFileUrls);

    renderPosts(postElements, posts);
}

function createPostFileUrls() {
    const baseUrl = 'https://orikamixnep.github.io/knowledge-output/posts/';
    const years = [2025, 2024];

    return years.flatMap(year => `${baseUrl}${year}.md`);
}

async function fetchPosts(postFileUrls) {
    const posts = [];

    for (const postFileUrl of postFileUrls) {
        const annualPosts = await fetchAnnualPosts(postFileUrl);
        posts.push(...annualPosts);
    }

    return posts;
}

async function fetchAnnualPosts(postFileUrl) {
    const annualPostFile = await fetch(postFileUrl);
    const annualPostText = await postFile.text();
    const annualPosts = annualPostText.split(/\n\n+/).map(post => post.trim()).filter(Boolean);

    return annualPosts.map(parseAnnualPost);
}

function parseAnnualPost(post) {
    const date = post.match(/\d{4}-\d{2}-\d{2}/);
    const title = post.match(/^# (.+)$/m);
    const content = post.replace(date, '').replace(title, '').trim();

    return { date, title, content };
}

function renderPosts(postElements, posts) {
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postElements.appendChild(postElement);
    });
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    postElement.innerHTML = `
        <div class="post-title">${post.title}</div>
        <div class="post-date">${post.date}</div>
        <div class="post-content">${marked.parse(post.content)}</div>
    `;

    return postElement;
}
