const GITHUB_USER = "Baraka008";
const REPOSITORIES_API = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;

const projectNotes = {
  "baraka-made-it": {
    description:
      "A hospitality website concept for Liuwa Gardens. It brings accommodation, services, and food together, with an interactive cart that saves its state in the browser.",
    category: "Hospitality website",
  },
  Faith: {
    description:
      "A personal web experiment built with HTML, CSS, and JavaScript. The repository also contains supporting image and audio assets; there is no README yet, so the description stays close to what the files show.",
    category: "Web experiment",
  },
  wildlife: {
    description:
      "WildQuest is a wildlife-learning app for children. It explores Kenyan animals, habitats, and conservation with animal cards, challenges, and a bright safari-inspired interface.",
    category: "Learning app",
  },
  "frontend-chat": {
    description:
      "A local chat application with a Python backend and browser interface, including registration, login, profiles, user search, and account settings.",
    category: "Full-stack application",
  },
  "crisp-co-app": {
    description:
      "A chicken-ordering product with a customer storefront and a seller operations hub, including searchable menus, favourites, and cart controls.",
    category: "Storefront & seller tools",
    demo: "https://crispandco.netlify.app/",
  },
  "Crisp-Co.": {
    description:
      "A public Crisp & Co. project repository. It does not currently include a description or README, so open the source to see its contents.",
    category: "Crisp & Co. project",
  },
  AuroraMusic: {
    description:
      "An Android player for local music. Its README describes a Jetpack Compose interface and a native audio engine with a visualizer and listening effects.",
    category: "Android music player",
  },
  "clarion-news": {
    description:
      "A modern news platform built with Next.js, Firebase, Tailwind CSS, and Gemini AI, with authentication, publishing, and moderation features.",
    category: "News platform",
  },
  "my-new-webpage": {
    description:
      "An early HTML webpage experiment with a little JavaScript, including pagination added during a follow-up contribution.",
    category: "HTML & JavaScript experiment",
  },
};

const fallbackRepositories = [
  ["baraka-made-it", "HTML", "Liuwa Hotel website is an innovation still growing"],
  ["Faith", "CSS", ""],
  ["wildlife", "TypeScript", ""],
  ["frontend-chat", "Python", ""],
  ["crisp-co-app", "HTML", ""],
  ["Crisp-Co.", "", ""],
  ["AuroraMusic", "Kotlin", "Music Player for local music"],
  ["clarion-news", "TypeScript", ""],
  ["my-new-webpage", "HTML", "Mainly html with a few JS after a pull request from my brother, pagination."],
].map(([name, language, description]) => ({
  name,
  language,
  description,
  html_url: `https://github.com/${GITHUB_USER}/${encodeURIComponent(name)}`,
  portfolioDescription:
    projectNotes[name]?.description ?? "A public project from Baraka’s GitHub portfolio.",
  category: projectNotes[name]?.category ?? "Project",
  homepage: projectNotes[name]?.demo ?? "",
  stargazers_count: 0,
  forks_count: 0,
  updated_at: "",
}));

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const repoGrid = document.querySelector("#repoGrid");
const repoStatus = document.querySelector("#repoStatus");
const searchInput = document.querySelector("#repoSearch");
const languageFilter = document.querySelector("#languageFilter");
const sortOrder = document.querySelector("#sortOrder");
const dialog = document.querySelector("#repoDialog");
const dialogClose = document.querySelector("#dialogClose");

let repositories = fallbackRepositories;

document.body.classList.add("has-js");

const introScreen = document.querySelector("#introScreen");
const introProgress = document.querySelector("#introProgress");
const introProgressLabel = document.querySelector("#introProgressLabel");
const introNumber = document.querySelector("#introNumber");
const introProgressBar = document.querySelector(".intro-progress");
const introSkip = document.querySelector("#introSkip");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let introFrame = 0;
let introFinished = false;

function finishIntro() {
  if (introFinished) return;
  introFinished = true;
  if (introFrame) window.cancelAnimationFrame(introFrame);
  introProgress.style.transform = "scaleX(1)";
  introProgressBar.setAttribute("aria-valuenow", "100");
  introNumber.textContent = "100";
  introProgressLabel.textContent = "WELCOME TO MY WORK";
  introScreen.classList.add("is-leaving");
  window.setTimeout(() => {
    introScreen.hidden = true;
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-finished");
  }, 1050);
}

