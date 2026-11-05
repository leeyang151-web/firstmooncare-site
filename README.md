# First Moon · 初月

Website for First Moon (firstmooncare.com), served by GitHub Pages from the `main` branch.

- `index.html`: the homepage (English and Traditional Chinese). On wide screens it is the "moon dial": the page holds still while the moon waxes through six stops. On phones, and for anyone who prefers reduced motion, it is one ordinary scrolling page. Its styles and script are inside the file.
- `services/*.html`: one page for each service we are exploring. `privacy.html`: the privacy notice.
- `assets/config.js`: the survey and waitlist links (one English and one Chinese Google Form each) and the contact email, read by every page. The buttons open the form in the language the page is showing.
- `assets/site.css` and `assets/site.js`: shared styles and behaviour for the service pages and the privacy notice (language, Day / Night, links).
- `assets/`: the logo lockups (day and night), favicon and app icon.
- `media/`: the looping clips and their still frames (hero, welcome, film).
- `CNAME`: the custom domain for GitHub Pages.

## Search engines and link previews

- Every page has an English address and a Chinese one: add `?lang=zh` (for example `https://firstmooncare.com/services/carer.html?lang=zh`). The language button switches the address too, so a shared link opens in the language it was shared in. Each page tells search engines about both versions (`hreflang` links in the `<head>`, and `sitemap.xml`).
- Each page's title and search description live with its words: `doc_title` and `doc_desc` in `I18N` in `index.html`, and `FM_I18N.head` on the other pages, in both languages.
- The pages fill in their words with JavaScript so the language button can swap them. So that search engines, link previews and AI assistants can read them without running scripts, the English words are also written into the HTML. **After changing any English text, title or description, run `node scripts/prerender.js`** to copy it in. It changes nothing else and is safe to run again.
- `assets/og-image.jpg` (1200 × 630) is the picture shown when a link is shared on Facebook, WhatsApp, LinkedIn and so on.
- The home page describes First Moon to search engines (Organization and WebSite in its `application/ld+json` block); the other pages describe their place in the site (BreadcrumbList). Update the Facebook link there (`sameAs`) if the page gets a username, and add other profiles as they open.
- New page? Add it to `sitemap.xml` with both addresses, give it the same `<head>` block as the others, and run the script.
