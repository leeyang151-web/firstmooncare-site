// Fill these in once the Google Forms and contact address exist.
const CONFIG = {
  surveyUrl: "",
  waitlistUrl: "",
  email: ""
};

(function () {
  const site = document.getElementById("site");

  function setLang(lang) {
    site.dataset.lang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en-GB";
    document.querySelectorAll(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.set === lang)));
    try { localStorage.setItem("fm-lang", lang); } catch (e) {}
  }
  document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.set)));
  let saved = null;
  try { saved = localStorage.getItem("fm-lang"); } catch (e) {}
  setLang(saved || (/^zh/i.test(navigator.language || "") ? "zh" : "en"));

  // Point the buttons at the forms; until a link exists, buttons inside the cards show "Link coming soon".
  function wire(selector, url) {
    document.querySelectorAll(selector).forEach(a => {
      if (url) {
        a.href = url; a.target = "_blank"; a.rel = "noopener";
      } else if (a.closest(".join-card")) {
        a.setAttribute("aria-disabled", "true");
        a.insertAdjacentHTML("afterend", '<span class="soon"><span class="en">Link coming soon</span><span class="zh">即將開放</span></span>');
      }
    });
  }
  wire(".js-survey", CONFIG.surveyUrl);
  wire(".js-waitlist", CONFIG.waitlistUrl);
  if (CONFIG.email) document.querySelectorAll(".js-email").forEach(e => { e.textContent = CONFIG.email; });

  // Nav gains a hairline once the page scrolls.
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Hero video: show it only once it can play, so the emblem stays if it fails.
  document.querySelectorAll(".arch video").forEach(v => {
    const show = () => v.closest(".arch").classList.add("has-video");
    if (v.readyState >= 2) show(); else v.addEventListener("loadeddata", show, { once: true });
  });

  // Scroll reveals. Only content that starts below the fold is hidden, so the first screen never waits on script.
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  const fold = window.innerHeight * 0.92;
  const below = el => el.getBoundingClientRect().top > fold;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("revealed");
      io.unobserve(el);
      // Once settled, drop the reveal classes so hover transitions run without the stagger delay.
      if (el.classList.contains("will-reveal")) {
        const done = ev => {
          if (ev.target !== el || ev.propertyName !== "opacity") return;
          el.removeEventListener("transitionend", done);
          el.classList.remove("will-reveal", "revealed");
          el.style.removeProperty("--d");
        };
        el.addEventListener("transitionend", done);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  const staggered = [".principle", ".service", ".journey li", ".join-card"];
  document.querySelectorAll(".section-head, .approach-copy, .care-note, .welcome .display, .footer-top, " + staggered.join(", ")).forEach(el => {
    if (!below(el)) return;
    if (staggered.some(sel => el.matches(sel))) {
      const i = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty("--d", (i * 0.12) + "s");
    }
    el.classList.add("will-reveal");
    io.observe(el);
  });
  document.querySelectorAll(".phases").forEach(el => { if (below(el)) { el.classList.add("will-wax"); io.observe(el); } });
  document.querySelectorAll(".journey").forEach(el => { if (below(el)) { el.classList.add("will-draw"); io.observe(el); } });
})();
