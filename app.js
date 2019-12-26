const loadQuiz = () => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.overrideMimeType('application/json');
  xhr.open('GET', 'quiz.json', true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      resolve(JSON.parse(xhr.responseText));
    } else if (xhr.readyState === XMLHttpRequest.DONE) {
      reject(new Error(`Error while loading quiz.json: ${xhr.statusText}`));
    }
  };

  xhr.send();
});

(async () => {
  let quiz = {};

  try {
    quiz = await loadQuiz();
  } catch (e) {
    throw Error(`Error while loading quiz.json: ${e}`);
  }

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
