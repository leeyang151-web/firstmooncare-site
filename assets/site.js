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

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero video: show it only once it can play, so the emblem stays if it fails. Reduced motion keeps the still poster.
  document.querySelectorAll(".arch video").forEach(v => {
    const show = () => v.closest(".arch").classList.add("has-video");
    if (reduce) { v.removeAttribute("autoplay"); v.pause(); }
    if (v.readyState >= 2) show(); else v.addEventListener("loadeddata", show, { once: true });
  });

  // The wider film only loads and plays while it is on screen.
  const films = document.querySelectorAll(".film video");
  if (!reduce && "IntersectionObserver" in window) {
    const filmIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) { v.preload = "auto"; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
        else v.pause();
      });
    }, { threshold: 0.25 });
    films.forEach(v => filmIO.observe(v));
  }

  // Scroll reveals. Only content that starts below the fold is hidden, so the first screen never waits on script.
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
  document.querySelectorAll(".section-head, .approach-copy, .care-note, .footer-top, " + staggered.join(", ")).forEach(el => {
    if (!below(el)) return;
    if (staggered.some(sel => el.matches(sel))) {
      const i = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty("--d", (i * 0.12) + "s");
    }
    el.classList.add("will-reveal");
    io.observe(el);
  });
  document.querySelectorAll(".phases").forEach(el => { if (below(el)) { el.classList.add("will-wax"); io.observe(el); } });

  // Scroll-linked motion. Each frame reads every position first, then writes CSS variables (see the end of site.css).
  const clamp01 = x => Math.min(1, Math.max(0, x));

  // Split the welcome sentence into words (characters for Chinese) so it can light up as you scroll.
  // Screen readers get the sentence whole from a hidden copy.
  document.querySelectorAll(".welcome .display > span").forEach(span => {
    const text = span.textContent;
    const parts = span.classList.contains("zh") ? Array.from(text) : text.split(/(\s+)/);
    const hidden = document.createElement("span");
    hidden.className = "sr-only";
    hidden.textContent = text;
    const words = document.createElement("span");
    words.className = "words";
    words.setAttribute("aria-hidden", "true");
    let n = 0;
    parts.forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { words.appendChild(document.createTextNode(part)); return; }
      const w = document.createElement("span");
      w.className = "w";
      w.style.setProperty("--i", n++);
      w.textContent = part;
      words.appendChild(w);
    });
    words.style.setProperty("--n", n);
    span.replaceChildren(hidden, words);
  });

  // The words band repeats so it never runs out while it slides.
  document.querySelectorAll(".drift-track").forEach(track => {
    const set = Array.from(track.children);
    for (let k = 0; k < 2; k++) set.forEach(node => track.appendChild(node.cloneNode(true)));
  });

  const band = document.querySelector(".hero-band");
  const display = document.querySelector(".welcome .display");
  const film = document.querySelector(".film");
  const drift = document.querySelector(".drift");
  const services = document.querySelector(".services");
  const journey = document.querySelector(".journey");
  const steps = journey ? Array.from(journey.children) : [];
  if (journey) journey.classList.add("will-scrub");

  let queued = false;
  function frame() {
    queued = false;
    const h = window.innerHeight;
    const max = document.documentElement.scrollHeight - h;
    const y = window.scrollY;
    const bandRect = band && band.getBoundingClientRect();
    const displayTop = display && display.getBoundingClientRect().top;
    const filmTop = film && film.getBoundingClientRect().top;
    const driftTop = drift && drift.getBoundingClientRect().top;
    const sv = services && services.getBoundingClientRect();
    const jr = journey && journey.getBoundingClientRect();
    // Layout offsets, so the reveal and moon transforms don't skew the positions.
    const pos = steps.map(li => [li.offsetLeft, li.offsetTop]);

    if (nav) nav.style.setProperty("--read", clamp01(max > 0 ? y / max : 0).toFixed(4));
    if (band && bandRect.bottom > 0) band.style.setProperty("--hs", Math.max(0, -bandRect.top).toFixed(1));
    if (display) display.style.setProperty("--p", clamp01((h * 0.9 - displayTop) / (h * 0.5)).toFixed(3));
    if (film) film.style.setProperty("--fp", clamp01((h - filmTop) / (h * 0.7)).toFixed(3));
    if (drift) drift.style.setProperty("--dx", Math.max(0, h - driftTop).toFixed(1));
    if (services) services.style.setProperty("--sp", (Math.max(-1, Math.min(1, ((h - sv.top) / (h + sv.height)) * 2 - 1))).toFixed(3));
    if (journey && pos.length > 1) {
      // Across on wide screens, down the left on phones.
      const across = Math.abs(pos[1][1] - pos[0][1]) < 4;
      const span = across ? journey.offsetWidth - 56 : journey.offsetHeight - 56;
      const jp = across ? clamp01((h * 0.85 - jr.top) / (h * 0.4)) : clamp01((h * 0.62 - jr.top - 28) / span);
      journey.style.setProperty("--jp", jp.toFixed(3));
      steps.forEach((li, i) => {
        const at = (across ? pos[i][0] : pos[i][1]) / span;
        li.classList.toggle("lit", jp >= at - 0.02);
      });
    }
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  frame();
})();
