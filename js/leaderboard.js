document.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementById("leaderboard-body");
  const categoryFilter = document.getElementById("filter-category");
  const difficultyFilter = document.getElementById("filter-difficulty");
  const toggleBtn = document.getElementById("toggle-limit");

  const currentUser = JSON.parse(localStorage.getItem("user"));
const currentUserName = currentUser?.name;


  let limit = 10; // default Top 10

  async function fetchLeaderboard() {
    body.innerHTML = `
      <tr>
        <td colspan="4">Loading leaderboard...</td>
      </tr>
    `;

const category =
  categoryFilter.value !== "all"
    ? categoryFilter.value
    : "";

const difficulty =
  difficultyFilter.value !== "all"
    ? difficultyFilter.value
    : "";


    let url = `https://quizplay-1y05.onrender.com/api/leaderboard?limit=${limit}`;

    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (difficulty) url += `&difficulty=${encodeURIComponent(difficulty)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      renderTable(data);
    } catch (err) {
      console.error("Leaderboard fetch failed:", err);
      body.innerHTML = `
        <tr>
          <td colspan="4">Failed to load leaderboard</td>
        </tr>
      `;
    }
  }

  function renderTable(data) {
    body.innerHTML = "";

    if (!data || data.length === 0) {
      body.innerHTML = `
        <tr>
          <td colspan="4">No results found</td>
        </tr>
      `;
      return;
    }

    data.forEach((item, index) => {
      const row = document.createElement("tr");

      if (index === 0) row.classList.add("gold");
      if (index === 1) row.classList.add("silver");
      if (index === 2) row.classList.add("bronze");

const isYou = currentUserName && item.name === currentUserName;

row.innerHTML = `
  <td>${item.rank}</td>
  <td>
    ${item.name}
    ${isYou ? `<span class="you-badge">You</span>` : ""}
  </td>
  <td>${item.overallPoints}</td>
  <td>${item.highestPoints ?? "-"}</td>
`;

if (isYou) {
  row.classList.add("you-row");
}


      body.appendChild(row);
    });
  }

  /* ================= TOGGLE TOP 10 / TOP 30 ================= */
  toggleBtn.addEventListener("click", () => {
    limit = limit === 10 ? 30 : 10;
    toggleBtn.textContent =
      limit === 10 ? "View Top 30" : "View Top 10";

    fetchLeaderboard();
  });

  /* ================= FILTER LISTENERS ================= */
  categoryFilter.addEventListener("change", fetchLeaderboard);
  difficultyFilter.addEventListener("change", fetchLeaderboard);

  /* ================= INITIAL LOAD ================= */
  fetchLeaderboard();
});
