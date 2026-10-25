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
})();
