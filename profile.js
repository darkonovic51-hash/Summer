// profile.js
const BADGES_LIST = [
  { id: "first_steps", icon: "🌱", name: "أول خطوة", condition: (u) => (u.xp || 0) >= 10 },
  { id: "a1_master", icon: "🏅", name: "إتقان A1", condition: (u) => isLevelDone(u, "A1") },
  { id: "streak_7", icon: "🔥", name: "أسبوع كامل", condition: (u) => (u.streak || 0) >= 7 },
  { id: "xp_500", icon: "⭐", name: "500 XP", condition: (u) => (u.xp || 0) >= 500 },
  { id: "xp_1000", icon: "💫", name: "1000 XP", condition: (u) => (u.xp || 0) >= 1000 },
  { id: "b1_master", icon: "🏆", name: "إتقان B1", condition: (u) => isLevelDone(u, "B1") },
  { id: "streak_30", icon: "🌟", name: "شهر كامل", condition: (u) => (u.streak || 0) >= 30 },
  { id: "c2_master", icon: "👑", name: "الإتقان الكامل", condition: (u) => isLevelDone(u, "C2") }
];

function isLevelDone(userData, levelId) {
  const progress = (userData.progress && userData.progress[levelId]) || {};
  const level = LEVELS.find(l => l.id === levelId);
  const total = getLevelTotal(levelId);
  let correct = 0;
  level.sections.forEach(sec => {
    if (progress[sec.id]) correct += progress[sec.id].correct || 0;
  });
  return total > 0 && (correct / total) >= 0.8;
}

window.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) { window.location.href = "index.html"; return; }
  loadProfile();
});

function loadProfile() {
  const user = getCurrentUser();

  db.ref('users/' + user.id).once('value', (snap) => {
    const data = snap.val();
    if (!data) return;

    document.getElementById('profileAvatar').textContent = data.name.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = data.name;
    document.getElementById('profileJoinDate').textContent = 'عضو منذ ' + new Date(data.createdAt).toLocaleDateString('ar');
    document.getElementById('pXp').textContent = data.xp || 0;
    document.getElementById('pStreak').textContent = data.streak || 0;
    document.getElementById('pLevel').textContent = data.currentLevel || 'A1';

    renderLevelsProgress(data);
    renderBadges(data);
    calculateRank(user.id, data);
  });
}

function renderLevelsProgress(data) {
  const container = document.getElementById('profileLevels');
  container.innerHTML = "";
  const progress = data.progress || {};

  LEVELS.forEach(level => {
    const levelProgress = progress[level.id] || {};
    const total = getLevelTotal(level.id);
    let correct = 0;
    level.sections.forEach(sec => {
      if (levelProgress[sec.id]) correct += levelProgress[sec.id].correct || 0;
    });
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    const row = document.createElement('div');
    row.className = 'plevel-row';
    row.innerHTML = `
      <div class="icon">${level.icon}</div>
      <div class="plevel-row-info">
        <p>${level.id} - ${level.name} (${percent}%)</p>
        <div class="mini-progress"><div class="mini-progress-fill" style="width:${percent}%; background:${level.color};"></div></div>
      </div>
    `;
    container.appendChild(row);
  });
}

function renderBadges(data) {
  const container = document.getElementById('badgesGrid');
  container.innerHTML = "";

  BADGES_LIST.forEach(badge => {
    const earned = badge.condition(data);
    const el = document.createElement('div');
    el.className = 'badge-item' + (earned ? ' earned' : '');
    el.textContent = badge.icon;
    el.title = badge.name;
    container.appendChild(el);
  });
}

function calculateRank(userId, userData) {
  db.ref('users').once('value', (snap) => {
    const usersObj = snap.val() || {};
    const sorted = Object.entries(usersObj)
      .map(([id, d]) => ({ id, xp: d.xp || 0 }))
      .sort((a, b) => b.xp - a.xp);
    const rank = sorted.findIndex(u => u.id === userId) + 1;
    document.getElementById('pRank').textContent = '#' + rank;
  });
}
