const loadJson = (fileName) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.overrideMimeType('application/json');
  xhr.open('GET', fileName, true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      resolve(JSON.parse(xhr.responseText));
    } else if (xhr.readyState === XMLHttpRequest.DONE) {
      reject(new Error(`Error while loading ${fileName}: ${xhr.statusText}`));
    }
  };

  xhr.send();
});

const tryLoadJson = async (fileName) => {
  try {
    return await loadJson(fileName);
  } catch (e) {
    throw Error(`Error while loading ${fileName}: ${e}`);
  }
};

const loadQuiz = async () => tryLoadJson('quiz.json');

const loadLocalizedStrings = async () => tryLoadJson('localizedStrings.json');

const populateForm = (form, quiz, lang) => {
  const submitDiv = form.querySelector('div');

  quiz.forEach((q, qi) => {
    const questionNumber = qi + 1;

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('my-5', 'question');

    const questionP = document.createElement('p');
    questionP.classList.add('lead', 'font-weight-normal');
    questionP.textContent = `${questionNumber}. ${q.question[lang]}`;
    questionDiv.append(questionP);

    q.answers.forEach((a, ai) => {
      const answerDiv = document.createElement('div');
      answerDiv.classList.add('form-check', 'my-2', 'text-white-50');

      const answerInput = document.createElement('input');
      answerInput.type = 'radio';
      answerInput.name = `q${questionNumber}`;
      answerInput.value = `${ai}`;
      answerInput.checked = ai === 0;
      answerDiv.append(answerInput);

      const answerLabel = document.createElement('label');
      answerLabel.classList.add('form-check-label');
      answerLabel.textContent = a[lang];
      answerDiv.append(answerLabel);

      questionDiv.append(answerDiv);
    });

    form.insertBefore(questionDiv, submitDiv);
  });
};

const displayScore = (score) => {
  const resultDiv = document.querySelector('.result');

  resultDiv.classList.remove('d-none');

  let scoreStep = 0;
  const scoreSpan = resultDiv.querySelector('.score');
  const scoreTimer = window.setInterval(() => {
    scoreSpan.textContent = `${scoreStep}%`;
    if (scoreStep >= score) {
      window.clearInterval(scoreTimer);
    }
    scoreStep += 1;
  }, 20);
};

const attachSubmitEvent = (form, quiz) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const questionDivs = form.querySelectorAll('.question');
    const nbCorrectAnswers = Array.from(questionDivs)
      .map((q) => {
        const name = q.querySelector('input').getAttribute('name');
        return form[name];
      })
      .filter((a, i) => Number(a.value) === quiz[i].correct)
      .length;

    const score = (nbCorrectAnswers * (100 / quiz.length)).toFixed();
    displayScore(score);
    window.scrollTo(0, 0);
  });
};

(async function main() {
  const quiz = await loadQuiz();
  const localizedStrings = await loadLocalizedStrings();

  const lang = 'en';

  const form = document.querySelector('.quiz-form');
  populateForm(form, quiz, lang);
  attachSubmitEvent(form, quiz);
}());
