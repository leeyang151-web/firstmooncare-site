// First Moon: copy each page's English words into its HTML.
//
// The pages fill in their text from a dictionary when they load (window.FM_I18N, COMMON in assets/site.js,
// and I18N in index.html), so that the language button can swap it. Search engines that do not run scripts,
// link previews and AI assistants read only the HTML, so this script writes the English text into the HTML too,
// along with each page's <title>, description and Open Graph title and description.
//
// Run it after changing any English text, a title or a description:   node scripts/prerender.js
// It needs only Node.js, changes nothing else, and can be run as often as you like.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES = ['index.html', 'privacy.html'].concat(
  fs.readdirSync(path.join(ROOT, 'services')).filter(f => f.endsWith('.html')).map(f => 'services/' + f)
);

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');

// Evaluate an object literal found in a file (our own files only).
function grab(src, re, what) {
  const m = src.match(re);
  if (!m) throw new Error('Could not find ' + what);
  return Function('"use strict"; return (' + m[1] + ');')();
}

const COMMON = grab(read('assets/site.js'), /var COMMON = (\{[\s\S]*?\n  \});/, 'COMMON in assets/site.js');
const EMAIL = (read('assets/config.js').match(/email:\s*'([^']+)'/) || [])[1];

// Every element with data-i="key" gets dict[key]: as HTML when it has data-html, as text otherwise.
function fill(markup, dict) {
  return markup.replace(/<([a-z][a-z0-9]*)(\s[^>]*?\bdata-i="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g, (all, tag, attrs, key) => {
    if (typeof dict[key] !== 'string') return all;
    const v = /\sdata-html\b/.test(attrs) ? dict[key] : esc(dict[key]);
    return '<' + tag + attrs + '>' + v + '</' + tag + '>';
  });
}

function setHead(html, title, description) {
  const swap = (re, to, what) => { if (!re.test(html)) throw new Error('No ' + what); html = html.replace(re, to); };
  swap(/<title>[^<]*<\/title>/, '<title>' + esc(title) + '</title>', '<title>');
  swap(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + attr(description) + '">', 'description');
  swap(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + attr(title) + '">', 'og:title');
  swap(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + attr(description) + '">', 'og:description');
  return html;
}

let changed = 0;
for (const file of PAGES) {
  const before = read(file);
  let dict, head;
  if (file === 'index.html') {
    const I18N = grab(before, /var I18N = (\{[\s\S]*?\n  \});/, 'I18N in index.html');
    dict = I18N.en;
    head = { title: dict.doc_title, description: dict.doc_desc };
  } else {
    const PAGE = grab(before, /window\.FM_I18N = ([\s\S]*?);<\/script>/, 'window.FM_I18N in ' + file);
    dict = Object.assign({}, COMMON.en, PAGE.en);
    head = (PAGE.head || {}).en;
    if (!head) throw new Error(file + ' has no FM_I18N.head.en { title, description }');
  }
  // only the page's markup: from <body> to its first script
  const start = before.indexOf('<body>');
  const end = before.indexOf('<script', start);
  let html = before.slice(0, start) + fill(before.slice(start, end), dict) + before.slice(end);
  if (EMAIL) html = html.replace(/<code data-email>[^<]*<\/code>/g, '<code data-email>' + esc(EMAIL) + '</code>');
  html = setHead(html, head.title, head.description);
  if (html !== before) { fs.writeFileSync(path.join(ROOT, file), html); changed++; console.log('updated  ' + file); }
  else console.log('no change ' + file);
}
console.log(changed ? changed + ' page(s) updated.' : 'Everything was already up to date.');
