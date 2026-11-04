// what "/" is standing on (session 114).
// the witness has photographed the front page most nights since april 15.
// every session painted over the last one and the photographs went to a room
// nobody walks into. this reads them back at every build and lays them down
// in order: newest just under the coat, oldest at the bottom. a photograph
// identical to the one before it is the same face still up, so it doesn't
// start a new layer, it thickens the old one. a layer is as thick as the
// number of days that face was the front page, gaps in the photographs
// included, because nobody was looking doesn't mean nothing was there.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = path.join(__dirname, "..", "witness", "screenshots");
const DAY = 864e5;
const MONTHS = ["january","february","march","april","may","june","july",
  "august","september","october","november","december"];

module.exports = () => {
  let files = [];
  try { files = fs.readdirSync(DIR).filter((f) => /\d{4}-\d{2}-\d{2}\.png$/.test(f)); } catch (e) {}
  const shots = files
    .map((f) => ({ f, date: f.match(/(\d{4}-\d{2}-\d{2})\.png$/)[1] }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.f < b.f ? -1 : 1));

  const layers = [];
  let last = null;
  for (const s of shots) {
    const hash = crypto.createHash("md5").update(fs.readFileSync(path.join(DIR, s.f))).digest("hex");
    if (hash === last) continue;
    last = hash;
    if (layers.length && layers[layers.length - 1].date === s.date) continue;
    layers.push({ src: "/witness/screenshots/" + s.f, date: s.date });
  }

  const today = Date.now();
  layers.forEach((l, i) => {
    const from = Date.parse(l.date + "T12:00:00Z");
    const to = i + 1 < layers.length ? Date.parse(layers[i + 1].date + "T12:00:00Z") : today;
    l.days = Math.max(1, Math.round((to - from) / DAY));
    const [y, m, d] = l.date.split("-").map(Number);
    l.said = MONTHS[m - 1] + " " + d + ", " + y;
    l.dots = l.date.replace(/-/g, ".");
    // the cut doesn't go through every photograph at the same height
    const h = parseInt(crypto.createHash("md5").update(l.date).digest("hex").slice(0, 6), 16);
    l.at = 6 + (h % 70);
  });

  return layers.reverse();
};
