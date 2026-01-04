document.addEventListener("DOMContentLoaded", () => {

  /* ================= POPUP HELPER ================= */

  function showPopup(type, title, message) {
    const modal = document.getElementById("popupModal");
    const modalBox = document.getElementById("popupBox");
    const modalTitle = document.getElementById("popupTitle");
    const modalMessage = document.getElementById("popupMessage");
    const modalClose = document.getElementById("popupClose");

    if (!modal) return;

    modalBox.className = `modal ${type}`;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalClose.textContent = "OK";

    modal.classList.remove("hidden");

    modalClose.onclick = () => {
      modal.classList.add("hidden");
    };
  }

  
  /* ================= GUEST BANNER ================= */

  const guestBanner = document.getElementById("guest-banner");
  const user = JSON.parse(localStorage.getItem("user"));
  const guest = JSON.parse(localStorage.getItem("guest"));

  if (!user && guest && guestBanner) {
    guestBanner.classList.remove("hidden");
  }

  /* ================= USER ================= */

  const playerName = localStorage.getItem("playerName") || "Player";

  /* ================= STEPS ================= */

  const steps = document.querySelectorAll(".step");
  const stepCategory = document.getElementById("step-category");
  const stepLevel = document.getElementById("step-level");
  const stepSettings = document.getElementById("step-settings");
  const stepPlay = document.getElementById("step-play");

  const toLevelBtn = document.getElementById("to-level");
  const toSettingsBtn = document.getElementById("to-settings");
  const startQuizBtn = document.getElementById("start-quiz");

  const backToCategoryBtn = document.getElementById("back-to-category");
  const backToLevelBtn = document.getElementById("back-to-level");

  /* ================= UI ================= */

  const timerSelect = document.getElementById("timer");
  const questionCountSelect = document.getElementById("question-count");

  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("quiz-options");

  const submitBtn = document.getElementById("submit-answer");
  const nextBtn = document.getElementById("next-question");

  const timerFill = document.getElementById("timer-fill");
  const timerText = document.getElementById("timer-text");

  const timeUpOverlay = document.getElementById("time-up-overlay");

  /* ================= STATE ================= */

  const quizData = {
    category: "",
    difficulty: "",
    totalTime: 0,
    questionCount: 0
  };

  let quizQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedOption = null;

  let timerInterval = null;
  let timeLeft = 0;

  /* ================= HELPERS ================= */

  function showStep(step) {
    steps.forEach(s => s.classList.remove("active"));
    step.classList.add("active");
  }

  function normalizeKey(text) {
    return text.toLowerCase().replace(/\s+/g, "");
  }

  function handleSetupSelection(container, key) {
    container.querySelectorAll(".setup-option").forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll(".setup-option")
          .forEach(o => o.classList.remove("selected"));
        btn.classList.add("selected");
        quizData[key] = normalizeKey(btn.textContent);
      };
    });
  }

  /* ================= SETUP FLOW ================= */

  handleSetupSelection(stepCategory, "category");
  handleSetupSelection(stepLevel, "difficulty");

  toLevelBtn.onclick = () => {
    const selected = stepCategory.querySelector(".setup-option.selected");

    if (!selected) {
      showPopup(
        "error",
        "Select Category",
        "Please select a category to continue."
      );
      return;
    }

    quizData.category = normalizeKey(selected.textContent);
    showStep(stepLevel);
  };

  toSettingsBtn.onclick = () => {
    const selected = stepLevel.querySelector(".setup-option.selected");

    if (!selected) {
      showPopup(
        "error",
        "Select Difficulty",
        "Please select a difficulty level."
      );
      return;
    }

    quizData.difficulty = normalizeKey(selected.textContent);
    showStep(stepSettings);
  };

  backToCategoryBtn.onclick = () => showStep(stepCategory);
  backToLevelBtn.onclick = () => showStep(stepLevel);

  /* ================= START QUIZ ================= */

  startQuizBtn.onclick = () => {
    if (guestBanner) {
      guestBanner.classList.add("hide");
      setTimeout(() => guestBanner.remove(), 400);
    }

    clearInterval(timerInterval);

    quizData.totalTime = +timerSelect.value;
    quizData.questionCount = +questionCountSelect.value;

    if (
      !questionBank[quizData.category] ||
      !questionBank[quizData.category][quizData.difficulty]
    ) {
      showPopup(
        "error",
        "Quiz Data Missing",
        "Questions are not available for this selection."
      );
      return;
    }

    quizQuestions = shuffle(
      questionBank[quizData.category][quizData.difficulty]
    ).slice(0, quizData.questionCount);

    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;

    timeLeft = quizData.totalTime;

    timerText.textContent = timeLeft;
    timerFill.style.width = "100%";
    timerText.classList.remove("warning");
    timerFill.classList.remove("warning");

    showStep(stepPlay);
    loadQuestion();
    startTimer();
  };

  /* ================= TIMER ================= */

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;

      timerText.textContent = Math.max(timeLeft, 0);
      timerFill.style.width =
        `${(Math.max(timeLeft, 0) / quizData.totalTime) * 100}%`;

      if (timeLeft <= 5) {
        timerText.classList.add("warning");
        timerFill.classList.add("warning");
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        forceTimeUp();
      }
    }, 1000);
  }

  function forceTimeUp() {
    clearInterval(timerInterval);

    submitBtn.disabled = true;
    nextBtn.disabled = true;

    document.querySelectorAll(".quiz-option").forEach(o => {
      o.style.pointerEvents = "none";
    });

    if (timeUpOverlay) {
      timeUpOverlay.classList.add("active");
    }

    setTimeout(finishQuiz, 1000);
  }

  /* ================= QUIZ ================= */

  function loadQuestion() {
    selectedOption = null;
    optionsContainer.innerHTML = "";
    submitBtn.disabled = false;
    nextBtn.classList.add("hidden");

    const q = quizQuestions[currentQuestionIndex];
    questionText.textContent = q.question;

    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.textContent = opt;

      btn.onclick = () => {
        document.querySelectorAll(".quiz-option")
          .forEach(o => o.classList.remove("selected"));
        btn.classList.add("selected");
        selectedOption = opt;
      };

      optionsContainer.appendChild(btn);
    });
  }

  submitBtn.onclick = () => {
    if (!selectedOption) return;

    submitBtn.disabled = true;

    const correct = quizQuestions[currentQuestionIndex].answer;
    if (selectedOption === correct) score++;

    document.querySelectorAll(".quiz-option").forEach(o => {
      if (o.textContent === correct) o.classList.add("correct");
      else if (o.textContent === selectedOption) o.classList.add("wrong");
    });

    if (currentQuestionIndex === quizQuestions.length - 1) {
      setTimeout(finishQuiz, 800);
    } else {
      nextBtn.classList.remove("hidden");
    }
  };

  nextBtn.onclick = () => {
    currentQuestionIndex++;
    loadQuestion();
  };

  function finishQuiz() {
    clearInterval(timerInterval);

    localStorage.setItem("quizResult", JSON.stringify({
      name: playerName,
      score,
      total: quizQuestions.length,
      category: quizData.category,
      difficulty: quizData.difficulty,
      timer: quizData.totalTime
    }));

    if (timeUpOverlay) {
      timeUpOverlay.classList.remove("active");
    }

    setTimeout(() => {
      window.location.href = "result.html";
    }, 100);
  }

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

});


