// leaderboard.js
window.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) { window.location.href = "index.html"; return; }
  loadLeaderboard();
});

function loadLeaderboard() {
  const currentUser = getCurrentUser();

  db.ref('users').once('value', (snapshot) => {
    const usersObj = snapshot.val() || {};
    const usersArray = Object.entries(usersObj).map(([id, data]) => ({ id, ...data }));
    const sorted = usersArray.sort((a, b) => (b.xp || 0) - (a.xp || 0));

    const container = document.getElementById('leaderboardList');
    container.innerHTML = "";

    sorted.forEach((user, index) => {
      const rank = index + 1;
      const isMe = user.id === currentUser.id;

      let rankClass = "";
      let rankDisplay = rank;
      if (rank === 1) { rankClass = "gold"; rankDisplay = "🥇"; }
      else if (rank === 2) { rankClass = "silver"; rankDisplay = "🥈"; }
      else if (rank === 3) { rankClass = "bronze"; rankDisplay = "🥉"; }

      const row = document.createElement('div');
      row.className = 'lb-row' + (isMe ? ' me' : '');
      row.innerHTML = `
        <div class="lb-rank ${rankClass}">${rankDisplay}</div>
        <div class="lb-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div class="lb-info">
          <h4>${user.name}${isMe ? ' (أنت)' : ''}</h4>
          <p>المستوى ${user.currentLevel || 'A1'} • 🔥 ${user.streak || 0}</p>
        </div>
        <div class="lb-xp">${user.xp || 0} XP</div>
      `;
      container.appendChild(row);
    });
  });
}
