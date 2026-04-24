const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const tickerTrack = document.querySelector(".ticker-track");
const projectToggle = document.querySelector("[data-project-toggle]");

const syncChrome = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  header.classList.toggle("is-scrolled", scrollTop > 24);
  progress.style.width = `${pct}%`;
};

const closeNav = () => {
  document.body.classList.remove("nav-open");
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

syncChrome();

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

if (tickerTrack) {
  tickerTrack.innerHTML += tickerTrack.innerHTML;
}

if (projectToggle) {
  projectToggle.addEventListener("click", () => {
    const card = projectToggle.closest(".project-card");
    const isOpen = card.classList.toggle("is-open");
    projectToggle.textContent = isOpen ? "Hide impact" : "View impact";
  });
}
