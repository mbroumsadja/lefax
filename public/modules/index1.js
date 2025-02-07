let data = null;

fetch(`/public/assets/data/L2/infographie/part1.json`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    return response.json();
  })
  .then(jsonData => {
    data = jsonData;
    
    const container = document.getElementById('container');
    
    data.qcm.forEach((q, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('question');

      const questionText = document.createElement('p');
      questionText.classList.add('para');
      questionText.textContent = `${index + 1}. ${q.question}`;
      questionDiv.appendChild(questionText);

      q.options.forEach(option => {
        const label = document.createElement('label');
        const input = document.createElement('input');

        input.type = 'radio';
        input.name = `question_${index}`;
        input.value = option;

        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        questionDiv.appendChild(label);
        questionDiv.appendChild(document.createElement('br'));
      });

      container.appendChild(questionDiv);
    });
  })
  .catch(error => {
    console.error('Erreur lors du chargement du QCM:', error);
  });

const form = document.getElementById('qcmForm');
form.addEventListener('submit', event => {
  event.preventDefault();
  
  if (!data) {
    console.error('Les données du QCM ne sont pas encore chargées.');
    return;
  }

  const formData = new FormData(event.target);
  const answers = {};
  let score = 0;
  let totalQuestions = data.qcm.length;
  
  data.qcm.forEach((q, index) => {
    const userAnswer = formData.get(`question_${index}`);
    const correctAnswer = q.reponse_correcte;
    
    if (userAnswer === correctAnswer) {
      score++;
    }

    const questionDiv = container.children[index];
    const options = questionDiv.querySelectorAll('input');

    options.forEach(option => {
      const label = option.parentElement;
      option.disabled = true;
      
      if (option.value === correctAnswer) {
        label.style.color = 'green';
        label.style.fontWeight = 900;
        label.style.fontFamily = "system-ui";
        label.style.fontSize = "16px";
      } else if (option.checked && option.value !== correctAnswer) {
        label.style.color = 'red';
        label.style.fontWeight = 900;
        label.style.fontFamily = "system-ui";
        label.style.fontSize = "16px";
      } else {
        label.style.color = 'black';
      }
    });
  });

  const percentage = (score / totalQuestions) * 100;

  let message = `Score final: ${score}/${totalQuestions}\n`;
  message += `Pourcentage de réussite: ${percentage.toFixed(1)}%\n\n`;

  if (percentage === 100) {
    message += "Parfait ! Excellent travail !";
  } else if (percentage >= 80) {
    message += "Très bien ! Continue comme ça !";
  } else if (percentage >= 60) {
    message += "Pas mal ! Mais il y a encore de la place pour s'améliorer.";
  } else if (percentage >= 40) {
    message += "Continue tes efforts ! Une révision serait bénéfique.";
  } else {
    message += "N'hésite pas à revoir le cours et réessayer !";
  }

  alert(message);

  document.querySelector('button[type="submit"]').disabled = true;
});

