function initChatbot() {
  const chatbot = document.getElementById("chatbot");
  const toggleBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("close-chat");
  const chatBody = document.getElementById("chat-body");
  const sendBtn = document.getElementById("send-btn");
  const input = document.getElementById("user-input");

  if (!chatbot || !toggleBtn || !closeBtn) return false;

  /* ================= OPEN CHAT ================= */
  toggleBtn.onclick = () => {
    chatbot.style.display = "flex";
    toggleBtn.style.display = "none";

    requestAnimationFrame(() => {
      chatbot.classList.add("active");
    });
  };

  /* ================= CLOSE CHAT ================= */
  closeBtn.onclick = () => {
    chatbot.classList.remove("active");

    setTimeout(() => {
      chatbot.style.display = "none";
      toggleBtn.style.display = "flex";
    }, 300);
  };

  /* ================= GREETING ================= */
  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }

  /* ================= MESSAGE HELPERS ================= */
  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = sender;

    const span = document.createElement("span");
    span.innerText = text;

    div.appendChild(span);
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTyping(cb) {
    const typing = document.createElement("div");
    typing.className = "bot typing";
    typing.innerText = "QuizPlay Assistant is typing...";
    chatBody.appendChild(typing);

    setTimeout(() => {
      chatBody.removeChild(typing);
      cb();
    }, 700);
  }

  /* ================= BOT LOGIC ================= */
  function getBotReply(msg) {
    msg = msg.toLowerCase();

    if (
  msg === "hi" ||
  msg === "hii" ||
  msg === "hello" ||
  msg === "hey"
) {
  return (
    "👋 Hello! Welcome to QuizPlay Assistant.\n\n" +
    "You can ask me about:\n" +
    "• rules – how the quiz works\n" +
    "• categories – available quiz categories\n" +
    "• leaderboard – ranking & points info\n" +
    "• dashboard – user dashboard access\n" +
    "• score – how points are calculated\n" +
    "• login / signup / guest – access options\n\n" +
    "Just type any of these 👆"
  );
}


    if (msg.includes("help")) {
      return (
        "I can help you with:\n" +
        "• Categories\n" +
        "• Rules\n" +
        "• Score system\n" +
        "• Leaderboard\n" +
        "• Dashboard access\n" +
        "• Login / Signup / Guest mode"
      );
    }

    if (msg.includes("categories")) {
      return (
        "📚 Available quiz categories:\n" +
        "• Music\n" +
        "• Math\n" +
        "• Movies\n" +
        "• History\n" +
        "• Tech\n" +
        "• Science\n" +
        "• Sports\n" +
        "• General Knowledge (GK)"
      );
    }

    if (msg.includes("leaderboard")) {
      return (
        "🏆 Leaderboard info:\n" +
        "• Ranked based on total points\n" +
        "• Shows rank, name, overall points & highest score\n" +
        "• Only logged-in users appear on leaderboard\n" +
        "• Guest users’ progress is NOT shown"
      );
    }

    if (msg.includes("dashboard")) {
      return (
        "📊 Dashboard access:\n" +
        "• Only logged-in users can access dashboard\n" +
        "• Guest users cannot access dashboard\n" +
        "• Please login or signup using Google or Email/Password"
      );
    }

    if (msg.includes("score")) {
      return (
        "🎯 Scoring system:\n" +
        "• Score depends on correct answers\n\n" +
        "Points per question:\n" +
        "• Easy mode → 5 points\n" +
        "• Medium mode → 10 points\n" +
        "• Hard mode → 20 points"
      );
    }

    if (
      msg.includes("login") ||
      msg.includes("signup") ||
      msg.includes("sign up") ||
      msg.includes("guest")
    ) {
      return (
        "🔐 Account options:\n\n" +
        "• Login / Signup:\n" +
        "  - Progress is saved\n" +
        "  - Scores appear on leaderboard\n" +
        "  - Dashboard access available\n\n" +
        "• Guest mode:\n" +
        "  - No progress is saved\n" +
        "  - Not shown on leaderboard\n" +
        "  - Dashboard access not available"
      );
    }

   if (msg.includes("rules")) {
  return (
    "📜 Quiz rules & flow:\n\n" +
    "• User must be logged in to play quizzes\n" +
    "• Guest users cannot start a quiz\n\n" +
    "🧭 Quiz setup steps:\n" +
    "1️⃣ Select category\n" +
    "2️⃣ Select difficulty level\n" +
    "3️⃣ Choose number of questions\n" +
    "4️⃣ Choose time per question\n\n" +
    "📌 Number of questions options:\n" +
    "• 5, 10, 15, 20, 30, 40\n\n" +
    "⏱️ Time options per question:\n" +
    "• 15 sec\n" +
    "• 20 sec\n" +
    "• 30 sec\n" +
    "• 45 sec\n" +
    "• 1 minute"
  );
}


    return "🤔 I didn’t understand that. Try typing: help, categories, score, leaderboard.";
  }

  /* ================= SEND MESSAGE ================= */
  function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    showTyping(() => {
      addMessage(getBotReply(msg), "bot");
    });
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  /* ================= INITIAL MESSAGE ================= */
  addMessage(`${getGreeting()} 👋 I’m QuizPlay Assistant.`, "bot");

  return true;
}

/* ================= WAIT FOR HTML LOAD ================= */
const chatbotInterval = setInterval(() => {
  if (initChatbot()) clearInterval(chatbotInterval);
}, 100);
