const body = document.body;
const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const signalTrack = document.querySelector(".proof-track");
const labInputs = document.querySelectorAll("[data-lab-input]");
const labOutput = document.querySelector("[data-lab-output]");
const engineNodes = document.querySelectorAll("[data-engine-node]");
const engineOutput = document.querySelector("[data-engine-output]");
const spotlight = document.querySelector("[data-spotlight]");
const loader = document.querySelector("[data-loader]");
const magneticItems = document.querySelectorAll(".magnetic");

const briefs = [
  {
    test: ({ governance }) => governance >= 72,
    title: "AI Governance Dashboard Sprint",
    detail: "Lineage, validation evidence, risk indicators, and stakeholder-ready reporting."
  },
  {
    test: ({ visualization }) => visualization >= 72,
    title: "Executive Analytics Storyboard",
    detail: "Visual analytics, dashboard structure, metric definitions, and decision-focused narration."
  },
  {
    test: ({ automation }) => automation >= 72,
    title: "Reconciliation Automation Build",
    detail: "Inventory checks, source comparisons, exception routing, and repeatable review workflows."
  },
  {
    test: () => true,
    title: "Decision Systems Audit",
    detail: "A focused pass across data quality, model context, reporting gaps, and business handoff risks."
  }
];

const syncChrome = () => {
  const top = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (top / max) * 100 : 0;

  header.classList.toggle("is-scrolled", top > 24);
  progress.style.width = `${percent}%`;
};

const closeNav = () => {
  body.classList.remove("nav-open");
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const updateLab = () => {
  const values = {
    governance: Number(document.querySelector("#governance").value),
    visualization: Number(document.querySelector("#visualization").value),
    automation: Number(document.querySelector("#automation").value)
  };
  const match = briefs.find((brief) => brief.test(values));

  labOutput.innerHTML = `<span>${match.title}</span><small>${match.detail}</small>`;
};

body.classList.add("is-loading");
syncChrome();
updateLab();

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    body.classList.remove("is-loading");
  }, 500);
});

window.addEventListener("scroll", syncChrome, { passive: true });

window.addEventListener("pointermove", (event) => {
  const x = `${event.clientX}px`;
  const y = `${event.clientY}px`;

  spotlight.style.setProperty("--mx", x);
  spotlight.style.setProperty("--my", y);
});

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeNav();
  }
});

if (signalTrack) {
  signalTrack.innerHTML += signalTrack.innerHTML;
}

labInputs.forEach((input) => input.addEventListener("input", updateLab));

engineNodes.forEach((node) => {
  node.addEventListener("click", () => {
    engineNodes.forEach((item) => item.classList.remove("is-active"));
    node.classList.add("is-active");
    engineOutput.textContent = node.dataset.detail;
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
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    item.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});
