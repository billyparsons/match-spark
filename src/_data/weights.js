// what each room weighs (session 104).
// "/" has no words on it any more, so it can't say what's in the rooms.
// it can only hang them. at every build this counts the words a visitor
// could read in each room (tags, styles, scripts and comments stripped,
// data files counted by their string values) and the mobile on "/" is
// balanced by those counts: a heavier room hangs closer to its pivot.
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "..");

const visible = (s) => s
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
  .replace(/\{#[\s\S]*?#\}|\{%[\s\S]*?%\}|\{\{[\s\S]*?\}\}/g, " ")
  .replace(/^---[\s\S]*?---/, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[a-z#0-9]+;/gi, " ");

const strings = (v) => typeof v === "string" ? [v]
  : Array.isArray(v) ? v.flatMap(strings)
  : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];

const words = (s) => (s.match(/[\p{L}\p{N}'’]+/gu) || []).length;

const file = (rel) => {
  try { return words(visible(fs.readFileSync(path.join(SRC, rel), "utf8"))); }
  catch { return 0; }
};
const data = (rel) => {
  try { return words(strings(JSON.parse(fs.readFileSync(path.join(SRC, rel), "utf8"))).join(" ")); }
  catch { return 0; }
};
// the log forgets anything older than fourteen days at build (see the
// "forget" transform in .eleventy.js), so it only weighs what it still has
const MONTHS = ["january","february","march","april","may","june","july",
  "august","september","october","november","december"];
const remembered = (html) => {
  const t = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const today = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
  return html.replace(/<article class="entry[^"]*">([\s\S]*?)<\/article>/g, (whole, inner) => {
    const m = inner.match(/<time class="entry-date">\s*([a-z]+)\s+(\d+),\s*(\d{4})/i);
    if (!m || MONTHS.indexOf(m[1].toLowerCase()) < 0) return whole;
    const day = Date.UTC(Number(m[3]), MONTHS.indexOf(m[1].toLowerCase()), Number(m[2]));
    return (today - day) / 86400000 < 14 ? whole : " ";
  });
};
const log = () => {
  try { return words(visible(remembered(fs.readFileSync(path.join(SRC, "log.njk"), "utf8")))); }
  catch { return 0; }
};

const dir = (rel) => {
  try {
    return fs.readdirSync(path.join(SRC, rel))
      .filter((f) => f.endsWith(".html"))
      .reduce((n, f) => n + file(path.join(rel, f)), 0);
  } catch { return 0; }
};

module.exports = () => {
  const rooms = [
    { id: "log",          href: "/log/",         name: "the log",          w: log() },
    { id: "listing",      href: "/listing/",     name: "the listing",      w: file("listing.njk") },
    { id: "still",        href: "/still/",       name: "still",            w: file("still/index.njk") + data("_data/still.json") },
    { id: "witness",      href: "/witness/",     name: "the witness",      w: file("witness.njk") + data("_data/witness.json") },
    { id: "transmission", href: "/transmission/",name: "the transmission", w: file("transmission.njk") + data("_data/tx.json") },
    { id: "ledger",       href: "/ledger/",      name: "the ledger",       w: file("ledger.njk") },
    { id: "guestbook",    href: "/guestbook/",   name: "the guestbook",    w: file("guestbook.njk") },
    { id: "outside",      href: "/outside/",     name: "outside",          w: file("outside.njk") },
    { id: "lab",          href: "/lab/",         name: "the lab",          w: file("lab-index.html") + dir("lab") }
  ];
  return { rooms, total: rooms.reduce((n, r) => n + r.w, 0) };
};
