// mistakes.js
const ALL_QUESTION_BANKS = {
  "A1_vocabulary": QUESTIONS_A1_VOCABULARY,
  "A1_sentence": QUESTIONS_A1_SENTENCE,
  "A1_synonyms": QUESTIONS_A1_SYNONYMS,
  "A1_grammar": QUESTIONS_A1_GRAMMAR,
  "A1_reading": QUESTIONS_A1_READING
};

let mistakeQuestions = [];

window.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) { window.location.href = "index.html"; return; }
  loadMistakes();
});

function loadMistakes() {
  const user = getCurrentUser();

  db.ref('users/' + user.id + '/mistakes').once('value', (snap) => {
    const mistakes = snap.val() || {};
    const mistakeIds = Object.keys(mistakes);

    if (mistakeIds.length === 0) {
      document.getElementById('emptyState').style.display = 'block';
      return;
    }

    mistakeQuestions = findQuestionsByIds(mistakeIds);
    document.getElementById('mistakesIntro').style.display = 'flex';
    document.getElementById('mistakesCount').textContent = mistakeQuestions.length;
    renderMistakesList(mistakeQuestions);
  });
}

function findQuestionsByIds(ids) {
  const found = [];
  Object.values(ALL_QUESTION_BANKS).forEach(bank => {
    bank.forEach(q => {
      if (ids.includes(q.id)) found.push(q);
    });
  });
  return found;
}

function renderMistakesList(questions) {
  const container = document.getElementById('mistakesList');
  container.innerHTML = "";

  questions.forEach(q => {
    const correctAnswer = q.options[q.correctIndex];
    const item = document.createElement('div');
    item.className = 'mistake-item';
    item.innerHTML = `<p>${q.question}<br><small style="color:#4ade80">✓ ${correctAnswer}</small></p>`;
    container.appendChild(item);
  });
}

document.getElementById('reviewAllBtn')?.addEventListener('click', () => {
  sessionStorage.setItem('reviewQuestions', JSON.stringify(mistakeQuestions));
  window.location.href = 'review.html';
});
