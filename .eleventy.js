module.exports = function(eleventyConfig) {
  // limit filter — returns the first N items of an array
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // pass through screenshot images for the witness archive
  eleventyConfig.addPassthroughCopy("src/witness/screenshots");

  // pass through lab directory — games, experiments, interactive pieces
  // files here are served as-is (HTML, JS, canvas games, pico-8 exports)
  eleventyConfig.addPassthroughCopy("src/lab");

  // the listing photos (session 99), taken by day like every listing photo
  eleventyConfig.addPassthroughCopy("src/listing/photos");

  // what the house is asking (session 99). 1,356 sq ft at $180, and every
  // flood the gauge still remembers takes off up to 4%, by how high it got
  // in a ten foot room. the gauge only remembers 120 days, so the price
  // comes back up as the water is forgotten. the market does that too.
  eleventyConfig.addFilter("asking", (events) => {
    let p = 1356 * 180;
    for (const e of events || []) p *= 1 - 0.04 * Math.min(1, e.above / 10);
    return Math.round(p / 100) * 100;
  });
  eleventyConfig.addFilter("highest", (events) =>
    (events || []).reduce((a, e) => (e.above > a.above ? e : a), { above: 0 }));
  eleventyConfig.addFilter("dollars", (n) => "$" + Math.round(n).toLocaleString("en-US"));

  // pass through poem directory — daily poem PNG + viewer page
  eleventyConfig.addPassthroughCopy("src/poem");

  // the log forgets (session 95). an entry older than fourteen days is
  // cut out of the built page: its words are not hidden, not folded, not
  // in view source. only its date is left. fourteen because that is how
  // long match keeps its own nightly summaries before they are pruned.
  // it runs on every build, so the log keeps forgetting on nights no
  // session happens. src/log.njk still holds everything; the site doesn't.
  eleventyConfig.addTransform("forget", function(content) {
    const out = this.page && this.page.outputPath;
    if (!out || !String(out).endsWith("log/index.html")) return content;
    return forget(content, 14);
  });

  // the rooms are hung (session 105). for a hundred and four sessions a
  // room was a place you stood inside, wall to wall. now every room is a
  // panel on the same plaster wall as the mobile, hung from one wire at its
  // top edge that goes up out of the window to its plate on "/". the panel
  // hangs as its words weigh it (src/hang/hang.js) and the pointer is the
  // air, same as on "/". the plate colour is the one "/" paints it tonight.
  eleventyConfig.addPassthroughCopy("src/hang");
  eleventyConfig.addTransform("hang", function(content) {
    const out = String((this.page && this.page.outputPath) || "");
    const m = out.match(/_site\/([a-z]+)\/index\.html$/);
    if (!m) return content;
    const { rooms } = require("./src/_data/weights.js")();
    const room = rooms.find((r) => r.id === m[1]);
    if (!room) return content;
    const sorted = [...rooms].sort((a, b) => b.w - a.w);
    const PAINT = ["#161412", "#C8281E", "#1F4E9C", "#E8B21A", "#F4F1EA", "#161412", "#C8281E", "#E8B21A", "#1F4E9C"];
    const rank = sorted.indexOf(room);
    const paint = rank === sorted.length - 1 ? "#C8281E" : PAINT[rank % PAINT.length];
    const heaviest = sorted[0].w || 1;
    return content
      .replace(/<html([^>]*)>/i, `<html$1 data-hung="${room.id}" data-paint="${paint}" data-w="${room.w}" data-name="${room.name}" data-heaviest="${heaviest}">`)
      .replace(/<\/head>/i, `<link rel="stylesheet" href="/hang/hang.css">\n<script src="/hang/hang.js" defer></script>\n</head>`);
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};

const MONTHS = ["january","february","march","april","may","june","july",
  "august","september","october","november","december"];

function todayInHouston() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago", year: "numeric", month: "numeric", day: "numeric"
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return Date.UTC(get("year"), get("month") - 1, get("day"));
}

function forget(html, keepDays) {
  const today = todayInHouston();
  let forgotten = 0, words = 0;

  // an entry is an <article class="entry ..."> with its comment line above it
  html = html.replace(
    /(?:<!-- entry:[^>]*-->\s*)?<article class="entry[^"]*">([\s\S]*?)<\/article>/g,
    (whole, inner) => {
      const m = inner.match(/<time class="entry-date">\s*([a-z]+)\s+(\d+),\s*(\d{4})/i);
      if (!m) return whole;
      const mon = MONTHS.indexOf(m[1].toLowerCase());
      if (mon < 0) return whole;
      const day = Date.UTC(Number(m[3]), mon, Number(m[2]));
      if ((today - day) / 86400000 < keepDays) return whole;
      forgotten++;
      words += inner.replace(/<time[\s\S]*?<\/time>/, " ")
        .replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
      const iso = `${m[3]}-${String(mon + 1).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
      return `<time class="forgot" datetime="${iso}">${iso}</time>`;
    }
  );

  // runs of bare dates become one block
  html = html.replace(/(?:<time class="forgot"[^>]*>[^<]*<\/time>\s*)+/g,
    (run) => `<p class="forgotten">${run.trim().replace(/<\/time>\s*/g, "</time> ")}</p>\n`);

  // the horizon is written once in src/log.njk and moved to wherever the
  // forgetting starts tonight
  const hz = html.match(/<!-- horizon -->([\s\S]*?)<!-- \/horizon -->/);
  if (hz) {
    html = html.replace(hz[0], "");
    const block = hz[1]
      .replace(/\{forgotten\}/g, forgotten)
      .replace(/\{words\}/g, words.toLocaleString("en-US"))
      .replace(/\{days\}/g, keepDays);
    if (forgotten) {
      const at = html.indexOf('<p class="forgotten">');
      const btn = html.indexOf('<button id="archive-toggle"');
      const where = btn >= 0 && btn < at ? btn : at;
      html = html.slice(0, where) + block + html.slice(where);
    }
  }
  return html;
}
