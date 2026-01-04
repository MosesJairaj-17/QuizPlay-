document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  if (!navbarContainer) return;

  fetch("navbar.html")
    .then(res => res.text())
    .then(html => {
      navbarContainer.innerHTML = html;

      // Ensure popup is hidden on load
      const modal = document.getElementById("popupModal");
      if (modal) modal.classList.add("hidden");

      initNavbarAuth();
      initDarkMode();
      initMobileNavbar();
    })
    .catch(err => console.error("Navbar load failed", err));
});

function initNavbarAuth() {
  const authArea = document.getElementById("authArea");
  const user = JSON.parse(localStorage.getItem("user"));
  const guest = JSON.parse(localStorage.getItem("guest"));

  if (!authArea) return;

  if (user || guest) {
    const currentUser = user || guest;

    const avatar =
      currentUser.photoURL ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    authArea.innerHTML = `
      <div class="user-menu" id="userMenu">
        <img src="${avatar}" class="user-avatar" />
        <span class="user-name">${currentUser.name}</span>

        <div class="dropdown">
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
      e.preventDefault();
      e.stopPropagation();
      showLogoutPopup();
    });

  } else {
    authArea.innerHTML = `
      <button class="btn primary" id="openAuth">Get Started</button>
    `;

    document.getElementById("openAuth").onclick = () => {
      window.location.href = "auth.html";
    };
  }
}

/* ================= LOGOUT POPUP ================= */

function showLogoutPopup() {
  const modal = document.getElementById("popupModal");
  const modalBox = document.getElementById("popupBox");
  const modalTitle = document.getElementById("popupTitle");
  const modalMessage = document.getElementById("popupMessage");
  const modalClose = document.getElementById("popupClose");

  if (!modal) {
    localStorage.removeItem("user");
    localStorage.removeItem("guest");
    window.location.href = "index.html";
    return;
  }

  modalBox.className = "modal info";
  modalTitle.textContent = "Confirm Logout";
  modalMessage.textContent = "Are you sure you want to log out?";
  modalClose.textContent = "Logout";

  modal.classList.remove("hidden");

  modalClose.onclick = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("guest");

    modalBox.className = "modal success";
    modalTitle.textContent = "Logged Out";
    modalMessage.textContent = "You have been logged out successfully.";
    modalClose.textContent = "OK";

    modalClose.onclick = () => {
      modal.classList.add("hidden");
      window.location.href = "index.html";
    };
  };
}

// ================= MOBILE NAV TOGGLE =================
function initMobileNavbar() {
  const menuToggle = document.getElementById("menuToggle");
  const navRight = document.getElementById("navRight");

  if (!menuToggle || !navRight) {
    console.warn("Mobile navbar elements missing");
    return;
  }

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navRight.classList.toggle("active");
  });

  // Close on link click
  navRight.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navRight.classList.remove("active");
    });
  });

  // Close on outside click
  document.addEventListener("click", () => {
    navRight.classList.remove("active");
  });
}
