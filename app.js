// TODO: handle errors
const loadQuiz = () => new Promise((resolve) => {
  const xobj = new XMLHttpRequest();

  xobj.overrideMimeType('application/json');
  xobj.open('GET', 'questions.json', true);

  xobj.onload = () => new Promise(() => {
    if (xobj.status === 200) {
      resolve(JSON.parse(xobj.responseText));
    }
    return resolve({});
  });

  xobj.send();
});

(async () => {
  const quiz = await loadQuiz();

  const correctAnswers = ['B', 'B', 'B', 'B'];
  const form = document.querySelector('.quiz-form');
  const resultDiv = document.querySelector('.result');

  const animateScore = (score) => {
    let scoreStep = 0;
    const scoreSpan = resultDiv.querySelector('.score');
    const scoreTimer = window.setInterval(() => {
      scoreSpan.textContent = `${scoreStep}%`;
      if (scoreStep === score) {
        window.clearInterval(scoreTimer);
      }
      scoreStep += 1;
    }, 20);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const userAnswers = [form.q1.value, form.q2.value, form.q3.value, form.q4.value];
    const score = userAnswers.reduce(
      (prev, curr, i) => prev + (curr === correctAnswers[i] ? 25 : 0), 0,
    );

    resultDiv.classList.remove('d-none');
    window.scrollTo(0, 0);
    animateScore(score);
  });
})();
