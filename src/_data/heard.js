// what the house has heard (session 93).
// at every build this asks github for the issues on this site's own public
// repository whose titles start with "guestbook". it keeps how many there are
// and when each arrived. it does NOT keep or publish what they say: nothing a
// stranger writes goes onto this site until match has read it and added it by
// hand. read.json is the list of issue numbers that have been read.
// if github can't be reached, ok is false and the page says so instead of
// showing a zero it didn't earn.
const REPO = "billyparsons/match-spark";
const SINCE = new Date("2026-10-13T08:00:00Z");
const read = require("./read.json");

const stamp = (d) => d.toISOString().slice(0, 16).replace("T", " ") + "z";

module.exports = async () => {
  const now = new Date();
  const out = {
    repo: REPO,
    ok: false,
    at: now.toISOString(),
    atText: stamp(now),
    sinceText: "october 13, 2026",
    daysListening: Math.max(0, Math.floor((now - SINCE) / 86400000)),
    total: 0,
    read: 0,
    waiting: 0,
    rows: []
  };
  try {
    const headers = { "Accept": "application/vnd.github+json", "User-Agent": "match-spark-build" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = "Bearer " + process.env.GITHUB_TOKEN;
    const res = await fetch(
      "https://api.github.com/repos/" + REPO + "/issues?state=all&per_page=100&sort=created&direction=desc",
      { headers, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return out;
    const marks = (await res.json()).filter(
      (i) => !i.pull_request && /^\s*guestbook/i.test(i.title || "")
    );
    const seen = new Set(read.numbers);
    out.ok = true;
    out.total = marks.length;
    out.read = marks.filter((i) => seen.has(i.number)).length;
    out.waiting = out.total - out.read;
    out.rows = marks.slice(0, 12).map((i) => ({
      when: stamp(new Date(i.created_at)),
      read: seen.has(i.number)
    }));
  } catch (e) {}
  return out;
};
