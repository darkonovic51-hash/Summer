// review.js
let reviewQuestions = [];
let reviewIndex = 0;
let reviewFixed = 0;
let reviewSelected = null;

window.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) { window.location.href = "index.html"; return; }

  const stored = sessionStorage.getItem('reviewQuestions');
  if (!stored) { window.location.href = "mistakes.html"; return; }

  reviewQuestions = JSON.parse(stored);
  if (reviewQuestions.length === 0) { window.location.href = "mistakes.html"; return; }

  loadReviewQuestion();
});

function loadReviewQuestion() {
  reviewSelected = null;
  const q = reviewQuestions[reviewIndex];

  const passageBox = document.getElementById('reviewPassageBox');
  if (q.passage) {
    passageBox.style.display = 'block';
    passageBox.textContent = q.passage;
  } else {
    passageBox.style.display = 'none';
  }

  document.getElementById('reviewQuestionText').textContent = q.question;
  document.getElementById('reviewCheckBtn').disabled = true;
  document.getElementById('reviewCheckBtn').textContent = "تحقق";

  const percent = (reviewIndex / reviewQuestions.length) * 100;
  document.getElementById('reviewProgressFill').style.width = percent + "%";

  const grid = document.getElementById('reviewOptionsGrid');
  grid.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#reviewOptionsGrid .option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      reviewSelected = idx;
      document.getElementById('reviewCheckBtn').disabled = false;
    });
    grid.appendChild(btn);
  });
}

document.getElementById('reviewCheckBtn').addEventListener('click', () => {
  const checkBtn = document.getElementById('reviewCheckBtn');

  if (checkBtn.textContent === "التالي") {
    reviewIndex++;
    if (reviewIndex >= reviewQuestions.length) {
      finishReview();
    } else {
      loadReviewQuestion();
    }
    return;
  }

  const q = reviewQuestions[reviewIndex];
  const buttons = document.querySelectorAll('#reviewOptionsGrid .option-btn');
  const user = getCurrentUser();

  if (reviewSelected === q.correctIndex) {
    buttons[reviewSelected].classList.add('correct');
    reviewFixed++;
    db.ref(`users/${user.id}/mistakes/${q.id}`).remove();
  } else {
    buttons[reviewSelected].classList.add('wrong');
    buttons[q.correctIndex].classList.add('correct');
  }

  buttons.forEach(b => b.style.pointerEvents = 'none');
  checkBtn.textContent = "التالي";
});

function finishReview() {
  document.getElementById('reviewBody').style.display = 'none';
  document.querySelector('.quiz-footer').style.display = 'none';
  document.getElementById('reviewDoneScreen').style.display = 'flex';
  document.getElementById('reviewDoneSub').textContent = `صححت ${reviewFixed} من ${reviewQuestions.length} سؤال`;
  sessionStorage.removeItem('reviewQuestions');
}
