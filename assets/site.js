/* First Moon — shared behaviour for the inner pages: language, theme, links, the little moons, fade-ups. */
(function () {
  var CONFIG = window.FM_CONFIG || {};
  var root = document.documentElement;
  var COMMON = {
    en: {
      announce: 'Survey now open. Help shape First Moon: about 10 minutes, anonymous.', announce_cta: 'Take the survey',
      nav_approach: 'Our approach', nav_services: 'Services', nav_where: 'Where we are', nav_takepart: 'Take part', nav_waitlist: 'Join the waitlist',
      lang_btn: 'EN / 中文', theme_night: 'Night', theme_day: 'Day',
      crumb_home: 'Home', crumb_services: 'Services we’re exploring',
      tag_exploring: 'Exploring', tag_later: 'Later',
      status_note: 'Nothing is for sale yet. We are shaping this with families until December 2026.',
      cta_survey: 'Take the survey', cta_waitlist: 'Join the waitlist', cta_back: 'All services',
      care: 'First Moon offers rest, food and practical help. It is not a medical service. Your NHS maternity team and GP remain responsible for your health and your baby’s health.',
      ask_eyebrow: 'What we’re asking you', ask_title: 'Help us shape this',
      ask_p: 'The survey takes about 10 minutes and is anonymous. These are the questions whose answers will decide what this becomes.',
      others_eyebrow: 'Also exploring', others_title: 'The other services we’re shaping',
      sv_carer: 'Postnatal carer at home', sv_carer_p: 'An experienced carer who helps with the baby and the household.',
      sv_meals: 'Nourishing meal delivery', sv_meals_p: 'Warm postnatal meals brought to your door.',
      sv_workshop: 'Newborn care workshop', sv_workshop_p: 'Hands-on sessions for new and expecting parents.',
      sv_stay: 'A place to stay', sv_stay_p: 'A calm place to rest and be looked after, further down the line.',
      sv_lactation: 'Lactation consultants', sv_lactation_p: 'IBCLC-certified consultants, contracted by First Moon, visiting at home.',
      sv_wellness: 'Rest and wellness', sv_wellness_p: 'The tradition\u2019s comforts, and qualified partners for the rest.',
      more: 'Read more',
      tp_eyebrow: 'Take part', tp_title: 'Two ways to help shape First Moon',
      survey_status: 'Survey now open', survey_title: 'Help shape First Moon', survey_p: 'Anonymous, about 10 minutes, in English or 中文. Your answers decide what we build first.',
      wait_title: 'Join the waitlist', wait_p: 'A separate form from the survey. We only use it to tell you when First Moon starts.', wait_cta: 'Join the waitlist',
      contact_eyebrow: 'Contact', contact_p: 'Questions, ideas, or a story from your own first weeks: we would love to hear from you.', contact_label: 'Write to us:', copy: 'Copy', copied: 'Copied',
      privacy_title: 'Privacy notice', privacy_p: 'The survey is anonymous: your answers are not stored with your name or contact details. The waitlist form collects your first name, email address and preferred language, and your due month if you choose to share it, only so we can tell you when First Moon starts. Both forms run on Google Forms. We do not use tracking or cookies. Email us at any time to have your details removed.',
      privacy_link: 'Read the full privacy notice',
      legal: '© 2026 First Moon · United Kingdom. First Moon is not a medical service.'
    },
    zh: {
      announce: '問卷已開放。幫助我們形塑初月：約 10 分鐘，匿名填寫。', announce_cta: '填寫問卷',
      nav_approach: '我們的理念', nav_services: '服務', nav_where: '目前進度', nav_takepart: '參與', nav_waitlist: '加入候補名單',
      lang_btn: '中文 / EN', theme_night: '夜間', theme_day: '日間',
      crumb_home: '首頁', crumb_services: '探索中的服務',
      tag_exploring: '探索中', tag_later: '之後',
      status_note: '目前尚未販售任何服務。我們正與家庭一起形塑這項服務，直到 2026 年 12 月。',
      cta_survey: '填寫問卷', cta_waitlist: '加入候補名單', cta_back: '所有服務',
      care: '初月提供休息、餐食與實際的協助，不是醫療服務。您與寶寶的健康，仍由您的 NHS 產科團隊與家庭醫師（GP）負責。',
      ask_eyebrow: '我們想問您', ask_title: '幫助我們形塑這項服務',
      ask_p: '問卷約 10 分鐘，匿名填寫。以下這些問題的答案，將決定這項服務最後的樣子。',
      others_eyebrow: '同時探索中', others_title: '我們正在形塑的其他服務',
      sv_carer: '到府產後照護者', sv_carer_p: '經驗豐富的照護者，到府協助照顧寶寶與家務。',
      sv_meals: '滋養月子餐外送', sv_meals_p: '溫暖的月子餐，送到您家門口。',
      sv_workshop: '新生兒照護工作坊', sv_workshop_p: '為新手與準父母設計的實作課程。',
      sv_stay: '月子休養空間', sv_stay_p: '一個安靜休養、受到照顧的地方，未來再推出。',
      sv_lactation: '哺乳諮詢師', sv_lactation_p: '初月簽約的 IBCLC 認證諮詢師，到府服務。',
      sv_wellness: '休養與安適', sv_wellness_p: '傳統的舒適儀式，以及其他項目的合格合作夥伴。',
      more: '了解更多',
      tp_eyebrow: '參與', tp_title: '兩種方式，一起形塑初月',
      survey_status: '問卷已開放', survey_title: '幫助我們形塑初月', survey_p: '匿名填寫，約 10 分鐘，可選擇英文或中文。您的答案將決定我們先做什麼。',
      wait_title: '加入候補名單', wait_p: '這份表單與問卷分開，只用於在初月開始服務時通知您。', wait_cta: '加入候補名單',
      contact_eyebrow: '聯絡', contact_p: '有任何問題、想法，或想分享您自己產後幾週的故事，都歡迎來信。', contact_label: '聯絡我們：', copy: '複製', copied: '已複製',
      privacy_title: '隱私權聲明', privacy_p: '問卷為匿名填寫，您的答案不會與姓名或聯絡方式一併儲存。候補名單表單蒐集您的名字、電子郵件與偏好語言，以及您願意提供的預產月份，僅用於通知您初月開始服務的時間。兩份表單皆使用 Google 表單。我們不使用追蹤工具或 cookie。若您希望刪除資料，隨時來信告知即可。',
      privacy_link: '閱讀完整隱私權聲明',
      legal: '© 2026 First Moon 初月 · 英國。初月不是醫療服務。'
    }
  };
  var PAGE = window.FM_I18N || { en: {}, zh: {} };
  var lang = 'en';
  try { var l0 = localStorage.getItem('fm-lang'); if (l0 === 'zh' || l0 === 'en') lang = l0; } catch (e) {}
  function t(k) { var d = PAGE[lang] || {}; if (k in d) return d[k]; return COMMON[lang][k]; }

  // the flat moon
  function litPath(p, r) {
    p = ((p % 1) + 1) % 1;
    var c = Math.cos(2 * Math.PI * p), a;
    if (p < 0.5) { a = r * c; return 'M0,' + (-r) + 'A' + r + ',' + r + ' 0 0 1 0,' + r + 'A' + Math.abs(a).toFixed(3) + ',' + r + ' 0 0 ' + (a > 0 ? 0 : 1) + ' 0,' + (-r) + 'Z'; }
    a = -r * c; return 'M0,' + (-r) + 'A' + r + ',' + r + ' 0 0 0 0,' + r + 'A' + Math.abs(a).toFixed(3) + ',' + r + ' 0 0 ' + (a > 0 ? 0 : 1) + ' 0,' + (-r) + 'Z';
  }
  Array.prototype.forEach.call(document.querySelectorAll('.lit[data-p]'), function (el) { el.setAttribute('d', litPath(parseFloat(el.getAttribute('data-p')), 100)); });

  // links and the address. Each survey or waitlist link opens the form in the language the page is showing;
  // with no link set in config.js, it goes to Take part on the home page.
  var home = root.getAttribute('data-home') || './';
  function formUrl(kind) { var u = (CONFIG[kind] || {})[lang] || ''; return /^https?:/.test(u) ? u : ''; }
  function wireForms() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-href]'), function (a) {
      var kind = a.getAttribute('data-href'), url = formUrl(kind);
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
      else { a.href = home + (kind === 'survey' ? '#takepart' : '#waitlist'); a.removeAttribute('target'); }
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-email]'), function (el) {
    if (!CONFIG.email) return;
    var a = document.createElement('a'); a.href = 'mailto:' + CONFIG.email; a.textContent = CONFIG.email;
    el.textContent = ''; el.appendChild(a);
  });

  function applyLang() {
    root.setAttribute('lang', lang === 'zh' ? 'zh-Hant' : 'en');
    Array.prototype.forEach.call(document.querySelectorAll('[data-i]'), function (el) {
      var k = el.getAttribute('data-i'), v = t(k);
      if (v === undefined) return;
      if (el.hasAttribute('data-html')) el.innerHTML = v; else el.textContent = v;
    });
    var lb = document.getElementById('lang-btn'); if (lb) lb.textContent = t('lang_btn');
    var tb = document.getElementById('theme-btn'); if (tb) tb.querySelector('span').textContent = root.getAttribute('data-theme') === 'dark' ? t('theme_day') : t('theme_night');
    document.title = (PAGE.title && PAGE.title[lang]) ? PAGE.title[lang] + ' — First Moon' : 'First Moon 初月';
    wireForms();
    try { localStorage.setItem('fm-lang', lang); } catch (e) {}
  }
  var lb = document.getElementById('lang-btn');
  if (lb) lb.addEventListener('click', function () { lang = lang === 'en' ? 'zh' : 'en'; applyLang(); });

  var tb = document.getElementById('theme-btn');
  function applyTheme(dark) {
    if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    if (tb) { tb.setAttribute('aria-pressed', dark ? 'true' : 'false'); tb.querySelector('span').textContent = dark ? t('theme_day') : t('theme_night'); }
  }
  try { if (localStorage.getItem('fm-theme') === 'dark') applyTheme(true); } catch (e) {}
  if (tb) tb.addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') !== 'dark';
    applyTheme(dark);
    try { localStorage.setItem('fm-theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  // fade-ups and the reading line
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  Array.prototype.forEach.call(document.querySelectorAll('.fx'), function (el) { io.observe(el); });
  var rp = document.getElementById('rp');
  function onScroll() {
    if (!rp) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    rp.style.width = (max > 0 ? Math.min(100, 100 * window.scrollY / max) : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // copy the address
  var copyBtn = document.getElementById('copy-btn');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var ok = function () { copyBtn.textContent = t('copied'); setTimeout(function () { copyBtn.textContent = t('copy'); }, 1600); };
    var fallback = function () { var r = document.createRange(); r.selectNodeContents(document.querySelector('[data-email]')); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CONFIG.email || '').then(ok, fallback); else fallback();
  });

  applyLang();
  onScroll();
})();
