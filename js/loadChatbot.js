document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("chatbot-container");
  if (!container) return;

  fetch("chatbot.html")
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
    })
    .catch(err => {
      console.error("Failed to load chatbot:", err);
    });
});
