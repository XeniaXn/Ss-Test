// script.js

const questions = [
  {
    section: "Verbal Reasoning",
    question:
      "In high-stakes environments, what is most likely to contribute to mission failure?",
    options: [
      "Delayed supplies",
      "Physical exhaustion",
      "Lack of clear communication",
      "Environmental changes",
    ],
    answer: 2,
    explanation:
      "Clear communication is essential in high-stakes environments to ensure coordination and success.",
  },
  {
    section: "Numerical Reasoning",
    question: "What is 18% of 450?",
    options: ["72", "80", "81", "90"],
    answer: 2,
    explanation: "18% of 450 is 0.18 × 450 = 81.",
  },
  {
    section: "Work Rate",
    question: "If 6 men complete a task in 15 days, how many men are needed to complete it in 10 days?",
    options: ["10", "9", "8", "7"],
    answer: 1,
    explanation: "Work is inversely proportional to time. (6×15)/10 = 9 men.",
  },
  {
    section: "Spatial Reasoning",
    question: "Which figure has two lines of symmetry?",
    options: ["Square", "Rectangle", "Equilateral Triangle", "Rhombus"],
    answer: 0,
    explanation:
      "A square has four lines of symmetry, including two vertical and horizontal lines.",
  },
  {
    section: "Electrical Comprehension",
    question: "What happens to total resistance when a resistor is added in parallel?",
    options: ["Increases", "Decreases", "Stays the same", "Doubles"],
    answer: 1,
    explanation:
      "In a parallel circuit, adding a resistor decreases the overall resistance.",
  },
  {
    section: "Mechanical Comprehension",
    question: "What simple machine is used in a car jack?",
    options: ["Lever", "Pulley", "Screw", "Wedge"],
    answer: 2,
    explanation: "A screw is used in car jacks to lift loads with rotational motion.",
  },
];

const app = document.getElementById("app");

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let timer = 300; // 5 minutes total in seconds
let intervalId = null;
let finished = false;
let history = [];

// Utility: Shuffle array
function shuffleArray(arr) {
  return arr
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

// Format time mm:ss
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Save history to localStorage
function saveHistory() {
  localStorage.setItem("defenceTestHistory", JSON.stringify(history));
}

// Load history from localStorage
function loadHistory() {
  const data = localStorage.getItem("defenceTestHistory");
  if (data) {
    history = JSON.parse(data);
  }
}

// Render start screen
function renderStart() {
  app.innerHTML = `
    <h1>Defence Aptitude Test</h1>
    <p>Prepare for your defence entry test with timed practice questions.</p>
    <button id="startBtn">Start Test</button>
  `;

  document.getElementById("startBtn").onclick = () => {
    startQuiz();
  };
}

// Render question screen
function renderQuestion() {
  const q = shuffledQuestions[currentQuestionIndex];
  app.innerHTML = `
    <div class="question-section">
      <h2>${q.section}</h2>
      <span class="timer">⏱ ${formatTime(timer)}</span>
    </div>
    <p>${q.question}</p>
    <div class="options">
      ${q.options
        .map(
          (opt, i) =>
            `<button class="${selectedOption === i ? "selected" : ""}" data-index="${i}" ${
              selectedOption !== null ? "disabled" : ""
            }>${opt}</button>`
        )
        .join("")}
    </div>
  `;

  document.querySelectorAll(".options button").forEach((btn) => {
    btn.onclick = () => {
      if (selectedOption !== null) return;
      selectedOption = parseInt(btn.getAttribute("data-index"));
      if (selectedOption === q.answer) score++;
      renderQuestion(); // re-render to show selection
      setTimeout(() => {
        nextQuestion();
      }, 800);
    };
  });
}

// Render finished screen with review and history
function renderFinished() {
  finished = true;
  history.push(score);
  saveHistory();

  app.innerHTML = `
    <h2>Test Complete</h2>
    <p>You scored ${score} out of ${shuffledQuestions.length}</p>
    <button id="retryBtn">Retry Test</button>
    <div class="review">
      ${shuffledQuestions
        .map(
          (q, i) => `
        <div class="review-item">
          <p><strong>${i + 1}. ${q.question}</strong></p>
          <p>Correct Answer: ${q.options[q.answer]}</p>
          <p><em>${q.explanation}</em></p>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="score-history">
      <h3>Past Scores:</h3>
      <ul>
        ${history
          .map((s, i) => `<li>Attempt ${i + 1}: ${s} / ${shuffledQuestions.length}</li>`)
          .join("")}
      </ul>
    </div>
  `;

  document.getElementById("retryBtn").onclick = () => {
    startQuiz();
  };
}

// Advance to next question or finish
function nextQuestion() {
  selectedOption = null;
  if (currentQuestionIndex + 1 < shuffledQuestions.length) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    clearInterval(intervalId);
    renderFinished();
  }
}

// Start the quiz
function startQuiz() {
  shuffledQuestions = shuffleArray(questions);
  currentQuestionIndex = 0;
  score = 0;
  selectedOption = null;
  timer = 300;
  finished = false;
  renderQuestion();

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    timer--;
    if (timer <= 0) {
      clearInterval(intervalId);
      renderFinished();
    } else {
      // Update timer display only
      const timerEl = document.querySelector(".timer");
      if (timerEl) timerEl.textContent = `⏱ ${formatTime(timer)}`;
    }
  }, 1000);
}

// Initialize app
function init() {
  loadHistory();
  renderStart();
}

init();
