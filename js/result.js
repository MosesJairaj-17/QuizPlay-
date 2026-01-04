document.addEventListener("DOMContentLoaded", () => {

  /* ================= GET DATA ================= */
  const quizResult = JSON.parse(localStorage.getItem("quizResult")) || {};
const user = JSON.parse(localStorage.getItem("user"));

const playerName = user && user.name
  ? user.name
  : (localStorage.getItem("playerName") || "Guest");

  const scoreText = document.getElementById("score-text");
  const detailsSection = document.getElementById("result-details");

  const restartBtn = document.getElementById("restart-quiz");
  const viewDetailsBtn = document.getElementById("view-details");
  const newQuizBtn = document.getElementById("new-quiz");
  const leaderboardBtn = document.getElementById("view-leaderboard");
  const perfectBadge = document.getElementById("perfect-badge");

  const score = quizResult.score || 0;
  const total = quizResult.total || 0;

  /* ================= SCORE COUNT-UP ================= */
  function animateScore(finalScore, totalScore) {
    let current = 0;
    const duration = 1200;
    const interval = 30;
    const step = Math.max(1, Math.ceil(finalScore / (duration / interval)));

    const counter = setInterval(() => {
      current += step;
      if (current >= finalScore) {
        current = finalScore;
        clearInterval(counter);
      }
      scoreText.textContent = `${current} / ${totalScore}`;
    }, interval);
  }

  animateScore(score, total);

/* ================= POINT SYSTEM ================= */

const difficulty = (quizResult.difficulty || "easy").toLowerCase();

const pointsMap = {
  easy: 5,
  medium: 10,
  hard: 20
};

const pointsPerQuestion = pointsMap[difficulty] || 5;
const earnedPoints = score * pointsPerQuestion;

console.log("Difficulty:", difficulty);
console.log("Points earned:", earnedPoints);

const pointsText = document.getElementById("points-text");

if (pointsText) {
  pointsText.textContent = `Points Earned: ${earnedPoints}`;
}


  /* ================= PROGRESS RING ================= */
  const ring = document.querySelector(".progress-ring-fill");
  const radius = 85;
  const circumference = 2 * Math.PI * radius;

  if (ring) {
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;

    const percent = total > 0 ? score / total : 0;
    const offset = circumference * (1 - percent);

    setTimeout(() => {
      ring.style.strokeDashoffset = offset;
    }, 300);
  }

  /* ================= PERFECT SCORE BADGE ================= */
  if (score === total && total > 0 && perfectBadge) {
    perfectBadge.classList.remove("hidden");
  }

  /* ================= SAVE TO LEADERBOARD (LOCAL) ================= */
  if (!localStorage.getItem("leaderboardSaved")) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.push({
      name: playerName,
      score,
      total,
      category: quizResult.category || "General",
      difficulty: quizResult.difficulty || "Easy",
      date: new Date().toLocaleString()
    });

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    localStorage.setItem("leaderboardSaved", "true");
  }

   /* ================= SAVE QUIZ TO MONGODB ================= */


  let payload = null;

    if (user && user.email) {
    // 🔐 Firebase authenticated user
    payload = {
      userType: "user",
      userId: user.email,   // email as unique id
      name: playerName,
      category: quizResult.category || "General",
      level: difficulty,
      timer: quizResult.timer || "N/A",
      score: score,
      totalQuestions: total,
      earnedPoints: earnedPoints   // ✅ NEW
    };
  } else {
    // 👤 Guest user
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = "guest_" + Date.now();
      localStorage.setItem("guestId", guestId);
    }

    payload = {
      userType: "guest",
      userId: guestId,
      category: quizResult.category || "General",
      level: difficulty,
      timer: quizResult.timer || "N/A",
      score: score,
      totalQuestions: total,
      earnedPoints: earnedPoints   // ✅ NEW
    };
  }


  console.log("Sending quiz history to backend:", payload);

  fetch("https://quizplay-1y05.onrender.com/api/history/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Quiz history saved:", data);
    })
    .catch(err => {
      console.error("❌ History save failed:", err);
    });


  /* ================= VIEW DETAILS ================= */
  viewDetailsBtn.addEventListener("click", () => {
    const isHidden = detailsSection.classList.toggle("hidden");

    if (!isHidden) {
      detailsSection.innerHTML = `
        <h2>Quiz Summary</h2>
        <p><strong>Player:</strong> ${playerName}</p>
        <p><strong>Category:</strong> ${quizResult.category || "General"}</p>
        <p><strong>Difficulty:</strong> ${quizResult.difficulty || "Easy"}</p>
        <p><strong>Score:</strong> ${score} / ${total}</p>
<p><strong>Points Earned:</strong> ${earnedPoints}</p>

      `;
      viewDetailsBtn.textContent = "Hide Results";
    } else {
      viewDetailsBtn.textContent = "View Results";
    }
  });

  /* ================= BUTTON ACTIONS ================= */
  restartBtn.addEventListener("click", () => {
    localStorage.removeItem("leaderboardSaved");
    window.location.href = "quiz.html";
  });

  newQuizBtn.addEventListener("click", () => {
    localStorage.removeItem("quizResult");
    localStorage.removeItem("leaderboardSaved");
    window.location.href = "index.html";
  });

  leaderboardBtn.addEventListener("click", () => {
    window.location.href = "leaderboard.html";
  });

});
