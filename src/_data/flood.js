// the water got in (session 98).
// at every build this asks usgs for the last 120 days of gauge height at
// buffalo bayou at shepherd drive (08074000), every fifteen minutes. 120
// days is the longest the instantaneous-values service will hand over for
// the asking, so it is also how long a stain lasts in this house.
// this house has no real floor. it is given one here: 3.5 ft on that
// gauge, a little above where the bayou sits when it hasn't rained. every
// time the water went over it, that is one event, and its crest leaves a
// line on every room. the room is ten feet tall.
// if usgs can't be reached, ok is false and the walls are clean, not
// because nothing happened but because nobody could check.
const SITE = "08074000";
const FLOOR = 3.5;      // ft on the gauge
const CEILING = 10;     // ft above the floor
const GAP = 12 * 3600e3; // two runs closer than this are one flood

const MONTHS = ["january","february","march","april","may","june","july",
  "august","september","october","november","december"];

function houstonDay(ms) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago", year: "numeric", month: "numeric", day: "numeric"
  }).formatToParts(new Date(ms));
  const get = (t) => Number(p.find((x) => x.type === t).value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

module.exports = async () => {
  const now = Date.now();
  const out = { ok: false, site: SITE, floor: FLOOR, ceiling: CEILING, events: [] };
  try {
    const res = await fetch(
      "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=" + SITE + "&parameterCd=00065&period=P120D",
      { headers: { "User-Agent": "match-spark-build" }, signal: AbortSignal.timeout(20000) }
    );
    if (!res.ok) return out;
    const d = await res.json();
    const ts = (d.value.timeSeries || [])[0];
    if (!ts) return out;
    const pts = ts.values[0].value
      .map((v) => [Date.parse(v.dateTime), parseFloat(v.value)])
      .filter((p) => isFinite(p[0]) && isFinite(p[1]) && p[1] > -999);
    if (!pts.length) return out;

    let ev = null, lastWet = 0;
    const events = [];
    for (const [t, h] of pts) {
      if (h <= FLOOR) continue;
      if (!ev || t - lastWet > GAP) {
        ev = { from: t, peak: h, at: t };
        events.push(ev);
      }
      if (h > ev.peak) { ev.peak = h; ev.at = t; }
      ev.to = t; lastWet = t;
    }
    out.ok = true;
    out.events = events.map((e) => {
      const day = houstonDay(e.at);
      const hours = Math.max(0.25, (e.to - e.from) / 3600e3);
      return {
        peak: Number(e.peak.toFixed(2)),
        above: Number(Math.min(CEILING, e.peak - FLOOR).toFixed(2)),
        at: new Date(e.at).toISOString(),
        age: Number(((now - e.at) / 86400e3).toFixed(2)),
        dateText: MONTHS[day.m - 1] + " " + day.d,
        hoursText: hours < 1.5 ? "under an hour" : hours < 48 ? Math.round(hours) + " hours" : Math.round(hours / 24) + " days"
      };
    });
  } catch (e) {
    out.ok = false;
  }
  return out;
};
