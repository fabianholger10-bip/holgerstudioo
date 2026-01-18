const $ = (sel) => document.querySelector(sel);

function formatDate(iso){
  // Formato simple ES
  const [y,m,d] = iso.split("-").map(x=>parseInt(x,10));
  const dt = new Date(y, m-1, d);
  return dt.toLocaleDateString("es-ES", { year:"numeric", month:"long", day:"numeric" });
}

function postCard(p){
  return `
    <article class="card">
      <h3><a href="./post.html?slug=${encodeURIComponent(p.slug)}">${p.title}</a></h3>
      <p>${p.tag} · ${formatDate(p.date)}</p>
      <p style="margin-top:10px;color:#777">${p.excerpt}</p>
    </article>
  `;
}

function renderHome(){
  const el = $("#latestPosts");
  if(!el) return;
  const latest = [...window.POSTS].sort((a,b)=> (a.date<b.date?1:-1)).slice(0,3);
  el.innerHTML = latest.map(postCard).join("");
}

function renderBlog(){
  const grid = $("#postsGrid");
  if(!grid) return;

  const search = $("#search");
  const tag = $("#tag");

  function apply(){
    const q = (search?.value || "").toLowerCase().trim();
    const t = (tag?.value || "");
    const items = window.POSTS
      .filter(p => (!t || p.tag === t))
      .filter(p => (!q || (p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))))
      .sort((a,b)=> (a.date<b.date?1:-1));

    grid.innerHTML = items.map(postCard).join("");
  }

  search?.addEventListener("input", apply);
  tag?.addEventListener("change", apply);
  apply();
}

function renderPost(){
  const hero = $("#postHero");
  if(!hero) return;

  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  const p = window.POSTS.find(x => x.slug === slug) || window.POSTS[0];

  document.title = `${p.title} — HOLGER`;

  hero.style.backgroundImage = `url('${p.cover}')`;
  $("#postMeta").textContent = `${p.tag} · ${formatDate(p.date)}`;
  $("#postTitle").textContent = p.title;
  $("#postExcerpt").textContent = p.excerpt;

  const content = $("#postContent");
  content.innerHTML = p.content.map(par => `<p>${par}</p>`).join("") +
    `<p><a href="mailto:contact@holgerstudio.com?subject=${encodeURIComponent("Consulta — "+p.title)}">contact@holgerstudio.com</a></p>`;
}

const yearEl = $("#year");
if(yearEl) yearEl.textContent = new Date().getFullYear();

renderHome();
renderBlog();
renderPost();