const introAlreadyShown = sessionStorage.getItem("baraka-portfolio-intro") === "shown";
if (introAlreadyShown || reduceMotion.matches) {
  introScreen.hidden = true;
} else {
  document.body.classList.add("intro-active");
  sessionStorage.setItem("baraka-portfolio-intro", "shown");
  introSkip.addEventListener("click", finishIntro, { once: true });

  const introStartedAt = performance.now();
  const introDuration = 1900;
  const updateIntro = (now) => {
    if (introFinished) return;
    const linearProgress = Math.min((now - introStartedAt) / introDuration, 1);
    const easedProgress = 1 - (1 - linearProgress) ** 3;
    const percentage = Math.round(easedProgress * 100);
    introProgress.style.transform = `scaleX(${easedProgress})`;
    introProgressBar.setAttribute("aria-valuenow", String(percentage));
    introNumber.textContent = String(percentage).padStart(2, "0");

    if (linearProgress < 1) {
      introFrame = window.requestAnimationFrame(updateIntro);
      return;
    }
    introProgressLabel.textContent = "WELCOME TO MY WORK";
    window.setTimeout(finishIntro, 280);
  };
  introFrame = window.requestAnimationFrame(updateIntro);
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navLinks.classList.remove("is-open");
    }
  });
}

let revealObserver;

if (!reduceMotion.matches && "IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
  );
}

function observeReveals(scope = document) {
  if (!revealObserver) return;
  scope.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => revealObserver.observe(element));
}

document
  .querySelectorAll(
    ".hero-copy, .hero-art, .section-heading, .feature-card, .statement-copy, .statement-index, .statement-orbit, .about-label, .about-copy, .contact-section > *",
  )
  .forEach((element, index) => {
    if (!revealObserver) return;
    element.classList.add("reveal");
    if (element.classList.contains("feature-card")) {
      element.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    }
  });
observeReveals();

const progressBar = document.querySelector("#scrollProgress");
const pointerGlow = document.querySelector(".pointer-glow");
const cursorRippleLayer = document.querySelector(".cursor-ripple-layer");
const featuredStage = document.querySelector("#featuredStage");
const featuredCurrent = document.querySelector("#featuredCurrent");
const featuredProgress = document.querySelector("#featuredProgress");
const featuredCards = featuredStage ? [...featuredStage.querySelectorAll(".feature-card")] : [];
let progressFrame = 0;

function updateFeaturedShowcase() {
  if (!featuredStage || featuredCards.length === 0) return;

  const stageBounds = featuredStage.getBoundingClientRect();
  const pin = featuredStage.querySelector(".featured-stage-pin");
  const travel = Math.max(1, featuredStage.offsetHeight - pin.offsetHeight);
  const stickyTop = Number.parseFloat(window.getComputedStyle(pin).top) || 0;
  const progress = Math.max(0, Math.min(1, (stickyTop - stageBounds.top) / travel));
  const scenePosition = progress * featuredCards.length;
  const activeIndex = Math.min(featuredCards.length - 1, Math.floor(scenePosition));

  featuredCards.forEach((card, index) => {
    const isActive = index === activeIndex;
    card.classList.toggle("is-active", isActive);
    card.inert = !isActive;
    card.setAttribute("aria-hidden", String(!isActive));
    card.style.setProperty("--scene-progress", String(Math.max(0, Math.min(1, scenePosition - index))));
  });

  featuredCurrent.textContent = String(activeIndex + 1).padStart(2, "0");
  featuredProgress.style.transform = `scaleX(${progress})`;
}

window.addEventListener(
  "scroll",
  () => {
    updateFeaturedShowcase();
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      progressBar.style.transform = `scaleX(${progress})`;
      progressFrame = 0;
    });
  },
  { passive: true },
);
updateFeaturedShowcase();
window.addEventListener("resize", updateFeaturedShowcase, { passive: true });

const heroArt = document.querySelector(".hero-art");
const finePointer = window.matchMedia("(pointer: fine)").matches;
if (!reduceMotion.matches && cursorRippleLayer) {
  let lastRippleAt = 0;

  function createCursorRipple(x, y, immediate = false) {
    const now = performance.now();
    if (reduceMotion.matches || (!immediate && now - lastRippleAt < 90)) return;

    const ripple = document.createElement("span");
    ripple.className = "cursor-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    cursorRippleLayer.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    lastRippleAt = now;
  }

  if (finePointer) {
    let pointerFrame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    document.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || reduceMotion.matches) return;

      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        pointerGlow?.style.setProperty("--pointer-x", `${pointerX}px`);
        pointerGlow?.style.setProperty("--pointer-y", `${pointerY}px`);
        createCursorRipple(pointerX, pointerY);
        pointerFrame = 0;
      });
    }, { passive: true });
  }

  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") createCursorRipple(event.clientX, event.clientY, true);
  }, { passive: true });

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" && event.buttons > 0) {
      createCursorRipple(event.clientX, event.clientY);
    }
  }, { passive: true });
}

