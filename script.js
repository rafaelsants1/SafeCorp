// ==========================================
// SafeCorp Plataforma SaaS - Lógica Core
// ==========================================

const screenTitles = {
  'dashboard':    'Visão Geral',
  'mundo':        'Treinamentos',
  'missao-epi':   'Simulação NR-06',
  'quiz-nr10':    'Segurança Elétrica',
  'fire-nr23':    'Combate a Incêndio',
  'recompensa':   'Recompensa',
  'perfil':       'Meu Perfil',
  'ranking':      'Ranking',
  'relatorios':   'Relatórios',
  'notificacoes': 'Notificações',
  'ajuda':        'Suporte e Ajuda',
  'admin':        'Painel do Gestor',
  'configuracoes':'Configurações',
};

function showScreen(id) {
  // hide all screens - força todas a ficarem ocultas
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  // show target screen
  const target = document.getElementById('screen-' + id);
  if (target) {
    target.classList.add('active');
    target.style.display = 'block';
  }

  // update topbar title
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = screenTitles[id] || id;

  // update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    const fn = item.getAttribute('onclick') || '';
    if (fn.includes("'" + id + "'") || fn.includes('"' + id + '"')) {
      item.classList.add('active');
    }
  });

  // scroll content to top
  const contentEl = document.querySelector('.content');
  if (contentEl) contentEl.scrollTop = 0;
}

/* ════════════════════════════════════════════════
   SIDEBAR TOGGLE
════════════════════════════════════════════════ */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
}

/* ════════════════════════════════════════════════
   EPI DRAG-AND-DROP MINI-GAME
════════════════════════════════════════════════ */
const REQUIRED_EPIS = ['capacete', 'luva', 'bota'];
let droppedEpis = {};
let currentDragEpi = null;

function initEpiMinigame() {
  droppedEpis = {};
  currentDragEpi = null;

  // reset all draggables
  document.querySelectorAll('.draggable-item').forEach(item => {
    item.classList.remove('used');
    item.setAttribute('draggable', 'true');
  });

  // reset all drop zones
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('filled', 'drag-over');
    zone.textContent = zone.dataset.accept === 'capacete' ? 'Cabeça'
                     : zone.dataset.accept === 'luva'     ? 'Mãos'
                     : 'Pés';
  });

  // hide finalizar button
  const btn = document.getElementById('finalizar-epi-btn');
  if (btn) btn.style.display = 'none';

  // bind drag events
  document.querySelectorAll('.draggable-item').forEach(item => {
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragend', onDragEnd);
  });

  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', onDragOver);
    zone.addEventListener('dragleave', onDragLeave);
    zone.addEventListener('drop', onDrop);
  });
}

