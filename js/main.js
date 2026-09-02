document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const themeButtons = document.querySelectorAll(".theme-btn");
  const savedTheme = localStorage.getItem("nexacore-theme");
  if (savedTheme === "dark") document.body.classList.add("dark-theme");

  const updateThemeButtons = () => {
    const dark = document.body.classList.contains("dark-theme");
    themeButtons.forEach(button => {
      button.textContent = dark ? "☀" : "☾";
      button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      button.title = dark ? "Switch to light theme" : "Switch to dark theme";
    });
  };
  updateThemeButtons();

  themeButtons.forEach(button => {
    button.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      localStorage.setItem(
        "nexacore-theme",
        document.body.classList.contains("dark-theme") ? "dark" : "light"
      );
      updateThemeButtons();
    });
  });

  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    const target = link.getAttribute("href");
    if (target === currentPage || (currentPage === "" && target === "index.html")) {
      link.classList.add("active");
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, {threshold: 0.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const form = document.querySelector("#contactForm");
  if (!form) return;

  const setError = (id, message) => {
    const el = document.querySelector(`#${id}`);
    if (el) el.textContent = message;
  };

  form.addEventListener("submit", event => {
    event.preventDefault();
    ["nameError","emailError","messageError"].forEach(id => setError(id, ""));
    const success = document.querySelector("#formSuccess");
    if (success) success.style.display = "none";

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const message = document.querySelector("#message").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (name.length < 2) { setError("nameError", "Please enter at least 2 characters."); valid = false; }
    if (!emailPattern.test(email)) { setError("emailError", "Please enter a valid email address."); valid = false; }
    if (message.length < 10) { setError("messageError", "Message must be at least 10 characters."); valid = false; }

    if (valid && success) {
      success.textContent = "Thanks! Your message passed validation successfully.";
      success.style.display = "block";
      form.reset();
    }
  });
});
