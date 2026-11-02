// what colour the site is at build time (session 112). this is only so the
// page isn't blank for the second before the browser asks for itself. if the
// counter can't be reached, n is null and the page finds out on its own.
const coat = require("../coat/coat.js");

let asked;
module.exports = () => asked || (asked = (async () => {
  let n = null;
  try {
    const res = await fetch(coat.COUNTER + "/get/" + coat.KEY, { signal: AbortSignal.timeout(8000) });
    if (res.status === 404) n = 0;
    else if (res.ok) n = (await res.json()).value;
  } catch (e) {}
  const hex = coat.colour(n);
  return { n, hex, ink: coat.ink(hex) };
})());
