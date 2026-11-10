document.documentElement.classList.add("js");

const themeStorageKey = "swapnilj-portfolio-theme";
const systemColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
const readStoredTheme = () => {
  try {
    const storedTheme = localStorage.getItem(themeStorageKey);
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
  } catch {
    return null;
  }
};

let hasUserPreference = readStoredTheme() !== null;

const navigation = document.querySelector(".primary-nav");
let themeButton;

if (navigation) {
  themeButton = document.createElement("button");
  themeButton.className = "theme-toggle";
  themeButton.type = "button";
  themeButton.setAttribute("aria-label", "Switch to dark mode");
  themeButton.setAttribute("aria-pressed", "false");
  themeButton.innerHTML = '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg><svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path></svg>';
  themeButton.title = "Toggle color theme";
  document.body.append(themeButton);

  const updateThemeButton = (theme) => {
    const isDark = theme === "dark";
    themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
    themeButton.setAttribute("aria-pressed", String(isDark));
  };

  const applyTheme = (theme, persist = false) => {
    document.documentElement.dataset.theme = theme;
    updateThemeButton(theme);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === "dark" ? "#0b1724" : "#ffffff";

    if (persist) {
      hasUserPreference = true;
      try {
        localStorage.setItem(themeStorageKey, theme);
      } catch {
        // The selected theme remains active for this page.
      }
    }
  };

  const initialTheme = readStoredTheme() || (systemColorScheme.matches ? "dark" : "light");
  applyTheme(initialTheme);

  themeButton.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme, true);
  });

  systemColorScheme.addEventListener("change", (event) => {
    if (!hasUserPreference) applyTheme(event.matches ? "dark" : "light");
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== themeStorageKey && event.key !== null) return;
    const storedTheme = readStoredTheme();
    hasUserPreference = storedTheme !== null;
    applyTheme(storedTheme || (systemColorScheme.matches ? "dark" : "light"));
  });
}

const menuButton = document.querySelector(".menu-toggle");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a") && window.matchMedia("(max-width: 680px)").matches) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
      menuButton.focus();
    }
  });
}

document.querySelectorAll("[data-portrait] img").forEach((image) => {
  const portrait = image.closest("[data-portrait]");
  const showFallback = () => portrait?.classList.add("is-placeholder");

  image.addEventListener("error", showFallback, { once: true });
  if (image.complete && image.naturalWidth === 0) showFallback();
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const contactForm = document.querySelector("#contact-form");
if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    if (!(status instanceof HTMLElement)) return;

    if (!contactForm.reportValidity()) {
      status.textContent = "Please complete each field with valid information.";
      status.classList.add("is-error");
      return;
    }

    const nameInput = contactForm.elements.namedItem("name");
    const name = nameInput instanceof HTMLInputElement ? nameInput.value.trim() : "";
    status.classList.remove("is-error");
    status.textContent = `Thanks, ${name}. Your message is valid, but this static demo does not send or store messages.`;
    contactForm.reset();
  });
}
