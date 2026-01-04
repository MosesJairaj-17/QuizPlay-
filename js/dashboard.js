document.addEventListener("DOMContentLoaded", () => {

  const historyBody = document.getElementById("historyBody");
  const userNameEl = document.getElementById("userName");
  const userEmailEl = document.getElementById("userEmail");
  const profilePicEl = document.getElementById("profilePic");

  const dashboard = document.getElementById("dashboardContent");
  const loginRequired = document.getElementById("loginRequired");

  const rankEl = document.getElementById("userRank");
  const totalPointsEl = document.getElementById("totalPoints");
  const highestPointsEl = document.getElementById("highestPoints");
  const totalQuizzesEl = document.getElementById("totalQuizzes");

  /* ================= AUTH CHECK ================= */

  const user = JSON.parse(localStorage.getItem("user"));
  const guest = JSON.parse(localStorage.getItem("guest"));

  if (!user && guest) {
    loginRequired.classList.remove("hidden");
    dashboard.classList.add("hidden");
    return;
  }

  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  dashboard.classList.remove("hidden");
  loginRequired.classList.add("hidden");

  /* ================= PROFILE ================= */

  userNameEl.textContent = user.name;
  userEmailEl.textContent = user.email || "";

  profilePicEl.src =
    user.photoURL ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const userId = user.email;

  /* ================= USER RANK ================= */

  fetch("https://quizplay-1y05.onrender.com/api/leaderboard?limit=100")
    .then(res => res.json())
    .then(data => {
      const index = data.findIndex(item => item.name === user.name);
      rankEl.textContent = index !== -1 ? `#${index + 1}` : "-";
    })
    .catch(() => {
      rankEl.textContent = "-";
    });

  /* ================= DASHBOARD DATA ================= */

  fetch(`https://quizplay-1y05.onrender.com/api/dashboard/${userId}`)
    .then(res => res.json())
    .then(data => {

      /* ===== STATS ===== */
      totalPointsEl.textContent = data.totalPoints;
      highestPointsEl.textContent = data.highestPoints;
      totalQuizzesEl.textContent = data.totalQuizzes;

      /* ===== HISTORY TABLE ===== */
// HISTORY TABLE — LAST 5 GAMES ONLY
historyBody.innerHTML = "";

if (!data.history.length) {
  historyBody.innerHTML =
    `<tr><td colspan="5">No quiz history found</td></tr>`;
  return;
}

// Sort newest first
const lastFiveGames = data.history
  .slice() // copy array
  .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
  .slice(0, 5);

lastFiveGames.forEach(quiz => {
  const row = document.createElement("tr");
row.innerHTML = `
  <td>${quiz.category}</td>
  <td>${quiz.level}</td>
  <td>${quiz.timer}</td>
  <td>${quiz.score} / ${quiz.totalQuestions}</td>
  <td>${quiz.earnedPoints ?? 0}</td>
  <td>${new Date(quiz.playedAt).toLocaleString()}</td>
`;

  historyBody.appendChild(row);
});



      /* ===== PROGRESS CHART ===== */
      const labels = [];
      const pointsData = [];

      data.history.slice().reverse().forEach(q => {
        labels.push(new Date(q.playedAt).toLocaleDateString());
        pointsData.push(q.earnedPoints || 0);
      });

      const ctx = document.getElementById("progressChart");

      new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Points Earned",
            data: pointsData,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.2)",
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });

    })
    .catch(err => {
      console.error("Dashboard fetch error:", err);
      historyBody.innerHTML =
        `<tr><td colspan="5">Error loading history</td></tr>`;
    });

    /* ================= TAB SWITCH ================= */

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document
      .getElementById(`tab-${btn.dataset.tab}`)
      .classList.add("active");
  });
});


});
