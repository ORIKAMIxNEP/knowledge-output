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
      .split(/(?<=^# )\n/gm)
      .map((postText) => postText.trim())
      .filter(Boolean);
    console.log(annualPosts);
    const parsedAnnualPosts = annualPosts.map((post) =>
      parsePost(post, postYear)
    );
    posts.push(...parsedAnnualPosts);
  }

  return posts;
}

function parsePost(post, postYear) {
  console.log(post);
  const title = post.match(/^# .*?/)[0];
  const dateWithoutYear = post.match(/\d{2}-\d{2}/)[0];
  const date = `${postYear}-${dateWithoutYear}`;
  const content = post
    .replace(dateWithoutYear, "")
    .replace(/^# .*?/, "")
    .replace("\n", "<br>")
    .trim();

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
            <div class="post-content">${marked.parse(post.content)}</div>
        `;
    postElements.appendChild(postElement);
  });
}
