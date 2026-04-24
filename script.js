const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const signalTrack = document.querySelector(".signal-track");
const labInputs = document.querySelectorAll("[data-lab-input]");
const labOutput = document.querySelector("[data-lab-output]");
const accordions = document.querySelectorAll("[data-accordion]");

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
  document.body.classList.remove("nav-open");
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

syncChrome();
updateLab();

window.addEventListener("scroll", syncChrome, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
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

accordions.forEach((button) => {
  button.addEventListener("click", () => {
    const row = button.closest(".project-row");
    const isOpen = row.classList.contains("is-open");

    document.querySelectorAll(".project-row").forEach((item) => item.classList.remove("is-open"));

    if (!isOpen) {
      row.classList.add("is-open");
    }
  });
});
