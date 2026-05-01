const THEME_KEY = "mostafa-ui-theme";
const body = document.body;
const header = document.querySelector(".site-header");
const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const revealElements = [...document.querySelectorAll(".reveal")];
const typingText = document.getElementById("typing-text");
const countElements = [...document.querySelectorAll(".count")];
const loader = document.getElementById("page-loader");
const staggerElements = [...document.querySelectorAll(".stagger-item")];

const typingPhrases = [
  "Designing intelligent systems for real-world impact.",
  "Transforming data into strategic decision advantage.",
  "Building scalable AI products from idea to deployment.",
];

function applyTheme(theme) {
  const isLight = theme === "light";
  body.classList.toggle("light", isLight);
  themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme || "dark");
}

function closeMenu() {
  navMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

function setupMenu() {
  menuToggle?.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900) closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

function setupThemeToggle() {
  themeToggle?.addEventListener("click", () => {
    const next = body.classList.contains("light") ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

function runTypingEffect() {
  if (!typingText) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = typingPhrases[phraseIndex];
    const currentText = currentPhrase.slice(0, charIndex);
    typingText.textContent = currentText;

    if (!isDeleting && charIndex < currentPhrase.length) {
      charIndex += 1;
      setTimeout(type, 45);
      return;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, 1600);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(type, 24);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    setTimeout(type, 350);
  }

  type();
}

function animateCount(el) {
  const target = Number(el.dataset.target || 0);
  const duration = 1100;
  let startTimestamp = null;

  function tick(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = String(value);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    } else {
      el.textContent = String(target);
    }
  }

  window.requestAnimationFrame(tick);
}

function setupRevealAndStats() {
  countElements.forEach((item) => item.setAttribute("data-animated", "false"));
  staggerElements.forEach((el, index) => {
    el.style.setProperty("--delay", `${(index % 6) * 60}ms`);
  });

  const observer = new IntersectionObserver(
    (entries, sectionObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");

        if (entry.target.classList.contains("count")) {
          if (entry.target.dataset.animated !== "true") {
            animateCount(entry.target);
            entry.target.dataset.animated = "true";
          }
        }

        sectionObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  [...revealElements, ...countElements].forEach((item) => observer.observe(item));
}

function setupScrollState() {
  const sections = [...document.querySelectorAll("main section[id]")];

  function updateHeaderState() {
    header.classList.toggle("scrolled", window.scrollY > 18);
  }

  function updateActiveNav() {
    let current = "home";
    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) current = section.id;
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("active", isActive);
    });
  }

  window.addEventListener("scroll", () => {
    updateHeaderState();
    updateActiveNav();
  });

  updateHeaderState();
  updateActiveNav();
}

function setupParallax() {
  const hero = document.querySelector(".hero-content");
  if (!hero) return;

  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.12;
    hero.style.transform = `translateY(${offset}px)`;
  });
}

function hideLoader() {
  window.addEventListener("load", () => {
    body.classList.add("loaded");
    setTimeout(() => {
      if (loader) loader.style.display = "none";
    }, 500);
  });
}

initTheme();
setupThemeToggle();
setupMenu();
runTypingEffect();
setupRevealAndStats();
setupScrollState();
setupParallax();
hideLoader();