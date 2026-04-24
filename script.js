const body = document.body;
const boot = document.querySelector("[data-boot]");
const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const cursorLight = document.querySelector("[data-cursor-light]");
const rotator = document.querySelector("[data-rotator]");
const marquee = document.querySelector(".marquee-track");
const modeButtons = document.querySelectorAll("[data-mode]");
const consoleOutput = document.querySelector("[data-console-output]");
const revealItems = document.querySelectorAll(".reveal");
const magneticItems = document.querySelectorAll(".magnetic");
const tiltItems = document.querySelectorAll("[data-tilt]");
const skillButtons = document.querySelectorAll("[data-skill-filter]");
const skillItems = document.querySelectorAll("[data-skill]");
const countItems = document.querySelectorAll("[data-count]");
const reactorStage = document.querySelector("[data-reactor-stage]");
const reactorNodes = document.querySelectorAll("[data-reactor-node]");
const reactorTitle = document.querySelector("[data-reactor-title]");
const reactorCopy = document.querySelector("[data-reactor-copy]");
const reactorMeter = document.querySelector("[data-reactor-meter]");
const canvas = document.querySelector("#signalCanvas");
const ctx = canvas.getContext("2d");

const rotatorWords = ["auditable.", "traceable.", "defensible.", "useful."];
const consoleModes = {
  governance: {
    label: "governance.mode",
    title: "High-risk ML lineage and GenAI workflows",
    body: "Document source paths, model context, inventory gaps, and validation evidence for regulated review."
  },
  visuals: {
    label: "visuals.mode",
    title: "Dashboards that explain decisions",
    body: "Shape Tableau, Power BI, and analytical narratives around what changed, why it matters, and what comes next."
  },
  automation: {
    label: "automation.mode",
    title: "Reconciliation loops that keep moving",
    body: "Reduce recurring manual review work with repeatable source comparisons, exception flags, and workflow handoffs."
  },
  ai: {
    label: "ai.mode",
    title: "LLM tools with evaluation context",
    body: "Prototype prompt workflows, compare model behavior, and keep evidence close to experimentation."
  }
};
const reactorScores = {
  "Lineage Pulse": "91%",
  "Model Chamber": "88%",
  "Visual Relay": "94%",
  "Flow Loop": "86%"
};

let pointer = { x: 0, y: 0, active: false };
let particles = [];
let rotatorIndex = 0;

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

const setCanvasSize = () => {
  const scale = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 16)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    size: Math.random() * 2 + 0.8,
    hue: Math.random() > 0.5 ? "cyan" : "pink"
  }));
};

const drawSignalField = () => {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "rgba(5, 5, 8, 0.25)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (pointer.active) {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 180) {
        particle.x += dx / distance;
        particle.y += dy / distance;
      }
    }

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    ctx.beginPath();
    ctx.fillStyle = particle.hue === "cyan" ? "#00e5ff" : "#ff3df2";
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 120) {
        ctx.strokeStyle = `rgba(216, 255, 62, ${1 - distance / 120})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawSignalField);
};

const countUp = (item) => {
  const target = Number(item.dataset.count);
  const hasDecimal = item.dataset.count.includes(".");
  const duration = 900;
  const start = performance.now();

  const tick = (now) => {
    const progressValue = Math.min((now - start) / duration, 1);
    const value = target * progressValue;
    item.textContent = hasDecimal ? value.toFixed(2) : Math.round(value);
    if (progressValue < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const createReactorBurst = (sparkCount = 18) => {
  if (!reactorStage) return;

  for (let index = 0; index < sparkCount; index += 1) {
    const spark = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 180;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    spark.className = "reactor-spark";
    spark.style.setProperty("--spark-x", `${x}px`);
    spark.style.setProperty("--spark-y", `${y}px`);
    spark.style.setProperty("--spark-color", Math.random() > 0.5 ? "#00e5ff" : "#ff3df2");
    reactorStage.appendChild(spark);

    window.setTimeout(() => spark.remove(), 760);
  }
};

body.classList.add("is-booting");
syncChrome();
setCanvasSize();
drawSignalField();

window.addEventListener("load", () => {
  setTimeout(() => {
    boot.classList.add("is-hidden");
    body.classList.remove("is-booting");
  }, 420);
});

window.addEventListener("resize", setCanvasSize);
window.addEventListener("scroll", syncChrome, { passive: true });

window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY, active: true };
  cursorLight.style.setProperty("--mx", `${event.clientX}px`);
  cursorLight.style.setProperty("--my", `${event.clientY}px`);
});

window.addEventListener("pointerleave", () => {
  pointer.active = false;
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

setInterval(() => {
  rotatorIndex = (rotatorIndex + 1) % rotatorWords.length;
  rotator.animate([{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(18px)" }], {
    duration: 180,
    easing: "ease"
  }).onfinish = () => {
    rotator.textContent = rotatorWords[rotatorIndex];
    rotator.animate([{ opacity: 0, transform: "translateY(-18px)" }, { opacity: 1, transform: "translateY(0)" }], {
      duration: 220,
      easing: "ease"
    });
  };
}, 1800);

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = consoleModes[button.dataset.mode];
    modeButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    consoleOutput.innerHTML = `<span>${mode.label}</span><strong>${mode.title}</strong><p>${mode.body}</p>`;
  });
});

reactorNodes.forEach((button) => {
  button.addEventListener("click", () => {
    reactorNodes.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    reactorTitle.textContent = button.dataset.title;
    reactorCopy.textContent = button.dataset.copy;
    reactorMeter.textContent = reactorScores[button.dataset.title] || "89%";
    createReactorBurst(24);
  });
});

window.setInterval(() => {
  if (document.visibilityState === "visible") createReactorBurst(8);
}, 3400);

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

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

countItems.forEach((item) => counterObserver.observe(item));

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

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.skillFilter;
    skillButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    skillItems.forEach((item) => {
      item.classList.toggle("is-dim", filter !== "all" && !item.dataset.skill.includes(filter));
    });
  });
});
