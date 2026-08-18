// daily-challenge.js
const DAILY_QUESTION_POOL = [...QUESTIONS_A1_VOCABULARY];

let dailyQuestions = [];
let dailyIndex = 0;
let dailyCorrect = 0;
let dailySelected = null;

window.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) { window.location.href = "index.html"; return; }
  checkIfAlreadyDone();
});

function checkIfAlreadyDone() {
  const user = getCurrentUser();
  const today = new Date().toDateString();

  db.ref('users/' + user.id + '/lastDailyChallenge').once('value', (snap) => {
    const lastDate = snap.val();
    if (lastDate === today) {
      document.getElementById('dailyQuizArea').style.display = 'none';
      document.getElementById('alreadyDoneScreen').style.display = 'flex';
    } else {
      startDailyChallenge();
    }
  });
}

function startDailyChallenge() {
  dailyQuestions = shuffleDaily([...DAILY_QUESTION_POOL]).slice(0, 5);
  loadDailyQuestion();
}

function shuffleDaily(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadDailyQuestion() {
  dailySelected = null;
  const q = dailyQuestions[dailyIndex];

  document.getElementById('dailyQuestionText').textContent = q.question;
  document.getElementById('dailyCheckBtn').disabled = true;
  document.getElementById('dailyCheckBtn').textContent = "تحقق";

  const percent = (dailyIndex / dailyQuestions.length) * 100;
  document.getElementById('dailyProgressFill').style.width = percent + "%";

  const grid = document.getElementById('dailyOptionsGrid');
  grid.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectDailyOption(idx, btn));
    grid.appendChild(btn);
  });
}

function selectDailyOption(idx, btn) {
  document.querySelectorAll('#dailyOptionsGrid .option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  dailySelected = idx;
  document.getElementById('dailyCheckBtn').disabled = false;
}

document.getElementById('dailyCheckBtn').addEventListener('click', () => {
  const checkBtn = document.getElementById('dailyCheckBtn');

  if (checkBtn.textContent === "التالي") {
    dailyIndex++;
    if (dailyIndex >= dailyQuestions.length) {
      finishDailyChallenge();
    } else {
      loadDailyQuestion();
    }
    return;
  }

  const q = dailyQuestions[dailyIndex];
  const buttons = document.querySelectorAll('#dailyOptionsGrid .option-btn');

  if (dailySelected === q.correctIndex) {
    buttons[dailySelected].classList.add('correct');
    dailyCorrect++;
  } else {
    buttons[dailySelected].classList.add('wrong');
    buttons[q.correctIndex].classList.add('correct');
  }

  buttons.forEach(b => b.style.pointerEvents = 'none');
  checkBtn.textContent = "التالي";
});

function finishDailyChallenge() {
  const percent = Math.round((dailyCorrect / dailyQuestions.length) * 100);
  const xpEarned = dailyCorrect * 20;

  document.getElementById('dailyQuizArea').style.display = 'none';
  document.getElementById('dailyMilestone').style.display = 'flex';

  document.getElementById('dailyMsCorrect').textContent = dailyCorrect;
  document.getElementById('dailyMsXp').textContent = xpEarned;
  document.getElementById('dailyMilestoneSub').textContent = `أجبت بشكل صحيح على ${percent}% من التحدي`;

  const circumference = 377;
  const offset = circumference - (percent / 100) * circumference;
  setTimeout(() => {
    document.getElementById('dailyRingFill').style.strokeDashoffset = offset;
    document.getElementById('dailyMilestonePercent').textContent = percent + "%";
  }, 200);

  const user = getCurrentUser();
  const today = new Date().toDateString();
  db.ref('users/' + user.id).update({ lastDailyChallenge: today });
  db.ref('users/' + user.id + '/xp').transaction((xp) => (xp || 0) + xpEarned);
}
