const postYears = [2025, 2024];
main();

async function main() {
  const posts = await fetchPosts();
  renderPosts(posts);
}

async function fetchPosts() {
  const postFilesBaseUrl =
    "https://orikamixnep.github.io/knowledge-output/posts/";
  const posts = [];

  for (const postYear of postYears) {
    const annualPostFileUrl = `${postFilesBaseUrl}${postYear}.md`;
    const annualPostFile = await fetch(annualPostFileUrl);
    const annualPostText = await annualPostFile.text();
    const annualPosts = annualPostText
      .split(/^#\s/m)
      .map((postText) => postText.trim())
      .filter(Boolean);
    const parsedAnnualPosts = annualPosts.map((post) =>
      parsePost(post, postYear)
    );
    posts.push(...parsedAnnualPosts);
  }

  return posts;
}

function parsePost(post, postYear) {
  const [plainTitle, plainDate, ...plainContent] = post.split("\n");
  const title = plainTitle.replace("# ", "");
  const date = `${postYear}-${plainDate}`;
  const content = marked.parse(
    plainContent
      .join("\n")
      .replace(/-\s.*(?=\n(?!\s*-))/m, "$&\n\n")
      .trim(),
    { breaks: true }
  );

  return { title, date, content };
}

function renderPosts(posts) {
  const postElements = document.getElementById("posts");

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = `
            <div class="post-title">${post.title}</div>
            <div class="post-date">${post.date}</div>
            <div class="post-content">${post.content}</div>
        `;
    postElements.appendChild(postElement);
  });
}
