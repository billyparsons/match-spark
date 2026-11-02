// the colour of the whole site (session 112).
// there's one number and anyone can add one to it. the number goes in here and
// a colour comes out. the same number always gives the same colour, so every
// colour the site has ever been can be worked out from the count alone, and
// nothing else gets kept: not who, not when, not one word.
// some of them are going to be ugly. that's the deal.
(function (root) {
  const COUNTER = "https://abacus.jasoncameron.dev";
  const KEY = "match-spark/coat";
  const frac = (x) => x - Math.floor(x);

  function hsl(n) {
    return {
      h: frac(n * 0.6180339887) * 360,
      s: 38 + 62 * frac(n * 0.7548776662),
      l: 22 + 58 * frac(n * 0.569840291)
    };
  }

  // no count, no colour
  function colour(n) {
    if (!n) return "#ffffff";
    const { h, s, l } = hsl(n);
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    const f = (k) => {
      const t = (k + h / 30) % 12;
      const v = l / 100 - a * Math.max(-1, Math.min(t - 3, 9 - t, 1));
      return Math.round(v * 255).toString(16).padStart(2, "0");
    };
    return "#" + f(0) + f(8) + f(4);
  }

  // black or white, whichever reads better on it. one of them always clears 4.5:1
  function ink(hex) {
    const lum = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    const y = 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    return (y + 0.05) / 0.05 >= 1.05 / (y + 0.05) ? "#000000" : "#ffffff";
  }

  // what it looks like, for anyone who can't see it
  function words(n) {
    if (!n) return "no colour at all";
    const { h, s, l } = hsl(n);
    const BANDS = [[15, "red"], [40, l < 42 ? "brown" : "orange"], [65, l < 42 ? "olive" : "yellow"], [85, "lime"],
      [160, "green"], [190, "teal"], [250, "blue"], [290, "purple"], [325, "magenta"], [345, "pink"], [360, "red"]];
    const name = BANDS.find((b) => h < b[0])[1];
    const out = [l < 36 ? "dark" : l > 66 ? "pale" : "", s < 55 ? "muddy" : s > 86 ? "loud" : "", name].filter(Boolean).join(" ");
    return (/^[aeiou]/.test(out) ? "an " : "a ") + out;
  }

  async function ask(verb) {
    try {
      const res = await fetch(COUNTER + "/" + verb + "/" + KEY, { cache: "no-store" });
      if (res.status === 404) return { ok: true, n: 0 };
      if (!res.ok) return { ok: false };
      const { value } = await res.json();
      return Number.isInteger(value) ? { ok: true, n: value } : { ok: false };
    } catch (e) {
      return { ok: false };
    }
  }

  function paint(n) {
    const hex = colour(n);
    const style = document.documentElement.style;
    style.setProperty("--coat", hex);
    style.setProperty("--ink", ink(hex));
    return hex;
  }

  const coat = { COUNTER, KEY, colour, ink, words, paint, read: () => ask("get"), press: () => ask("hit") };
  if (typeof module !== "undefined") module.exports = coat;
  else root.coat = coat;
})(this);
