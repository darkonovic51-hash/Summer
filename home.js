// home.js
window.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
    return;
  }
  loadUserData();
});

function loadUserData() {
  const user = getCurrentUser();
  const userRef = db.ref('users/' + user.id);

  userRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    renderTopbar(data);
    renderGreeting(data);
    renderLevelsPath(data);
  });
}

function renderTopbar(data) {
  document.getElementById('avatarInitial').textContent = data.name.charAt(0).toUpperCase();
  document.getElementById('userNameDisplay').textContent = data.name;
  document.getElementById('userLevelDisplay').textContent = "المستوى: " + data.currentLevel;
  document.getElementById('streakCount').textContent = data.streak || 0;
  document.getElementById('xpCount').textContent = data.xp || 0;
}

function renderGreeting(data) {
  const hour = new Date().getHours();
  let greetText = "أهلاً بعودتك";
  if (hour < 12) greetText = "صباح الخير";
  else if (hour < 18) greetText = "مساء الخير";
  else greetText = "مساء النور";
  document.getElementById('greeting').textContent = `${greetText}, ${data.name} 👋`;
}

function renderLevelsPath(userData) {
  const container = document.getElementById('levelsPath');
  container.innerHTML = "";

  const progress = userData.progress || {};

  LEVELS.forEach((level, index) => {
    const levelProgress = progress[level.id] || {};
    const totalQuestions = getLevelTotal(level.id);
    let answeredCorrect = 0;

    level.sections.forEach(sec => {
      if (levelProgress[sec.id]) {
        answeredCorrect += levelProgress[sec.id].correct || 0;
      }
    });

    const percent = totalQuestions > 0 ? Math.round((answeredCorrect / totalQuestions) * 100) : 0;
    const isLocked = index > 0 && !isLevelUnlocked(LEVELS[index - 1].id, progress);

    const card = document.createElement('div');
    card.className = 'level-card' + (isLocked ? ' locked' : '');
    card.style.setProperty('--level-color', level.color);

    card.innerHTML = `
      <div class="level-icon">${level.icon}</div>
      <div class="level-info">
        <h3>${level.id} - ${level.name}</h3>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width:${percent}%"></div>
        </div>
        <p class="level-percent">${percent}% مكتمل</p>
      </div>
      ${isLocked ? '<div class="lock-icon">🔒</div>' : '<div class="go-icon">←</div>'}
    `;

    if (!isLocked) {
      card.addEventListener('click', () => {
        window.location.href = `level.html?id=${level.id}`;
      });
    }

    container.appendChild(card);
  });
}

function isLevelUnlocked(previousLevelId, progress) {
  const levelProgress = progress[previousLevelId];
  if (!levelProgress) return false;
  const total = getLevelTotal(previousLevelId);
  let correct = 0;
  const level = LEVELS.find(l => l.id === previousLevelId);
  level.sections.forEach(sec => {
    if (levelProgress[sec.id]) correct += levelProgress[sec.id].correct || 0;
  });
  const percent = (correct / total) * 100;
  return percent >= 80;
}

document.getElementById('dailyChallengeBtn').addEventListener('click', () => {
  window.location.href = "daily-challenge.html";
});
