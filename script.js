const body = document.body;
const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const loader = document.querySelector("[data-loader]");
const spotlight = document.querySelector("[data-spotlight]");
const marquee = document.querySelector(".marquee-track");
const labInputs = document.querySelectorAll("[data-lab-input]");
const labOutput = document.querySelector("[data-lab-output]");
const engineNodes = document.querySelectorAll("[data-engine-node]");
const engineOutput = document.querySelector("[data-engine-output]");
const magneticItems = document.querySelectorAll(".magnetic");
const privacy = document.querySelector("[data-privacy]");
const settings = document.querySelector("[data-settings]");
const carouselCards = document.querySelectorAll(".quote-card");

const briefs = [
  { test: ({ governance }) => governance >= 72, title: "AI Governance Dashboard Sprint", detail: "Lineage, validation evidence, risk indicators, and stakeholder-ready reporting." },
  { test: ({ visualization }) => visualization >= 72, title: "Executive Analytics Storyboard", detail: "Dashboard structure, metric definitions, visual analytics, and decision-focused narration." },
  { test: ({ automation }) => automation >= 72, title: "Reconciliation Automation Build", detail: "Inventory checks, source comparisons, exception routing, and repeatable review workflows." },
  { test: () => true, title: "Decision Systems Audit", detail: "A focused pass across data quality, model context, reporting gaps, and business handoff risks." }
];

const syncChrome = () => {
  const top = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("is-scrolled", top > 24);
  progress.style.width = `${max > 0 ? (top / max) * 100 : 0}%`;
};

const closeNav = () => {
  body.classList.remove("nav-open");
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const hidePrivacy = (value) => {
  localStorage.setItem("jb-privacy-choice", value);
  privacy.classList.add("is-hidden");
};

const updateLab = () => {
  const values = {
    governance: Number(document.querySelector("#governance").value),
    visualization: Number(document.querySelector("#visualization").value),
    automation: Number(document.querySelector("#automation").value)
  };
  const match = briefs.find((brief) => brief.test(values));
  labOutput.innerHTML = `<strong>${match.title}</strong><span>${match.detail}</span>`;
};

body.classList.add("is-loading");
syncChrome();
updateLab();

if (localStorage.getItem("jb-privacy-choice")) privacy.classList.add("is-hidden");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("is-hidden");
    body.classList.remove("is-loading");
  }, 450);
});

window.addEventListener("scroll", syncChrome, { passive: true });

window.addEventListener("pointermove", (event) => {
  spotlight.style.setProperty("--mx", `${event.clientX}px`);
  spotlight.style.setProperty("--my", `${event.clientY}px`);
});

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) closeNav();
});

if (marquee) marquee.innerHTML += marquee.innerHTML;

labInputs.forEach((input) => input.addEventListener("input", updateLab));

engineNodes.forEach((node) => {
  node.addEventListener("click", () => {
    engineNodes.forEach((item) => item.classList.remove("is-active"));
    node.classList.add("is-active");
    engineOutput.innerHTML = `<strong>${node.dataset.title}</strong><span>${node.dataset.detail}</span>`;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
  });
  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

let activeQuote = 0;
setInterval(() => {
  carouselCards[activeQuote]?.classList.remove("is-active");
  activeQuote = (activeQuote + 1) % carouselCards.length;
  carouselCards[activeQuote]?.classList.add("is-active");
}, 4300);

document.querySelector("[data-privacy-accept]").addEventListener("click", () => hidePrivacy("accepted"));
document.querySelector("[data-privacy-reject]").addEventListener("click", () => hidePrivacy("rejected"));
document.querySelector("[data-privacy-settings]").addEventListener("click", () => settings.showModal());
document.querySelector("[data-open-privacy]").addEventListener("click", () => settings.showModal());
document.querySelector("[data-settings-save]").addEventListener("click", () => {
  hidePrivacy("custom");
  settings.close();
});
