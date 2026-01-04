/* ==================================================
   PAGE DETECTION
================================================== */

const currentPage = window.location.pathname;


/* ==================================================
   AUTH STATE (NAVBAR)
================================================== */

const authArea = document.getElementById("authArea");
const authUser = JSON.parse(localStorage.getItem("user"));
const guestUser = JSON.parse(localStorage.getItem("guest"));

if (authArea) {
  if (authUser || guestUser) {
    const currentUser = authUser || guestUser;

    authArea.innerHTML = `
      <div class="user-menu" id="userMenu">
        <img src="css/avatar.png" class="user-avatar" />
        <span class="user-name">${currentUser.name}</span>

        <div class="dropdown">
          ${authUser ? `<a href="dashboard.html">Dashboard</a>` : ``}
          <a href="#" id="logoutBtn">Logout</a>
        </div>
      </div>
    `;

    const userMenu = document.getElementById("userMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    userMenu.addEventListener("click", () => {
      userMenu.classList.toggle("active");
    });

    logoutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      localStorage.removeItem("user");
      localStorage.removeItem("guest");
      window.location.reload();
    });

  } else {
    authArea.innerHTML = `
      <button class="btn primary" id="openAuth">Login</button>
    `;

    document.getElementById("openAuth").onclick = () => {
      window.location.href = "auth.html";
    };
  }
}



/* ==================================================
   HERO SLIDESHOW + CATEGORY SYNC
================================================== */

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const tags = document.querySelectorAll(".hero-tags span");

let currentSlide = 0;

function updateActive(index) {
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));
  tags.forEach(t => t.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index]?.classList.add("active");
  tags[index]?.classList.add("active");
}

if (slides.length) {
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateActive(currentSlide);
  }, 2000);
}

/* ==================================================
   GET STARTED BUTTON (FINAL FIX)
================================================== */

const getStartedBtn = document.getElementById("openAuth");

if (getStartedBtn) {
  getStartedBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const guest = JSON.parse(localStorage.getItem("guest"));

    if (user || guest) {
      window.location.href = "quiz.html";
    } else {
      window.location.href = "auth.html";
    }
  });
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");

  if (!link) return;

  // Allow external links & mailto links
  if (
    link.hasAttribute("data-external") ||
    link.href.startsWith("mailto:") ||
    link.target === "_blank"
  ) {
    e.stopPropagation();
    return;
  }
});
