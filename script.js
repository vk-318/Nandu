/* =========================================================
   ONE-PLACE CONFIGURATION — edit these values only.
   ========================================================= */
const CONFIG = {
  name: "Nandu",
  senderName: "Your Love",
  relationship: "My Favourite Person"
};

(() => {
  "use strict";

  const state = { currentPage: 0, pageCount: 9, musicPlaying: false };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function populateDynamicNames() {
    $$("[data-name]").forEach(el => { el.textContent = CONFIG.name; });
    $$("[data-sender]").forEach(el => { el.textContent = CONFIG.senderName; });
    document.title = `A Little Something for ${CONFIG.name} ❤️`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `A heartfelt apology and a little love note for ${CONFIG.name}.`;
    const welcome = $("#welcomeTitle");
    if (welcome) welcome.setAttribute("aria-label", `Hey, my beautiful ${CONFIG.name}`);
  }

  function updateNavigation() {
    const index = state.currentPage;
    $("#progressLabel").textContent = `${String(index + 1).padStart(2, "0")} / ${state.pageCount}`;
    $("#progressBar").style.width = `${((index + 1) / state.pageCount) * 100}%`;
    $("#prevButton").disabled = index === 0;
    $("#nextButton").disabled = index === state.pageCount - 1;
    $$("[data-go]").forEach(button => {
      const target = Number(button.dataset.go);
      button.classList.toggle("active", target === index || (button.classList.contains("nav-item") && (
        (target === 0 && index === 0) || (target === 2 && index >= 1 && index <= 4) ||
        (target === 5 && index === 5) || (target === 6 && index === 6) || (target === 8 && index >= 7)
      )));
    });
  }

  function navigateToPage(index) {
    const next = Math.max(0, Math.min(state.pageCount - 1, Number(index)));
    const current = $(`.page[data-page="${state.currentPage}"]`);
    const target = $(`.page[data-page="${next}"]`);
    if (!target || next === state.currentPage) return;
    if (current) current.classList.remove("active");
    target.classList.add("active");
    state.currentPage = next;
    updateNavigation();
    initializeAnimations(target);
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function createFloatingHearts(count = 12) {
    if (reducedMotion) return;
    const layer = $("#particles");
    if (!layer) return;
    const symbols = ["♥", "♡", "✦", "✧", "❀"];
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.fontSize = `${9 + Math.random() * 12}px`;
      particle.style.animationDuration = `${12 + Math.random() * 13}s`;
      particle.style.animationDelay = `${Math.random() * 12}s`;
      layer.appendChild(particle);
    }
  }

  function initializeAnimations(root = document) {
    const items = $$(".reveal", root);
    if (reducedMotion) {
      items.forEach(item => item.classList.add("visible"));
      return;
    }
    if (!("IntersectionObserver" in window)) {
      items.forEach(item => item.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item, i) => {
      item.style.transitionDelay = `${Math.min(i * 75, 350)}ms`;
      observer.observe(item);
    });
  }

  function initializeGiftBox() {
    const button = $("#giftButton");
    const message = $("#surpriseMessage");
    if (!button || !message) return;
    button.addEventListener("click", () => {
      if (button.classList.contains("opened")) return;
      button.classList.add("opened");
      button.setAttribute("aria-expanded", "true");
      message.hidden = false;
      createHeartBurst(24);
    });
  }

  function createHeartBurst(count = 28) {
    if (reducedMotion) return;
    const layer = $("#particles");
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.47;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");
      heart.className = "particle";
      heart.textContent = i % 3 === 0 ? "♥" : "♡";
      heart.style.left = `${centerX + (Math.random() - .5) * 220}px`;
      heart.style.bottom = `${window.innerHeight - centerY}px`;
      heart.style.fontSize = `${12 + Math.random() * 15}px`;
      heart.style.animationDuration = `${3 + Math.random() * 3}s`;
      layer.appendChild(heart);
      window.setTimeout(() => heart.remove(), 6500);
    }
  }

  function initializeForgivenessButtons() {
    const panel = $("#responsePanel");
    const buttons = $("#answerButtons");
    $("#forgiveButton").addEventListener("click", () => {
      panel.innerHTML = `Thank You, My ${escapeHTML(CONFIG.name)} ❤️<br><span style="font: 14px 'DM Sans',sans-serif;color:#927d87">Ab gussa kam, pyaar zyada. Tumhari smile ka dhyaan rakhunga. ❤️</span>`;
      panel.hidden = false;
      buttons.hidden = true;
      createHeartBurst(42);
    });
    $("#timeButton").addEventListener("click", () => {
      panel.textContent = `Koi baat nahi, ${CONFIG.name}. Time le lo. Main yahin hoon, aur tumhari feelings ki respect karta hoon. ❤️`;
      panel.hidden = false;
      buttons.hidden = true;
    });
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function initializeMusicPlayer() {
    const audio = $("#backgroundMusic");
    const toggle = $("#musicToggle");
    toggle.addEventListener("click", async () => {
      if (state.musicPlaying) {
        audio.pause();
        state.musicPlaying = false;
        toggle.classList.remove("playing");
        toggle.setAttribute("aria-label", "Play background music");
        return;
      }
      try {
        await audio.play();
        state.musicPlaying = true;
        toggle.classList.add("playing");
        toggle.setAttribute("aria-label", "Pause background music");
      } catch (error) {
        toggle.title = "Add your own MP3 at music/your-romantic-track.mp3";
        console.info("Music is unavailable. The website works without it.");
      }
    });
    audio.addEventListener("error", () => {
      state.musicPlaying = false;
      toggle.classList.remove("playing");
    });
  }

  function initializeTypewriter() {
    const element = $("[data-typewriter]");
    if (!element) return;
    const text = element.dataset.typewriter;
    let index = 0;
    if (reducedMotion) { element.textContent = text; return; }
    const write = () => {
      if (index >= text.length) return;
      element.textContent += text.charAt(index++);
      window.setTimeout(write, 27);
    };
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        write();
      }
    });
    observer.observe(element);
  }

  function initializeNavigation() {
    $$("[data-next]").forEach(button => button.addEventListener("click", () => navigateToPage(state.currentPage + 1)));
    $$("[data-go]").forEach(button => button.addEventListener("click", () => navigateToPage(button.dataset.go)));
    $("#prevButton").addEventListener("click", () => navigateToPage(state.currentPage - 1));
    $("#nextButton").addEventListener("click", () => navigateToPage(state.currentPage + 1));
    $("#replayButton").addEventListener("click", () => {
      $("#giftButton").classList.remove("opened");
      $("#giftButton").setAttribute("aria-expanded", "false");
      $("#surpriseMessage").hidden = true;
      $("#answerButtons").hidden = false;
      $("#responsePanel").hidden = true;
      navigateToPage(0);
    });
    window.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowRight") navigateToPage(state.currentPage + 1);
      if (event.key === "ArrowLeft") navigateToPage(state.currentPage - 1);
    });
  }

  function initializeCursor() {
    const glow = $("#cursorGlow");
    if (!glow || reducedMotion || !window.matchMedia("(pointer:fine)").matches) return;
    window.addEventListener("pointermove", event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
      glow.style.opacity = ".8";
    }, { passive: true });
    document.addEventListener("pointerleave", () => { glow.style.opacity = "0"; });
  }

  function initializeHeartButton() {
    $("#heartButton").addEventListener("click", () => createHeartBurst(12));
  }

  function initializeWebsite() {
    populateDynamicNames();
    initializeNavigation();
    initializeAnimations();
    initializeGiftBox();
    initializeForgivenessButtons();
    initializeMusicPlayer();
    initializeTypewriter();
    initializeHeartButton();
    initializeCursor();
    createFloatingHearts(window.innerWidth < 600 ? 8 : 15);
    updateNavigation();
    window.setTimeout(() => $("#loader").classList.add("done"), 650);
  }

  document.addEventListener("DOMContentLoaded", initializeWebsite, { once: true });
})();
