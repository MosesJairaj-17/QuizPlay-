/* ==================================================
   FIREBASE IMPORTS
================================================== */

import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "./firebase.js";

import {
  sendEmailVerification,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ================= ELEMENTS ================= */

  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");
  const subtitle = document.getElementById("authSubtitle");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const googleLogin = document.getElementById("googleLogin");
  const startGuest = document.getElementById("startGuest");
  const guestNameInput = document.getElementById("guestName");

  /* ================= MODAL ELEMENTS ================= */

  const modal = document.getElementById("popupModal");
  const modalBox = document.getElementById("popupBox");
  const modalTitle = document.getElementById("popupTitle");
  const modalMessage = document.getElementById("popupMessage");
  const modalClose = document.getElementById("popupClose");

  function showModal(type, title, message, callback) {
    modalBox.className = `modal ${type}`;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove("hidden");

    modalClose.onclick = () => {
      modal.classList.add("hidden");
      if (callback) callback();
    };
  }

  /* ================= TAB SWITCH ================= */

  function switchTab(target) {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => {
      c.classList.add("hidden");
      c.classList.remove("active");
    });

    document.querySelector(`.tab[data-tab="${target}"]`)?.classList.add("active");
    document.getElementById(`${target}Form`)?.classList.remove("hidden");
    document.getElementById(`${target}Form`)?.classList.add("active");

    subtitle.textContent =
      target === "login"
        ? "Login to continue playing"
        : target === "signup"
        ? "Create an account to get started"
        : "Play instantly as a guest";
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  document.querySelectorAll("[data-tab-switch]").forEach(link => {
    link.addEventListener("click", () => switchTab(link.dataset.tabSwitch));
  });

  /* ================= SIGNUP ================= */

  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = signupUsername.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();

    if (!name || !email || !password) {
      showModal("error", "Missing Fields", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      showModal("error", "Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(cred.user, { displayName: name });
      await sendEmailVerification(cred.user);
      await signOut(auth);

      showModal(
        "success",
        "Signup Successful",
        "Account created successfully. Please log in to continue.",
        () => switchTab("login")
      );

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        showModal(
          "error",
          "Account Exists",
          "An account with this email already exists. Please log in instead."
        );
      } else {
        showModal("error", "Signup Failed", err.message);
      }
    }
  });

  /* ================= LOGIN ================= */

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
      showModal("error", "Missing Fields", "Please enter email and password.");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        await signOut(auth);
        showModal("info", "Email Not Verified", "Please verify your email before logging in.");
        return;
      }

      localStorage.setItem("user", JSON.stringify({
        name: cred.user.displayName || cred.user.email.split("@")[0],
        email: cred.user.email,
        photoURL: cred.user.photoURL || "",
        role: "user"
      }));

      localStorage.removeItem("guest");

      showModal(
        "success",
        "Login Successful",
        "Login successful. Welcome back!",
        () => (window.location.href = "index.html")
      );

    } catch (err) {
      if (err.code === "auth/user-not-found") {
        showModal(
          "error",
          "Account Not Found",
          "No account found with this email. Please sign up to continue."
        );
      } else if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        showModal(
          "error",
          "Invalid Credentials",
          "The email or password you entered is incorrect."
        );
      } else {
        showModal("error", "Login Failed", err.message);
      }
    }
  });

  /* ================= GOOGLE LOGIN ================= */

  googleLogin?.addEventListener("click", async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      localStorage.setItem("user", JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: "user"
      }));

      localStorage.removeItem("guest");

      showModal(
        "success",
        "Login Successful",
        "Login successful. Welcome back!",
        () => (window.location.href = "index.html")
      );

    } catch (err) {
      showModal("error", "Google Login Failed", err.message);
    }
  });

  /* ================= GUEST ================= */

  startGuest?.addEventListener("click", () => {
    const name = guestNameInput.value.trim();

    if (!name) {
      showModal("error", "Missing Name", "Please enter your name to continue.");
      return;
    }

    localStorage.setItem("guest", JSON.stringify({ name, role: "guest" }));
    window.location.href = "index.html";
  });

});
