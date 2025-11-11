async function fetchJSON(url) {
  const r = await fetch(url);
  return r.json();
}

const params = new URLSearchParams(location.search);
const id = params.get("id");

async function load() {
  // usar la ruta correcta: /api/movies/:id
  const movie = await fetchJSON(`/api/movies/${id}`);
  if (!movie) {
    document.getElementById("movie-container").innerHTML = "<p>Película no encontrada</p>";
    return;
  }
  // construir HTML de detalle
  document.getElementById("movie-container").innerHTML = `
    <div class="movie-detail">
      <a class="back" href="/">← Volver</a>
      <div class="meta">
        <img class="poster" src="${movie.poster}" alt="${movie.title}" />
        <div class="info">
          <h1>${movie.title} <small>(${movie.year})</small></h1>
          <p class="synopsis">${movie.synopsis}</p>
          <p class="tags"><strong>Tags:</strong> ${((movie.tags||[]).map(t => `<span class="tag">${t}</span>`).join(" "))}</p>
        </div>
      </div>

      <div class="player">
        <video controls width="720" src="${movie.video}"></video>
      </div>

      <section class="comments-section">
        <h3>Comentarios</h3>
        <div id="comments">
          ${((movie.comments||[]).map(c => `<div class="comment"><b>${escapeHtml(c.user)}</b> <small>${formatDate(c.date)}</small><p>${escapeHtml(c.text)}</p></div>`).join(""))}
        </div>

        <h4>Añadir comentario</h4>
        <div class="comment-form">
          <input id="user" placeholder="Tu nombre" />
          <textarea id="text" placeholder="Tu comentario"></textarea>
          <button id="send">Enviar</button>
        </div>
      </section>
    </div>
  `;

  document.getElementById("send").addEventListener("click", addComment);
}

async function addComment() {
  const user = document.getElementById("user").value.trim();
  const text = document.getElementById("text").value.trim();
  if (!user || !text) { alert("Completa nombre y comentario"); return; }

  // enviar al servidor (ruta creada en server.js)
  const res = await fetch(`/api/movies/${id}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, text })
  });

  if (!res.ok) {
    const err = await res.json().catch(()=>null);
    alert(err && err.error ? `Error: ${err.error}` : "Error al enviar el comentario");
    return;
  }

  // limpiar formulario y recargar para mostrar comentarios actualizados
  document.getElementById("user").value = "";
  document.getElementById("text").value = "";
  load();
}

// util: escapar texto para evitar HTML injection
function escapeHtml(s){
  if (!s) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function formatDate(d){
  if (!d) return '';
  try { const dt = new Date(d); return dt.toLocaleString(); } catch(e){ return d; }
}

load();