reduceMotion.addEventListener("change", (event) => {
  if (event.matches) cursorRippleLayer?.replaceChildren();
});

if (heroArt && !reduceMotion.matches && finePointer) {
  heroArt.addEventListener("pointermove", (event) => {
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroArt.style.setProperty("--pointer-x", String(x));
    heroArt.style.setProperty("--pointer-y", String(y));
  });
  heroArt.addEventListener("pointerleave", () => {
    heroArt.style.setProperty("--pointer-x", "0");
    heroArt.style.setProperty("--pointer-y", "0");
  });
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return Number.isNaN(date.getTime())
    ? ""
    : `Updated ${new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(date)}`;
}

function renderRepositories() {
  const query = searchInput.value.trim().toLowerCase();
  const language = languageFilter.value;
  const sort = sortOrder.value;
  const filtered = repositories.filter((repo) => {
    const searchable = `${repo.name} ${repo.language ?? ""} ${repo.description ?? ""} ${repo.portfolioDescription ?? ""}`.toLowerCase();
    return searchable.includes(query) && (language === "all" || (repo.language || "Other") === language);
  });

  if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "stars") {
    filtered.sort((a, b) => b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name));
  } else {
    filtered.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
  }

  repoGrid.replaceChildren();
  repoStatus.textContent = `Showing ${filtered.length} of ${repositories.length} public repositories`;

  if (filtered.length === 0) {
    repoGrid.append(makeElement("p", "empty-state", "No projects match that search. Try another name or language."));
    return;
  }

  for (const repo of filtered) {
    const card = makeElement("article", "repo-card");
    card.style.setProperty("--reveal-delay", `${Math.min(repoGrid.children.length, 5) * 55}ms`);
    const cardTop = makeElement("div", "repo-card-top");
    const icon = makeElement("span", "repo-icon", repo.name.slice(0, 1).toUpperCase());
    icon.setAttribute("aria-hidden", "true");
    const languageBadge = makeElement("span", "language-badge", repo.language || "Other");
    cardTop.append(icon, languageBadge);

    const title = makeElement("h3", "repo-name", repo.name);
    const description = makeElement("p", "repo-description", repo.portfolioDescription);
    const category = makeElement("p", "repo-category", repo.category);
    const meta = makeElement("div", "repo-meta");
    if (repo.stargazers_count > 0) meta.append(makeElement("span", "", `★ ${repo.stargazers_count}`));
    if (repo.forks_count > 0) meta.append(makeElement("span", "", `⑂ ${repo.forks_count}`));
    const updated = formatDate(repo.updated_at);
    if (updated) meta.append(makeElement("span", "", updated));
    const actions = makeElement("div", "repo-actions");
    const detailsButton = makeElement("button", "details-button", "Read project details");
    detailsButton.type = "button";
    detailsButton.addEventListener("click", () => openProject(repo));
    const githubLink = makeElement("a", "repo-link", "GitHub ↗");
    githubLink.href = repo.html_url;
    githubLink.target = "_blank";
    githubLink.rel = "noreferrer";
    actions.append(detailsButton, githubLink);

    card.append(cardTop, title, description, category, meta, actions);
    card.classList.add("reveal");
    repoGrid.append(card);
  }
  observeReveals(repoGrid);
}

const touchFeedbackSelector = "a, button, .repo-card, .contact-option, .feature-card";
const touchFeedbackTimers = new WeakMap();
const activeTouchFeedback = new Map();

function releaseTouchFeedback(target) {
  const timer = touchFeedbackTimers.get(target);
  if (timer) window.clearTimeout(timer);
  target.classList.remove("touch-pressed");
  touchFeedbackTimers.delete(target);
}

document.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "touch" || reduceMotion.matches) return;

  const target = event.target instanceof Element ? event.target.closest(touchFeedbackSelector) : null;
  if (!target) return;

  releaseTouchFeedback(target);
  target.classList.add("touch-pressed");
  touchFeedbackTimers.set(target, window.setTimeout(() => releaseTouchFeedback(target), 700));
  activeTouchFeedback.set(event.pointerId, target);
});