function onDragStart(e) {
  currentDragEpi = e.currentTarget.dataset.epi;
  e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd() {
  document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const zone = e.currentTarget;
  zone.classList.remove('drag-over');

  const accepted = zone.dataset.accept;
  if (currentDragEpi === accepted && !zone.classList.contains('filled')) {
    zone.classList.add('filled');
    zone.textContent = accepted.charAt(0).toUpperCase() + accepted.slice(1) + ' ✓';
    droppedEpis[accepted] = true;

    // mark item as used
    document.querySelectorAll('.draggable-item').forEach(item => {
      if (item.dataset.epi === currentDragEpi) {
        item.classList.add('used');
        item.setAttribute('draggable', 'false');
      }
    });

    checkEpiCompletion();
  }
  currentDragEpi = null;
}

function checkEpiCompletion() {
  const complete = REQUIRED_EPIS.every(epi => droppedEpis[epi]);
  const btn = document.getElementById('finalizar-epi-btn');
  if (btn) btn.style.display = complete ? 'inline-flex' : 'none';
}

function processarFimMissaoEpi() {
  document.getElementById('recompensa-modulo').textContent = 'NR-06 (Equipamentos de Proteção)';
  document.getElementById('recompensa-xp').textContent = '+350 XP';

  // badge icon
  const badgeIconEl = document.getElementById('recompensa-badge-icon');
  if (badgeIconEl) {
    badgeIconEl.innerHTML = `
      <svg viewBox="0 0 120 120" width="42" height="42" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-rw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#1D4ED8"/>
          </linearGradient>
        </defs>
        <path d="M60 5 L70 15 L85 15 L90 28 L103 33 L100 47 L110 58 L100 69 L103 83 L90 88 L85 101 L70 101 L60 111 L50 101 L35 101 L30 88 L17 83 L20 69 L10 58 L20 47 L17 33 L30 28 L35 15 L50 15 Z"
          fill="url(#grad-rw)" stroke="#4C1D95" stroke-width="2"/>
        <path d="M45 60 L55 70 L75 48" fill="none" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    badgeIconEl.style.background = 'transparent';
    badgeIconEl.style.padding = '0';
  }

  document.getElementById('recompensa-badge').textContent = 'Especialista em EPIs';

  showScreen('recompensa');
}

/* ════════════════════════════════════════════════
   QUIZ NR-10 - SEGURANÇA ELÉTRICA
════════════════════════════════════════════════ */
const questionsNR10 = [
  {
    text: "Qual é a distância mínima de segurança para trabalhos próximos a linhas elétricas energizadas de alta tensão?",
    options: [
      "a) 0,5 metro",
      "b) 1,0 metro",
      "c) 2,0 metros",
      "d) 5,0 metros"
    ],
    correct: 2,
    explanation: "A NR-10 estabelece que a distância mínima para trabalhos próximos a linhas elétricas energizadas de alta tensão é de 2,0 metros, conforme a tabela de distâncias de segurança da norma."
  },
  {
    text: "Qual é a tensão limite estabelecida pela NR-10 para considerar uma instalação como 'baixa tensão'?",
    options: [
      "a) Até 220V",
      "b) Até 380V",
      "c) Até 750V",
      "d) Até 1000V"
    ],
    correct: 3,
    explanation: "Segundo a NR-10, baixa tensão é aquela igual ou inferior a 1000V em corrente alternada ou 1500V em corrente contínua."
  },
  {
    text: "Quais são os EPIs obrigatórios para trabalho em instalações elétricas energizadas?",
    options: [
      "a) Capacete e luvas de raspa",
      "b) Luvas isolantes, capacete com viseira e calçado isolante",
      "c) Apenas luvas de borracha",
      "d) Óculos de segurança e luva de algodão"
    ],
    correct: 1,
    explanation: "Para trabalho em instalações elétricas energizadas, são obrigatórios: luvas isolantes apropriadas para a tensão, capacete com viseira de proteção (quando necessário), calçado isolante e ferramentas isoladas."
  },
  {
    text: "Qual documento é obrigatório para trabalhos em instalações elétricas conforme a NR-10?",
    options: [
      "a) Certificado de autorização de trabalho a quente",
      "b) Permissão de trabalho (PT) ou ordem de serviço",
      "c) Licença de funcionamento",
      "d) Certificado de conformidade do INMETRO"
    ],
    correct: 1,
    explanation: "A NR-10 exige a emissão de Permissão de Trabalho (PT) ou ordem de serviço que descreva os procedimentos de segurança, riscos envolvidos e EPIs necessários antes do início dos trabalhos."
  },
  {
    text: "Qual é a periodicidade mínima para treinamento dos trabalhadores habilitados em instalações elétricas?",
    options: [
      "a) A cada 6 meses",
      "b) Anualmente",
      "c) A cada 2 anos",
      "d) A cada 3 anos"
    ],
    correct: 2,
    explanation: "A NR-10 estabelece que a reciclagem dos trabalhadores deve ocorrer a cada 2 anos, garantindo que mantenham seus conhecimentos atualizados sobre procedimentos de segurança."
  }
];

let currentQuiz = {
  questions: [],
  currentIndex: 0,
  score: 0,
  attempts: 3,
  answered: false,
  timer: null,
  timeLeft: 30
};

function initQuizNR10() {
  // Reset quiz state
  currentQuiz = {
    questions: [...questionsNR10],
    currentIndex: 0,
    score: 0,
    attempts: 3,
    answered: false,
    timer: null,
    timeLeft: 30
  };

  // Update screen titles
  document.getElementById('current-question').textContent = '1';
  document.getElementById('total-questions').textContent = currentQuiz.questions.length;
  document.getElementById('quiz-score').textContent = '0';

  // Load first question
  loadQuestion();
}

function loadQuestion() {
  const question = currentQuiz.questions[currentQuiz.currentIndex];
  currentQuiz.answered = false;
  currentQuiz.attempts = 3;
  currentQuiz.timeLeft = 30;

  // Update UI
  document.getElementById('current-question').textContent = currentQuiz.currentIndex + 1;
  document.getElementById('question-text').textContent = question.text;
  document.getElementById('quiz-attempts').innerHTML = 'Tentativas restantes: <span class="quiz-attempts-hearts">' +
    '❤️'.repeat(3) + '</span>';

  // Generate options
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const optionEl = document.createElement('div');
    optionEl.className = 'quiz-option';
    optionEl.innerHTML = `
      <span class="quiz-option-letter">${String.fromCharCode(97 + index)}</span>
      <span class="quiz-option-text">${option.substring(3)}</span>
    `;
    optionEl.addEventListener('click', () => checkAnswer(index));
    optionsContainer.appendChild(optionEl);
  });

  // Reset feedback and next button
  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-feedback').innerHTML = '';
  document.getElementById('next-question-btn').style.display = 'none';

  // Start timer
  updateTimerDisplay();
  startTimer();
}

function startTimer() {
  if (currentQuiz.timer) clearInterval(currentQuiz.timer);

  currentQuiz.timer = setInterval(() => {
    currentQuiz.timeLeft--;
    updateTimerDisplay();

    if (currentQuiz.timeLeft <= 0) {
      handleTimeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('quiz-timer');
  const minutes = Math.floor(currentQuiz.timeLeft / 60);
  const seconds = currentQuiz.timeLeft % 60;
  timerEl.innerHTML = `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Visual warnings
  timerEl.classList.remove('warning', 'danger');
  if (currentQuiz.timeLeft <= 10) {
    timerEl.classList.add('danger');
  } else if (currentQuiz.timeLeft <= 20) {
    timerEl.classList.add('warning');
  }
}

function handleTimeUp() {
  clearInterval(currentQuiz.timer);

  if (!currentQuiz.answered) {
    // Lose an attempt when time runs out
    currentQuiz.attempts--;
    updateAttemptsDisplay();

    const question = currentQuiz.questions[currentQuiz.currentIndex];
    showFeedback(false, "Tempo esgotado! " + question.explanation);

    // Disable all options
    document.querySelectorAll('.quiz-option').forEach(opt => {
      opt.classList.add('disabled');
    });

    // Highlight correct answer
    document.querySelectorAll('.quiz-option')[question.correct].classList.add('correct');

    currentQuiz.answered = true;

    // Check if out of attempts
    if (currentQuiz.attempts <= 0) {
      setTimeout(() => nextQuestion(), 2500);
    } else {
      document.getElementById('next-question-btn').style.display = 'inline-flex';
    }
  }
}

function updateAttemptsDisplay() {
  const hearts = '❤️'.repeat(Math.max(0, currentQuiz.attempts));
  document.getElementById('quiz-attempts').innerHTML = 'Tentativas restantes: <span class="quiz-attempts-hearts">' + hearts + '</span>';
}

function checkAnswer(selectedIndex) {
  if (currentQuiz.answered) return;

  clearInterval(currentQuiz.timer);

  const question = currentQuiz.questions[currentQuiz.currentIndex];
  const options = document.querySelectorAll('.quiz-option');
  const isCorrect = selectedIndex === question.correct;

  // Disable all options
  options.forEach(opt => opt.classList.add('disabled'));

  if (isCorrect) {
    // Correct answer
    options[selectedIndex].classList.add('correct');

    // Calculate XP based on attempts remaining
    let xpEarned = 0;
    if (currentQuiz.attempts === 3) xpEarned = 100;
    else if (currentQuiz.attempts === 2) xpEarned = 50;
    else xpEarned = 25;

    currentQuiz.score += xpEarned;
    document.getElementById('quiz-score').textContent = currentQuiz.score;

    showFeedback(true, `Correto! +${xpEarned} XP. ${question.explanation}`);
    currentQuiz.answered = true;
    document.getElementById('next-question-btn').style.display = 'inline-flex';
  } else {
    // Wrong answer
    options[selectedIndex].classList.add('incorrect');
    currentQuiz.attempts--;
    updateAttemptsDisplay();

    if (currentQuiz.attempts > 0) {
      // Still has attempts, show feedback and continue
      showFeedback(false, `Resposta incorreta. Você ainda tem ${currentQuiz.attempts} tentativa(s). Tente novamente!`);

      // Remove incorrect mark after delay to allow retry
      setTimeout(() => {
        options[selectedIndex].classList.remove('incorrect', 'disabled');
        startTimer();
      }, 1500);
    } else {
      // No more attempts
      options[question.correct].classList.add('correct');
      showFeedback(false, `Resposta incorreta. ${question.explanation}`);
      currentQuiz.answered = true;
      setTimeout(() => nextQuestion(), 2500);
    }
  }
}

function showFeedback(isCorrect, message) {
  const feedbackEl = document.getElementById('quiz-feedback');
  feedbackEl.className = 'quiz-feedback show ' + (isCorrect ? 'correct' : 'incorrect');
  feedbackEl.innerHTML = `
    <div class="quiz-feedback-title">
      ${isCorrect ? '✅ Acertou!' : '❌ Errou!'}
    </div>
    <div class="quiz-feedback-text">${message}</div>
  `;
}

function nextQuestion() {
  currentQuiz.currentIndex++;

  if (currentQuiz.currentIndex >= currentQuiz.questions.length) {
    finishQuiz();
  } else {
    loadQuestion();
  }
}

function finishQuiz() {
  clearInterval(currentQuiz.timer);

  // Calculate final stats
  const maxScore = currentQuiz.questions.length * 100;
  const percentage = Math.round((currentQuiz.score / maxScore) * 100);

  // Update reward screen
  document.getElementById('recompensa-modulo').textContent = 'NR-10 (Segurança Elétrica)';
  document.getElementById('recompensa-xp').textContent = `+${currentQuiz.score} XP`;

  // Badge icon for NR-10
  const badgeIconEl = document.getElementById('recompensa-badge-icon');
  if (badgeIconEl) {
    badgeIconEl.innerHTML = `
      <svg viewBox="0 0 120 120" width="42" height="42" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-nr10" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F59E0B"/>
            <stop offset="100%" stop-color="#EF4444"/>
          </linearGradient>
        </defs>
        <path d="M60 5 L70 15 L85 15 L90 28 L103 33 L100 47 L110 58 L100 69 L103 83 L90 88 L85 101 L70 101 L60 111 L50 101 L35 101 L30 88 L17 83 L20 69 L10 58 L20 47 L17 33 L30 28 L35 15 L50 15 Z"
          fill="url(#grad-nr10)" stroke="#B45309" stroke-width="2"/>
        <path d="M45 55 L45 75 M60 45 L60 75 M75 55 L75 75" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>
        <circle cx="45" cy="48" r="3" fill="white"/>
        <circle cx="60" cy="38" r="3" fill="white"/>
        <circle cx="75" cy="48" r="3" fill="white"/>
      </svg>`;
    badgeIconEl.style.background = 'transparent';
    badgeIconEl.style.padding = '0';
  }

  // Badge title based on performance
  let badgeTitle = 'Aprendiz em Eletricidade';
  if (percentage >= 80) badgeTitle = 'Especialista em Segurança Elétrica';
  else if (percentage >= 60) badgeTitle = 'Técnico em NR-10';

  document.getElementById('recompensa-badge').textContent = badgeTitle;

  showScreen('recompensa');
}

/* ════════════════════════════════════════════════
   COMBATE A INCÊNDIO NR-23
════════════════════════════════════════════════ */
const fireScenarios = [
  {
    description: "Incêndio em equipamentos elétricos energizados no centro de controle.",
    class: "C",
    classLabel: "Classe C",
    classIcon: "⚡",
    correctExtinguisher: "CO₂ (Gás Carbônico)",
    correctClass: "C",
    xpValue: 100,
    explanation: "Incêndios em equipamentos elétricos energizados são Classe C. O extintor de CO₂ é ideal pois não deixa resíduos e não conduz eletricidade."
  },
  {
    description: "Fogo em tambores contendo líquidos inflamáveis (gasolina) no almoxarifado.",
    class: "B",
    classLabel: "Classe B",
    classIcon: "🛢️",
    correctExtinguisher: "Pó Químico Seco BC",
    correctClass: "B",
    xpValue: 100,
    explanation: "Líquidos inflamáveis caracterizam incêndio Classe B. Pó químico seco é eficaz para interromper a reação química do fogo."
  },
  {
    description: "Princípio de incêndio em lixeira com papel, cartão e materiais de escritório.",
    class: "A",
    classLabel: "Classe A",
    classIcon: "📦",
    correctExtinguisher: "Água Pressurizada",
    correctClass: "A",
    xpValue: 100,
    explanation: "Materiais sólidos combustíveis como papel e madeira são Classe A. A água é o agente mais eficaz por resfriar o material."
  },
  {
    description: "Combustão em tanque de óleo combustível e graxa industrial.",
    class: "B",
    classLabel: "Classe B",
    classIcon: "🛢️",
    correctExtinguisher: "CO₂ (Gás Carbônico)",
    correctClass: "B",
    xpValue: 100,
    explanation: "Óleos e graxas são Classe B. CO₂ é eficaz para sufocar o fogo sem danificar equipamentos."
  },
  {
    description: "Fogo em equipamentos com metais pirofóricos como magnésio na oficina.",
    class: "D",
    classLabel: "Classe D",
    classIcon: "🔩",
    correctExtinguisher: "Pó Especial",
    correctClass: "D",
    xpValue: 100,
    explanation: "Metais combustíveis são Classe D e requerem pó especial seco, nunca água ou outros agentes que possam reagir com o metal."
  }
];

const extinguishers = [
  { name: "Água Pressurizada", class: "A", classes: "Classe A", icon: "💧" },
  { name: "Pó Químico Seco BC", class: "B", classes: "Classe B e C", icon: "🧯" },
  { name: "CO₂ (Gás Carbônico)", class: "C", classes: "Classe B e C", icon: "💨" },
  { name: "Pó Especial", class: "D", classes: "Classe D", icon: "⭐" }
];

let currentFireGame = {
  scenarios: [],
  currentIndex: 0,
  score: 0,
  timeLeft: 60,
  timer: null,
  answered: false
};

function initFireGame() {
  // Shuffle scenarios
  currentFireGame = {
    scenarios: [...fireScenarios].sort(() => Math.random() - 0.5),
    currentIndex: 0,
    score: 0,
    timeLeft: 60,
    timer: null,
    answered: false
  };

  // Update UI
  document.getElementById('fire-score').textContent = '0';
  document.getElementById('fire-timer').textContent = '60';
  document.getElementById('fires-controlled').textContent = '0';
  document.getElementById('total-fires').textContent = currentFireGame.scenarios.length;

  loadFireScenario();
  startFireTimer();
}

function startFireTimer() {
  if (currentFireGame.timer) clearInterval(currentFireGame.timer);

  currentFireGame.timer = setInterval(() => {
    currentFireGame.timeLeft--;
    updateFireTimerDisplay();

    if (currentFireGame.timeLeft <= 0) {
      finishFireGame();
    }
  }, 1000);
}

function updateFireTimerDisplay() {
  const timerEl = document.getElementById('fire-timer');
  timerEl.textContent = currentFireGame.timeLeft;

  // Update timer bar
  const timerFill = document.getElementById('fire-timer-fill');
  const percentage = (currentFireGame.timeLeft / 60) * 100;
  timerFill.style.width = percentage + '%';

  const headerEl = document.querySelector('.fire-header');
  if (currentFireGame.timeLeft <= 15) {
    headerEl.classList.add('warning');
  } else {
    headerEl.classList.remove('warning');
  }
}

function loadFireScenario() {
  const scenario = currentFireGame.scenarios[currentFireGame.currentIndex];
  currentFireGame.answered = false;

  // Update scene
  document.getElementById('scenario-description').textContent = scenario.description;
  document.getElementById('fires-controlled').textContent = currentFireGame.currentIndex;

  // Update fire animation class
  const fireAnim = document.querySelector('.fire-animation');
  fireAnim.className = `fire-animation class-${scenario.class.toLowerCase()}`;
  fireAnim.classList.remove('fire-extinguishing');

  // Update class badge
  let classBadge = document.querySelector('.fire-class-badge');
  if (!classBadge) {
    classBadge = document.createElement('div');
    classBadge.className = 'fire-class-badge';
    document.querySelector('.fire-scene').appendChild(classBadge);
  }
  classBadge.textContent = scenario.classIcon;
  classBadge.style.display = 'none'; // Hidden until answered

  // Generate extinguisher cards
  const grid = document.getElementById('extinguishers-grid');
  grid.innerHTML = '';

  extinguishers.forEach((ext) => {
    const card = document.createElement('div');
    card.className = 'extinguisher-card';
    card.dataset.class = ext.class;
    card.innerHTML = `
      <div class="extinguisher-icon">${ext.icon}</div>
      <div class="extinguisher-name">${ext.name}</div>
      <div class="extinguisher-class">${ext.classes}</div>
    `;
    card.addEventListener('click', () => selectExtinguisher(ext, card));
    grid.appendChild(card);
  });

  // Reset feedback
  const feedbackEl = document.getElementById('fire-feedback');
  feedbackEl.className = 'fire-feedback';
  feedbackEl.innerHTML = '';
}

function selectExtinguisher(extinguisher, cardElement) {
  if (currentFireGame.answered) return;

  const scenario = currentFireGame.scenarios[currentFireGame.currentIndex];
  const isCorrect = extinguisher.class === scenario.correctClass;

  currentFireGame.answered = true;

  // Disable all cards
  document.querySelectorAll('.extinguisher-card').forEach(card => {
    card.classList.add('disabled');
  });

  // Show class badge
  const classBadge = document.querySelector('.fire-class-badge');
  if (classBadge) classBadge.style.display = 'flex';

  if (isCorrect) {
    // Correct extinguisher
    cardElement.classList.add('correct');

    // Extinguish animation
    document.querySelector('.fire-animation').classList.add('fire-extinguishing');

    // Calculate XP based on remaining time
    const timeBonus = Math.floor(currentFireGame.timeLeft / 10) * 10;
    const xpEarned = scenario.xpValue + timeBonus;
    currentFireGame.score += xpEarned;
    document.getElementById('fire-score').textContent = currentFireGame.score;

    showFireFeedback(true, `Correto! +${xpEarned} XP. ${scenario.explanation}`);

    // Next scenario after delay
    setTimeout(() => {
      currentFireGame.currentIndex++;
      if (currentFireGame.currentIndex >= currentFireGame.scenarios.length) {
        finishFireGame();
      } else {
        loadFireScenario();
      }
    }, 2500);
  } else {
    // Wrong extinguisher
    cardElement.classList.add('wrong');

    // Show correct answer
    document.querySelectorAll('.extinguisher-card').forEach(card => {
      if (card.dataset.class === scenario.correctClass) {
        card.classList.add('correct');
      }
    });

    // Penalty: -5 seconds
    currentFireGame.timeLeft = Math.max(0, currentFireGame.timeLeft - 5);
    updateFireTimerDisplay();

    showFireFeedback(false, `Incorreto! ${scenario.explanation} (Penalidade: -5 segundos)`);

    // Move to next scenario after delay
    setTimeout(() => {
      currentFireGame.currentIndex++;
      if (currentFireGame.currentIndex >= currentFireGame.scenarios.length) {
        finishFireGame();
      } else {
        loadFireScenario();
      }
    }, 3500);
  }
}

function showFireFeedback(isSuccess, message) {
  const feedbackEl = document.getElementById('fire-feedback');
  feedbackEl.className = 'fire-feedback show ' + (isSuccess ? 'success' : 'error');
  feedbackEl.innerHTML = `
    <div class="fire-feedback-title">
      ${isSuccess ? '🔥 Fogo Controlado!' : '❌ Escolha Incorreta!'}
    </div>
    <div class="fire-feedback-text">${message}</div>
  `;
}

function finishFireGame() {
  clearInterval(currentFireGame.timer);

  const maxScore = currentFireGame.scenarios.length * 200;
  const percentage = Math.round((currentFireGame.score / maxScore) * 100);

  // Update reward screen
  document.getElementById('recompensa-modulo').textContent = 'NR-23 (Prevenção de Incêndios)';
  document.getElementById('recompensa-xp').textContent = `+${currentFireGame.score} XP`;

  // Badge icon for NR-23
  const badgeIconEl = document.getElementById('recompensa-badge-icon');
  if (badgeIconEl) {
    badgeIconEl.innerHTML = `
      <svg viewBox="0 0 120 120" width="42" height="42" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-nr23" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EF4444"/>
            <stop offset="100%" stop-color="#DC2626"/>
          </linearGradient>
        </defs>
        <path d="M60 5 L70 15 L85 15 L90 28 L103 33 L100 47 L110 58 L100 69 L103 83 L90 88 L85 101 L70 101 L60 111 L50 101 L35 101 L30 88 L17 83 L20 69 L10 58 L20 47 L17 33 L30 28 L35 15 L50 15 Z"
          fill="url(#grad-nr23)" stroke="#991B1B" stroke-width="2"/>
        <text x="60" y="72" text-anchor="middle" fill="white" font-size="40" font-weight="800" font-family="sans-serif">F</text>
      </svg>`;
    badgeIconEl.style.background = 'transparent';
    badgeIconEl.style.padding = '0';
  }

  // Badge title based on performance
  let badgeTitle = 'Aprendiz de Combate a Incêndio';
  if (percentage >= 80) badgeTitle = 'Bombeiro Virtual';
  else if (percentage >= 60) badgeTitle = 'Especialista em NR-23';

  document.getElementById('recompensa-badge').textContent = badgeTitle;

  showScreen('recompensa');
}

/* ════════════════════════════════════════════════
   INICIALIZAÇÃO - GARANTE QUE APENAS DASHBOARD ESTÁ VISÍVEL
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  // Oculta todas as telas primeiro
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  
  // Mostra apenas o dashboard
  const dashboard = document.getElementById('screen-dashboard');
  if (dashboard) {
    dashboard.classList.add('active');
    dashboard.style.display = 'block';
  }
  
  // Garantir que a tela de recompensa está oculta
  const rewardScreen = document.getElementById('screen-recompensa');
  if (rewardScreen) {
    rewardScreen.classList.remove('active');
    rewardScreen.style.display = 'none';
  }
  
  // Atualizar título da topbar
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = 'Visão Geral';
  
  // Atualizar estado ativo da navegação
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    const fn = item.getAttribute('onclick') || '';
    if (fn.includes("'dashboard'") || fn.includes('"dashboard"')) {
      item.classList.add('active');
    }
  });
});