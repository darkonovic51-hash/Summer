// auth.js
function generateUserId() {
  return 'u_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

function getCurrentUser() {
  return {
    id: localStorage.getItem('userId'),
    name: localStorage.getItem('userName')
  };
}

function isLoggedIn() {
  return !!localStorage.getItem('userId');
}

function registerUser(name) {
  const userId = generateUserId();
  localStorage.setItem('userId', userId);
  localStorage.setItem('userName', name);

  const userRef = db.ref('users/' + userId);
  userRef.set({
    name: name,
    createdAt: Date.now(),
    lastActive: Date.now(),
    xp: 0,
    streak: 0,
    lastStreakDate: "",
    currentLevel: "A1"
  });

  return userId;
}

function updateLastActive() {
  const user = getCurrentUser();
  if (!user.id) return;
  db.ref('users/' + user.id + '/lastActive').set(Date.now());
}

if (isLoggedIn()) {
  updateLastActive();
}
