// quiz.js
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let lives = 3;
let selectedOption = null;
let levelId, sectionId;

const QUESTION_BANKS = {
  "A1_vocabulary": QUESTIONS_A1_VOCABULARY,
  "A1_sentence": QUESTIONS_A1_SENTENCE,
  "A1_synonyms": QUESTIONS_A1_SYNONYMS,
  "A1_grammar": QUESTIONS_A1_GRAMMAR,
  "A1_reading": QUESTIONS_A1_READING
};

window.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) { window.location.href = "index.html"; return; }

  const params = new URLSearchParams(window.location.search);
  levelId = params.get('level');
  sectionId = params.get('section');

  const bankKey = levelId + "_" + sectionId;
  const bank = QUESTION_BANKS[bankKey];

  if (!bank || bank.length === 0) {
    alert("هذا القسم لم يُضف له أسئلة بعد.");
    window.location.href = `level.html?id=${levelId}`;
    return;
  }

  currentQuestions = shuffleArray([...bank]).slice(0, 10);
  loadQuestion();
});

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadQuestion() {
  selectedOption = null;
  const q = currentQuestions[currentIndex];

  const label = document.querySelector('.quiz-question-label');
  const passageBox = document.getElementById('passageBox');

  if (q.passage) {
    label.textContent = "اقرأ الفقرة ثم أجب:";
    passageBox.style.display = 'block';
    passageBox.textContent = q.passage;
  } else {
    label.textContent = "اختر المعنى الصحيح للجملة:";
    passageBox.style.display = 'none';
  }

  document.getElementById('questionText').textContent = q.question;
  document.getElementById('checkBtn').disabled = true;
  document.getElementById('checkBtn').textContent = "تحقق";

  const percent = (currentIndex / currentQuestions.length) * 100;
  document.getElementById('quizProgressFill').style.width = percent + "%";

  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectOption(idx, btn));
    grid.appendChild(btn);
  });
}

function selectOption(idx, btn) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedOption = idx;
  document.getElementById('checkBtn').disabled = false;
}

document.getElementById('checkBtn').addEventListener('click', handleCheck);

function handleCheck() {
  const checkBtn = document.getElementById('checkBtn');

  if (checkBtn.textContent === "التالي") {
    currentIndex++;
    if (currentIndex >= currentQuestions.length || lives <= 0) {
      showMilestone();
    } else {
      loadQuestion();
    }
    return;
  }

  const q = currentQuestions[currentIndex];
  const buttons = document.querySelectorAll('.option-btn');

  if (selectedOption === q.correctIndex) {
    buttons[selectedOption].classList.add('correct');
    correctCount++;
    removeFromMistakes(q.id);
  } else {
    buttons[selectedOption].classList.add('wrong');
    buttons[q.correctIndex].classList.add('correct');
    wrongCount++;
    lives--;
    document.getElementById('livesCount').textContent = lives;
    addToMistakes(q.id);
  }

  buttons.forEach(b => b.style.pointerEvents = 'none');
  checkBtn.textContent = "التالي";
}

function addToMistakes(questionId) {
  const user = getCurrentUser();
  db.ref(`users/${user.id}/mistakes/${questionId}`).set(true);
}

function removeFromMistakes(questionId) {
  const user = getCurrentUser();
  db.ref(`users/${user.id}/mistakes/${questionId}`).remove();
}

function showMilestone() {
  const total = correctCount + wrongCount;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const xpEarned = correctCount * 10;

  document.getElementById('quizBody').style.display = 'none';
  document.querySelector('.quiz-footer').style.display = 'none';
  document.getElementById('milestoneScreen').style.display = 'flex';

  document.getElementById('msCorrect').textContent = correctCount;
  document.getElementById('msWrong').textContent = wrongCount;
  document.getElementById('msXp').textContent = xpEarned;

  const title = percent >= 80 ? "🌟 ممتاز جداً!" : percent >= 50 ? "👍 أداء جيد" : "💪 استمر بالمحاولة";
  document.getElementById('milestoneTitle').textContent = title;
  document.getElementById('milestoneSub').textContent = `أجبت بشكل صحيح على ${percent}% من الأسئلة`;

  const circumference = 377;
  const offset = circumference - (percent / 100) * circumference;
  setTimeout(() => {
    document.getElementById('ringFill').style.strokeDashoffset = offset;
    document.getElementById('milestonePercent').textContent = percent + "%";
  }, 200);

  saveProgress(xpEarned);
}

function saveProgress(xpEarned) {
  const user = getCurrentUser();
  const progressRef = db.ref(`users/${user.id}/progress/${levelId}/${sectionId}`);

  progressRef.transaction((current) => {
    if (!current) current = { correct: 0, total: 0 };
    current.correct = (current.correct || 0) + correctCount;
    current.total = (current.total || 0) + (correctCount + wrongCount);
    return current;
  });

  db.ref(`users/${user.id}/xp`).transaction((xp) => (xp || 0) + xpEarned);
  updateStreak(user.id);
}

function updateStreak(userId) {
  const today = new Date().toDateString();
  const streakRef = db.ref(`users/${userId}`);
  streakRef.once('value', (snap) => {
    const data = snap.val();
    const lastDate = data.lastStreakDate;
    if (lastDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = lastDate === yesterday.toDateString();

    const newStreak = isConsecutive ? (data.streak || 0) + 1 : 1;
    db.ref(`users/${userId}`).update({ streak: newStreak, lastStreakDate: today });
  });
}

document.getElementById('continueBtn').addEventListener('click', () => {
  window.location.href = `level.html?id=${levelId}`;
});

document.getElementById('exitQuiz').addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm("هل تريد الخروج من الكويز؟ سيتم فقدان التقدم بهذه الجلسة.")) {
    window.location.href = `level.html?id=${levelId}`;
  }
});
