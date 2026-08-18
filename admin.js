// admin.js
const ADMIN_PASSWORD = "TechnoAdmin2026";

document.getElementById('adminLoginBtn').addEventListener('click', () => {
  const pass = document.getElementById('adminPassword').value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAdminData();
  } else {
    alert("كلمة المرور غير صحيحة");
  }
});

function loadAdminData() {
  document.getElementById('totalQuestions').textContent = getSiteTotal();

  db.ref('users').on('value', (snapshot) => {
    const usersObj = snapshot.val() || {};
    const usersArray = Object.entries(usersObj).map(([id, data]) => ({ id, ...data }));

    renderStats(usersArray);
    renderUsersTable(usersArray);
  });
}

function renderStats(users) {
  const total = users.length;
  const today = new Date().toDateString();
  const activeToday = users.filter(u => new Date(u.lastActive).toDateString() === today).length;
  const avgXp = total > 0 ? Math.round(users.reduce((s, u) => s + (u.xp || 0), 0) / total) : 0;

  document.getElementById('totalUsers').textContent = total;
  document.getElementById('activeToday').textContent = activeToday;
  document.getElementById('avgXp').textContent = avgXp;
}

function renderUsersTable(users) {
  const sorted = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  const container = document.getElementById('usersTable');
  container.innerHTML = "";

  sorted.forEach((user, index) => {
    const row = document.createElement('div');
    row.className = 'user-row';
    row.innerHTML = `
      <div class="user-rank">${index + 1}</div>
      <div class="user-row-info">
        <h4>${user.name}</h4>
        <p>المستوى: ${user.currentLevel || 'A1'} • Streak: ${user.streak || 0}🔥</p>
      </div>
      <div class="user-row-xp">${user.xp || 0} XP</div>
    `;
    row.addEventListener('click', () => showUserDetail(user));
    container.appendChild(row);
  });
}

function showUserDetail(user) {
  const modal = document.getElementById('userDetailModal');
  const content = document.getElementById('modalContent');

  let progressHtml = "";
  LEVELS.forEach(level => {
    const levelProgress = (user.progress && user.progress[level.id]) || {};
    let correct = 0;
    level.sections.forEach(sec => {
      if (levelProgress[sec.id]) correct += levelProgress[sec.id].correct || 0;
    });
    const total = getLevelTotal(level.id);
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    progressHtml += `<div class="modal-level-row"><span>${level.icon} ${level.id}</span><span>${percent}%</span></div>`;
  });

  const mistakesCount = user.mistakes ? Object.keys(user.mistakes).length : 0;

  content.innerHTML = `
    <div class="modal-content">
      <h2>${user.name}</h2>
      <div class="modal-section">
        <h4>معلومات عامة</h4>
        <div class="modal-level-row"><span>XP الكلي</span><span>${user.xp || 0}</span></div>
        <div class="modal-level-row"><span>Streak الحالي</span><span>${user.streak || 0} يوم</span></div>
        <div class="modal-level-row"><span>تاريخ الانضمام</span><span>${new Date(user.createdAt).toLocaleDateString('ar')}</span></div>
        <div class="modal-level-row"><span>آخر نشاط</span><span>${new Date(user.lastActive).toLocaleDateString('ar')}</span></div>
        <div class="modal-level-row"><span>عدد الأخطاء المسجلة</span><span>${mistakesCount}</span></div>
      </div>
      <div class="modal-section">
        <h4>التقدم حسب المستوى</h4>
        ${progressHtml}
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('userDetailModal').style.display = 'none';
});
