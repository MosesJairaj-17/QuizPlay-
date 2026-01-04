// js/theme.js

function initDarkMode() {
  const toggle = document.getElementById("dark-toggle");
  if (!toggle) return;

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";

  document.body.classList.toggle("dark", isDark);
  toggle.textContent = isDark ? "☀️" : "🌙";

  // Toggle theme on click
  toggle.onclick = () => {
    document.body.classList.toggle("dark");

    const nowDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", nowDark ? "dark" : "light");

    toggle.textContent = nowDark ? "☀️" : "🌙";
  };
}
