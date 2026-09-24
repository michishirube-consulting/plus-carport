const stickyCta = document.querySelector(".sticky-cta");
const heroAction = document.querySelector(".hero-action-card");
const consultSection = document.querySelector("#line-consult");
const finalCtaSection = document.querySelector(".final-cta");
const contactLink = document.querySelector("#line-contact");
const contactStatus = document.querySelector("#contact-status");
const message = document.querySelector("#consult-message");
const copyButton = document.querySelector("#copy-message");
const copyStatus = document.querySelector("#copy-status");
const countSelect = document.querySelector("#car-count");
const stageSelect = document.querySelector("#project-stage");
const prioritySelect = document.querySelector("#priority");
const contextLabel = document.querySelector("#consult-context");
let selectedPlan = "undecided";
let entryPosition = "direct";
let selectedCustomStyle = "";

// Funnel steps, not confirmed inquiries. No free text or location is recorded.
function trackStep(event, position) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, cta_position: position, carport_plan: selectedPlan,
    project_stage: stageSelect.value, consultation_priority: prioritySelect.value, custom_style: selectedCustomStyle });
}

function updatePlan() {
  if (!window.CarportPlanner) return;
  const plan = window.CarportPlanner.createPlan({count: countSelect.value, stage: stageSelect.value, priority: prioritySelect.value, customStyle: selectedCustomStyle});
  selectedPlan = plan.selection.count;
  selectedCustomStyle = plan.customStyle;
  message.textContent = plan.message;
  copyStatus.textContent = "";
  contextLabel.textContent = plan.context;
  contextLabel.hidden = !plan.context;
  document.querySelector("#plan-result-title").textContent = plan.title;
  const points = document.querySelector("#plan-points");
  points.replaceChildren(...plan.points.map((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    return li;
  }));
}

if (window.CarportPlanner) {
  updatePlan();
  document.querySelector("#builder-fields").hidden = false;
  [countSelect, stageSelect, prioritySelect].forEach(select => select.addEventListener("change", () => {
    updatePlan();
    trackStep("consult_options_change", "optional-planner");
  }));
}

document.querySelectorAll("[data-intent-link]").forEach(link => link.addEventListener("click", () => {
  if (link.dataset.plan) countSelect.value = link.dataset.plan;
  if (link.dataset.priority) prioritySelect.value = link.dataset.priority;
  updatePlan();
  trackStep("content_jump", "hero-shortcut");
}));

function updateStickyCta() {
  if (!stickyCta || !heroAction || !consultSection) return;
  const inView = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };
  const shouldShow = heroAction.getBoundingClientRect().bottom < 0 &&
    !inView(consultSection) && !(finalCtaSection && inView(finalCtaSection));
  stickyCta.classList.toggle("is-visible", shouldShow);
  stickyCta.setAttribute("aria-hidden", String(!shouldShow));
  stickyCta.inert = !shouldShow;
}

document.querySelectorAll("[data-consult-entry]").forEach((link) => {
  link.addEventListener("click", () => {
    entryPosition = link.dataset.position || "unknown";
    if (link.dataset.plan) {
      countSelect.value = link.dataset.plan;
    }
    if (link.dataset.priority) prioritySelect.value = link.dataset.priority;
    if (link.dataset.priority === "custom") selectedCustomStyle = link.dataset.customStyle || "";
    updatePlan();
    trackStep("consult_section_open", entryPosition);
  });
});

document.querySelectorAll("[data-simulator-entry]").forEach((link) => {
  link.addEventListener("click", () => {
    trackStep("price_simulator_click", link.dataset.position || "unknown");
  });
});

if (copyButton && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(message.innerText.trim());
      copyStatus.textContent = "コピーしました。LINEに貼り付けて、分かれば市区町村・車種を添えてください。";
      trackStep("consult_message_copy", entryPosition);
    } catch {
      copyStatus.textContent = "コピーできませんでした。上の文章を選択してコピーしてください。";
    }
  });
}

function configureLineContact() {
  let lineUrl;
  try {
    const config = JSON.parse(document.querySelector("#contact-config").textContent);
    lineUrl = new URL(config.lineUrl);
    if (lineUrl.protocol !== "https:" || !["lin.ee", "line.me", "liff.line.me"].includes(lineUrl.hostname) || lineUrl.pathname === "/") return;
  } catch {
    return;
  }
  contactLink.href = lineUrl.href;
  contactLink.removeAttribute("aria-disabled");
  contactStatus.hidden = true;
  contactLink.addEventListener("click", () => trackStep("line_outbound_click", entryPosition));
  document.querySelectorAll("[data-line-direct]").forEach((link) => {
    link.href = lineUrl.href;
    link.addEventListener("click", () => trackStep("line_outbound_click", link.dataset.position || "unknown"));
  });
}

configureLineContact();
document.querySelectorAll("[data-controls-for]").forEach((controls) => {
  const track = document.getElementById(controls.dataset.controlsFor);
  if (!track) return;
  const slides = [...track.children];
  const previous = controls.querySelector("[data-carousel-prev]");
  const next = controls.querySelector("[data-carousel-next]");
  const output = controls.querySelector("output");
  const slidePosition = (slide) => slide.offsetLeft - slides[0].offsetLeft;
  const currentIndex = () => slides.reduce((best, slide, index) =>
    Math.abs(slidePosition(slide) - track.scrollLeft) < Math.abs(slidePosition(slides[best]) - track.scrollLeft) ? index : best, 0);
  const refresh = () => {
    const index = currentIndex();
    output.textContent = `${index + 1} / ${slides.length}`;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  };
  const goTo = (index) => {
    track.scrollTo({ left: slidePosition(slides[index]), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    window.setTimeout(refresh, 350);
  };
  previous.addEventListener("click", () => goTo(Math.max(0, currentIndex() - 1)));
  next.addEventListener("click", () => goTo(Math.min(slides.length - 1, currentIndex() + 1)));
  track.addEventListener("scroll", refresh, { passive: true });
  track.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    goTo(Math.max(0, Math.min(slides.length - 1, currentIndex() + (event.key === "ArrowRight" ? 1 : -1))));
  });
  window.addEventListener("resize", refresh);
  refresh();
});
const mobileMenu = document.querySelector(".mobile-menu");
mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => { mobileMenu.open = false; });
});
window.addEventListener("scroll", updateStickyCta, { passive: true });
window.addEventListener("resize", updateStickyCta);
window.addEventListener("load", updateStickyCta);
updateStickyCta();
