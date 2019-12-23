const correctAnswers = ['B', 'B', 'B', 'B'];
const form = document.querySelector('.quiz-form');
const resultDiv = document.querySelector('.result');
const scoreSpan = document.querySelector('.score');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userAnswers = [form.q1.value, form.q2.value, form.q3.value, form.q4.value];
  const score = userAnswers
    .reduce((prev, curr, i) => prev + (curr === correctAnswers[i] ? 25 : 0), 0);

  scoreSpan.textContent = `${score}%`;

  resultDiv.classList.remove('d-none');
});
