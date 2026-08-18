// level.js
const sectionEmojis = {
  vocabulary: "📚", reading: "📖", sentence: "💬",
  synonyms: "🔄", grammar: "🧩", academic: "🎓"
};

window.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) { window.location.href = "index.html"; return; }

  const params = new URLSearchParams(window.location.search);
  const levelId = params.get('id');
  const level = LEVELS.find(l => l.id === levelId);

  if (!level) { window.location.href = "home.html"; return; }

  document.getElementById('levelTitle').textContent = `${level.icon} ${level.id} - ${level.name}`;

  const user = getCurrentUser();
  db.ref('users/' + user.id + '/progress/' + levelId).once('value', (snap) => {
    const progress = snap.val() || {};
    renderSections(level, progress);
  });
});

function renderSections(level, progress) {
  const container = document.getElementById('sectionsList');
  container.innerHTML = "";

  level.sections.forEach(sec => {
    const secProgress = progress[sec.id] || { correct: 0, total: 0 };
    const percent = sec.total > 0 ? Math.round((secProgress.correct / sec.total) * 100) : 0;

    const card = document.createElement('div');
    card.className = 'section-card';
    card.innerHTML = `
      <div class="section-emoji">${sectionEmojis[sec.id] || "❓"}</div>
      <div class="section-info">
        <h3>${sec.name}</h3>
        <p>${secProgress.correct || 0} / ${sec.total} سؤال</p>
        <div class="mini-progress">
          <div class="mini-progress-fill" style="width:${percent}%"></div>
        </div>
      </div>
      <div class="go-icon">←</div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `quiz.html?level=${level.id}&section=${sec.id}`;
    });
    container.appendChild(card);
  });
}