for (const eventName of ["pointerup", "pointercancel"]) {
  document.addEventListener(eventName, (event) => {
    if (event.pointerType !== "touch") return;

    const target = activeTouchFeedback.get(event.pointerId);
    activeTouchFeedback.delete(event.pointerId);
    if (target) releaseTouchFeedback(target);
  });
}

function populateLanguages() {
  const currentLanguage = languageFilter.value;
  const languages = [...new Set(repositories.map((repo) => repo.language || "Other"))].sort((a, b) => a.localeCompare(b));
  languageFilter.replaceChildren(new Option("All languages", "all"));
  for (const language of languages) languageFilter.add(new Option(language, language));
  languageFilter.value = languages.includes(currentLanguage) ? currentLanguage : "all";
}

function appendFact(parent, label, value) {
  const fact = makeElement("div", "dialog-fact");
  fact.append(makeElement("span", "fact-label", label), makeElement("strong", "fact-value", value));
  parent.append(fact);
}

async function loadReadme(repo) {
  const status = document.querySelector("#readmeStatus");
  const content = document.querySelector("#readmeContent");
  status.hidden = false;
  content.hidden = true;
  content.textContent = "";
  status.textContent = "Loading the public README…";

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${encodeURIComponent(repo.name)}/readme`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (response.status === 404) {
      status.textContent = "This repository does not have a public README yet. The project summary above is based on its public repository details.";
      return;
    }
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const readme = await response.json();
    if (readme.encoding !== "base64" || typeof readme.content !== "string") {
      throw new Error("GitHub returned an unsupported README format");
    }
    const bytes = Uint8Array.from(atob(readme.content.replace(/\s/g, "")), (character) => character.charCodeAt(0));
    content.textContent = new TextDecoder().decode(bytes);
    content.hidden = false;
    status.hidden = true;
  } catch (error) {
    status.textContent = `Could not load the README: ${error.message}. You can still open the repository on GitHub.`;
  }
}

function openProject(repo) {
  const notes = projectNotes[repo.name];
  document.querySelector("#dialogTitle").textContent = repo.name;
  document.querySelector("#dialogDescription").textContent = repo.portfolioDescription;
  const facts = document.querySelector("#dialogFacts");
  const actions = document.querySelector("#dialogActions");
  facts.replaceChildren();
  actions.replaceChildren();
  appendFact(facts, "TYPE", repo.category || notes?.category || "GitHub project");
  appendFact(facts, "LANGUAGE", repo.language || "Not specified");
  if (repo.stargazers_count !== undefined) appendFact(facts, "STARS", String(repo.stargazers_count));
  if (repo.forks_count !== undefined) appendFact(facts, "FORKS", String(repo.forks_count));

  const sourceLink = makeElement("a", "button button-bright", "View source code ↗");
  sourceLink.href = repo.html_url;
  sourceLink.target = "_blank";
  sourceLink.rel = "noreferrer";
  actions.append(sourceLink);
  if (repo.homepage) {
    const demoLink = makeElement("a", "button button-outline", "Open live project ↗");
    demoLink.href = repo.homepage;
    demoLink.target = "_blank";
    demoLink.rel = "noreferrer";
    actions.append(demoLink);
  }

  dialog.showModal();
  void loadReadme(repo);
}

searchInput.addEventListener("input", renderRepositories);
languageFilter.addEventListener("change", renderRepositories);
sortOrder.addEventListener("change", renderRepositories);
dialogClose.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector("#year").textContent = String(new Date().getFullYear());

populateLanguages();
renderRepositories();

async function syncRepositories() {
  try {
    const response = await fetch(REPOSITORIES_API, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const data = await response.json();
    repositories = data.map((repo) => ({
      ...repo,
      portfolioDescription:
        projectNotes[repo.name]?.description ||
        repo.description ||
        "This public repository does not have a project description yet. Open the project details to inspect its README and source code.",
      category: projectNotes[repo.name]?.category || repo.language || "Project",
      homepage: repo.homepage || projectNotes[repo.name]?.demo || "",
    }));
    populateLanguages();
    renderRepositories();
  } catch (error) {
    repoStatus.textContent = `Showing the saved list of public projects. GitHub could not be reached right now: ${error.message}.`;
  }
}

void syncRepositories();
