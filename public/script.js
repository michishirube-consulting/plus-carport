const stickyCta = document.querySelector(".sticky-cta");
const heroAction = document.querySelector(".hero-action-card");
const consultSection = document.querySelector("#line-consult");
const finalCtaSection = document.querySelector(".final-cta");
const contactLink = document.querySelector("#line-contact");
const contactStatus = document.querySelector("#contact-status");

// Funnel steps, not confirmed inquiries. No free text or location is recorded.
function trackStep(event, position, plan) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, cta_position: position || "unknown", carport_plan: plan || "undecided" });
}

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

document.querySelectorAll("[data-simulator-entry]").forEach((link) => {
  link.addEventListener("click", () => {
    trackStep("price_simulator_click", link.dataset.position);
  });
});

// Every LINE button opens the LIFF consultation directly. data-plan tells the
// consultation form which card the visitor came from (for example plan=two-car),
// so the visitor does not have to choose the same thing again.
function configureLineContact() {
  let lineUrl;
  try {
    const config = JSON.parse(document.querySelector("#contact-config").textContent);
    lineUrl = new URL(config.lineUrl);
    if (lineUrl.protocol !== "https:" || !["lin.ee", "line.me", "liff.line.me"].includes(lineUrl.hostname) || lineUrl.pathname === "/") return;
  } catch {
    return;
  }
  const hrefFor = (plan) => {
    const url = new URL(lineUrl.href);
    if (plan && /^[a-z-]{2,24}$/.test(plan)) url.searchParams.set("plan", plan);
    return url.href;
  };
  if (contactLink) {
    contactLink.href = hrefFor("");
    contactLink.removeAttribute("aria-disabled");
    contactLink.addEventListener("click", () => trackStep("line_outbound_click", contactLink.dataset.position));
  }
  if (contactStatus) contactStatus.hidden = true;
  document.querySelectorAll("[data-line-direct]").forEach((link) => {
    const plan = link.dataset.plan || "";
    link.href = hrefFor(plan);
    link.addEventListener("click", () => trackStep("line_outbound_click", link.dataset.position, plan));
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
    track.scrollTo({ left: slidePosition(slides[index]), behavior: track.id === "line-journey" || matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    refresh();
    if (track.id !== "line-journey") window.setTimeout(refresh, 350);
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
