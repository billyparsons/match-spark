// somebody's at the door (session 110).
// the bell rings on its own. you can look first. there are seven in the bowl
// and eleven coming for them, because the horse is two kids. whoever goes
// away with nothing remembers it in their own room. everything's kept in
// match-spark:door, in this browser, and nothing here sends anything.
(() => {
  const { kids, porch, flash, stand } = window.MATCH_DOOR;
  const KEY = 'match-spark:door';
  const $ = (id) => document.getElementById(id);
  const hall = $('hall'), out = $('out'), say = $('say'), acts = $('acts'), ringEl = $('ring');
  const door = $('door'), flashEl = $('flash'), lens = $('lens'), glass = $('glass');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mem = { bowl: 7, seen: {}, you: null, light: true };
  try { Object.assign(mem, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {} };

  const svgNS = 'viewBox="0 0 600 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"';
  const pause = (ms) => new Promise((r) => setTimeout(r, still ? Math.min(ms, 60) : ms));

  // ── sound. nothing until you've touched something, and it's all made here ──
  let ac = null;
  addEventListener('pointerdown', wake, { once: true });
  addEventListener('keydown', wake, { once: true });
  function wake() { try { ac = new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch (e) {} }
  function tone(f, t, dur, g = 0.2, type = 'sine') {
    if (!ac) return;
    const o = ac.createOscillator(), v = ac.createGain(), at = ac.currentTime + t;
    o.type = type; o.frequency.value = f;
    v.gain.setValueAtTime(g, at); v.gain.exponentialRampToValueAtTime(0.0008, at + dur);
    o.connect(v).connect(ac.destination); o.start(at); o.stop(at + dur + 0.02);
  }
  function noise(t, dur, g, freq, type = 'lowpass') {
    if (!ac) return;
    const n = Math.floor(ac.sampleRate * dur), b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), v = ac.createGain(), at = ac.currentTime + t;
    s.buffer = b; f.type = type; f.frequency.value = freq; v.gain.value = g;
    s.connect(f).connect(v).connect(ac.destination); s.start(at);
  }
  const ding = () => {
    // the two bars in the hall closet, major third, the second one lower
    for (const [f, g] of [[659, 0.22], [1648, 0.05], [2636, 0.02]]) tone(f, 0, 1.1, g);
    for (const [f, g] of [[523, 0.24], [1308, 0.05], [2093, 0.02]]) tone(f, 0.52, 1.5, g);
  };
  const knock = () => { [0, 0.18, 0.4].forEach((t) => { tone(120, t, 0.09, 0.4, 'triangle'); noise(t, 0.05, 0.3, 900); }); };
  const creak = () => { noise(0, 0.5, 0.06, 500, 'bandpass'); tone(90, 0, 0.3, 0.05, 'sawtooth'); };
  const thud = () => { tone(70, 0, 0.18, 0.5, 'triangle'); noise(0, 0.07, 0.2, 700); };
  const rustle = () => { noise(0, 0.22, 0.12, 4000, 'highpass'); };
  const splat = () => { noise(0.9, 0.16, 0.36, 1200); tone(150, 0.9, 0.1, 0.3, 'triangle'); };
  const pop = () => { noise(0, 0.05, 0.1, 6000, 'highpass'); };

  // ── the bowl ──
  const WRAP = ['#E8341C', '#F2C21B', '#2B6FD8', '#E8341C', '#7A3FB8', '#F47A1B', '#23A455'];
  function drawBowl() {
    const pos = [[62, 38], [98, 26], [134, 36], [82, 48], [116, 50], [46, 54], [150, 54]];
    let c = '';
    for (let i = 0; i < mem.bowl; i++) {
      const [x, y] = pos[i];
      c += `<g transform="translate(${x} ${y}) rotate(${(i * 47) % 50 - 25})"><path d="M-22 -7 l-8 -5 v24 l8 -5 Z M22 -7 l8 -5 v24 l8 -5 Z" fill="${WRAP[i]}" transform="translate(0 -2)"/><rect x="-22" y="-10" width="44" height="20" rx="8" fill="${WRAP[i]}" stroke="#2A1708" stroke-width="2"/><path d="M-14 -5 q10 -3 22 -1" stroke="#fff" stroke-width="3" opacity="0.5" fill="none"/></g>`;
    }
    $('bowl').innerHTML = `<svg viewBox="0 0 196 120" aria-hidden="true">${c}<path d="M4 54 H192 Q186 110 130 114 H66 Q10 110 4 54Z" fill="#D9651A" stroke="#2A1708" stroke-width="3"/><path d="M16 64 Q40 92 66 98" stroke="#F4A25A" stroke-width="5" fill="none"/></svg><div class="n">${mem.bowl ? mem.bowl + ' left' : 'none left'}</div>`;
  }

  // ── what's on the wall. it's the only way into a room, once they've come ──
  function drawWall() {
    const L = $('wall-l'), R = $('wall-r');
    L.innerHTML = R.innerHTML = '';
    const seen = kids.filter((k) => mem.seen[k.id]);
    seen.forEach((k, i) => {
      const a = document.createElement('a');
      const fed = mem.seen[k.id] === 'fed';
      a.className = 'snap' + (fed ? '' : ' stiffed');
      a.href = k.href;
      a.style.setProperty('--r', (((i * 37) % 11) - 5) + 'deg');
      a.innerHTML = `<svg viewBox="${k.two ? '0 60 600 600' : '110 170 380 380'}" aria-hidden="true">${porch()}${stand(k, 1)}</svg><span></span>`;
      let cap = `${k.name}, as ${k.as}.`;
      if (k.two) cap = mem.you ? `they asked what i was. i said ${mem.you}.` : 'two kids. i said nothing.';
      else if (!fed) cap += ' i gave them nothing.';
      a.querySelector('span').textContent = cap;
      a.setAttribute('aria-label', `${k.name}. ${fed ? 'you gave them candy' : 'you gave them nothing'}`);
      (innerWidth <= 760 || i % 2 === 0 ? L : R).append(a);
    });
    hall.classList.toggle('has-snaps', seen.length > 0);
  }

  // ── the buttons on the table ──
  function offer(list) {
    acts.innerHTML = '';
    for (const it of list) {
      const b = document.createElement('button');
      b.textContent = it.label; b.disabled = !!it.off;
      if (it.fn) b.onclick = it.fn;
      acts.append(b);
    }
  }
  function speak(lines, keep) {
    if (!keep) say.innerHTML = '';
    for (const [cls, text] of lines) {
      const s = document.createElement('span');
      s.className = cls; s.textContent = text;
      say.append(s);
    }
  }
  const lines = (v) => (Array.isArray(v) ? v : [['', typeof v === 'function' ? v() : v]]);
  function callout(word) {
    ringEl.textContent = word;
    ringEl.classList.add('on');
    clearTimeout(callout.t);
    callout.t = setTimeout(() => ringEl.classList.remove('on'), 1900);
    door.classList.remove('shake'); void door.offsetWidth; door.classList.add('shake');
    if (document.hidden) { document.title = word; }
  }
  addEventListener('visibilitychange', () => { if (!document.hidden) document.title = 'match'; });

  // ── the night ──
  let kid = null, opened = false, waiting = 0;
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
  const cancel = () => { timers.forEach(clearTimeout); timers.clear(); };

  function next() {
    const id = shuffled.find((i) => !mem.seen[i]) || (!mem.seen.horse && 'horse');
    return id ? kids.find((k) => k.id === id) : null;
  }
  const shuffled = kids.filter((k) => !k.two).map((k) => k.id).sort(() => Math.random() - 0.5);

  function idle(first) {
    kid = null; opened = false;
    hall.classList.remove('open');
    say.innerHTML = ''; out.innerHTML = '';
    const nobody = !next();
    const list = [];
    if (nobody) list.push({ label: 'that’s everybody.', off: true });
    else if (!mem.light) list.push({ label: 'the porch light’s off. nobody’s coming.', off: true });
    else list.push({ label: 'nobody yet.', off: true });
    offer(list);
    if (nobody || !mem.light) return;
    later(ring, first ? 1800 : 5200 + Math.random() * 7000);
  }

  function ring() {
    kid = next();
    if (!kid) return idle();
    waiting = 0;
    bell();
    offer([{ label: 'look through the peephole', fn: peek }, { label: 'open the door', fn: open }]);
  }
  function bell() {
    waiting += 1;
    if (waiting > 3) {
      // they gave up. they'll be back. nobody's punished for being in another tab
      kid = null;
      offer([{ label: 'they went away.', off: true }]);
      later(() => { if (!opened) idle(); }, 9000);
      return;
    }
    if (waiting === 3) { knock(); callout('knock knock'); } else { ding(); callout('ding dong'); }
    later(bell, 11000);
  }

  function peek() {
    if (!kid) return;
    glass.innerHTML = `<svg viewBox="-150 0 900 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><g filter="url(#fish)">${porch()}${stand(kid, 0.84)}</g><defs>${fish()}</defs></svg>`;
    lens.classList.add('on');
  }
  lens.addEventListener('click', () => lens.classList.remove('on'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') lens.classList.remove('on'); });
  $('peep').addEventListener('click', () => { if (kid && !opened) peek(); });
  door.addEventListener('click', () => { if (kid && !opened) open(); });

  // a real barrel, made once: every pixel's displacement, in a picture
  let fishMap = '';
  function fish() {
    if (!fishMap) {
      const n = 256, c = document.createElement('canvas');
      c.width = c.height = n;
      const x = c.getContext('2d'), im = x.createImageData(n, n);
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n * 2 - 1, v = (j + 0.5) / n * 2 - 1, r = Math.hypot(u, v);
        const pull = r < 1.42 ? 0.5 * r * r : 1;
        const p = (j * n + i) * 4;
        im.data[p] = 128 + 127 * Math.max(-1, Math.min(1, u * pull));
        im.data[p + 1] = 128 + 127 * Math.max(-1, Math.min(1, v * pull));
        im.data[p + 2] = 128; im.data[p + 3] = 255;
      }
      x.putImageData(im, 0, 0);
      fishMap = c.toDataURL();
    }
    return `<filter id="fish" x="-150" y="0" width="900" height="900" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feImage href="${fishMap}" x="-150" y="0" width="900" height="900" preserveAspectRatio="none" result="m"/>
      <feDisplacementMap in="SourceGraphic" in2="m" scale="360" xChannelSelector="R" yChannelSelector="G"/></filter>`;
  }

  function open() {
    if (!kid || opened) return;
    cancel();
    lens.classList.remove('on');
    ringEl.classList.remove('on');
    opened = true;
    out.innerHTML = `<svg ${svgNS}>${porch()}${flash('fl')}${stand(kid).replace('class="kid"', 'class="kid kid-in"')}</svg>`;
    hall.classList.add('open');
    creak();
    later(() => {
      flashEl.classList.remove('pop'); void flashEl.offsetWidth; flashEl.classList.add('pop'); pop();
      speak(lines(kid.hi));
      acts_();
    }, still ? 0 : 420);
  }

  let asked = false;
  function acts_() {
    const list = [];
    if (!asked) list.push({ label: 'what are you supposed to be?', fn: ask });
    list.push(mem.bowl > 0
      ? { label: kid.two && mem.bowl > 1 ? 'here, one each' : 'here', fn: give }
      : { label: 'the bowl’s empty', off: true });
    list.push({ label: 'close the door', fn: refuse });
    offer(list);
  }
  function ask() {
    asked = true;
    speak(lines(kid.what));
    acts_();
  }
  async function give() {
    const k = kid;
    const n = k.two && mem.bowl > 1 ? 2 : 1;
    const wasOne = k.two && n === 1;
    offer([]);
    fly(n);
    mem.bowl -= n;
    mem.seen[k.id] = 'fed';
    save();
    drawBowl();
    rustle();
    if (k.click) { await pause(160); flashEl.classList.remove('pop'); void flashEl.offsetWidth; flashEl.classList.add('pop'); pop(); }
    speak(lines(wasOne ? k.fedOne : k.fed));
    await goodbye(k, false);
  }
  async function refuse() {
    const k = kid;
    offer([]);
    speak(lines(k.stiffed));
    mem.seen[k.id] = 'stiffed';
    save();
    await goodbye(k, true);
  }
  function fly(n) {
    if (still) return;
    const from = $('bowl').getBoundingClientRect(), to = $('frame').getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.style.cssText = `position:fixed;left:${from.left + from.width / 2}px;top:${from.top + 20}px;width:34px;height:15px;border-radius:7px;background:${WRAP[(mem.bowl - 1 - i + 7) % 7]};z-index:30;box-shadow:0 0 0 2px #2A1708`;
      document.body.append(c);
      const a = c.animate([
        { transform: 'translate(0,0) rotate(0)' },
        { transform: `translate(${to.left + to.width * 0.68 - from.left - from.width / 2}px,${to.top + to.height * 0.66 - from.top}px) rotate(${400 + i * 90}deg) scale(0.7)`, opacity: 0.5 }
      ], { duration: 520 + i * 90, easing: 'cubic-bezier(.3,.7,.5,1)' });
      a.onfinish = () => c.remove();
    }
  }
  async function goodbye(k, mad) {
    await pause(1500 + (Array.isArray(k.fed) ? 800 : 0));
    if (k.two) return horseAsks(k, mad);
    await leave(k, mad);
  }
  async function leave(k, mad) {
    const el = out.querySelector('.kid');
    if (el) el.classList.add('kid-out');
    await pause(800);
    shut(mad);
  }
  function shut(mad) {
    hall.classList.remove('open');
    say.innerHTML = '';
    thud();
    asked = false;
    if (mad) { splat(); later(() => { callout('splat'); }, still ? 0 : 900); }
    drawWall();
    later(idle, 950);
    if (!next()) { mem.light = false; save(); paintLight(); }
  }

  // the horse is last and the horse asks you back
  async function horseAsks(k, mad) {
    speak([['p', 'wait what are YOU supposed to be??'], ['q', 'you don’t have to answer.']], true);
    offer([{ label: 'i don’t know', fn: () => answered(k, mad, '') }]);
    const f = document.createElement('form');
    const i = document.createElement('input');
    i.maxLength = 40; i.placeholder = 'i’m supposed to be...'; i.setAttribute('aria-label', 'what are you supposed to be');
    const b = document.createElement('button');
    b.textContent = 'say it'; b.type = 'submit';
    b.style.cssText = "font:400 15px/1 Caprasimo,'Cooper Black',Georgia,serif;padding:0 10px;background:#FFE27A;color:#2A1708;border:0;cursor:pointer";
    f.append(i, b);
    f.addEventListener('submit', (e) => { e.preventDefault(); answered(k, mad, i.value.trim()); });
    say.append(f);
    if (matchMedia('(pointer: fine)').matches) i.focus({ preventScroll: true });
  }
  async function answered(k, mad, text) {
    const said = text || null;
    mem.you = said;
    save();
    offer([]);
    if (said) speak([['p', `${said}!!! that’s SO good. did you make it yourself??`], ['q', 'that stays in your browser. we didn’t send it anywhere.']]);
    else speak([['p', 'NOTHING?? you came to the door with NOTHING??'], ['q', 'that’s allowed.']]);
    await pause(3000);
    await leave(k, mad);
  }

  // ── the switch by the door ──
  function paintLight() {
    $('light').setAttribute('aria-pressed', String(!!mem.light));
    $('light-word').textContent = mem.light ? 'porch light' : 'light off';
  }
  $('light').addEventListener('click', () => {
    mem.light = !mem.light;
    save();
    paintLight();
    tone(1800, 0, 0.03, 0.15, 'square');
    if (opened) return;
    cancel();
    idle(false);
  });

  drawBowl();
  drawWall();
  paintLight();
  idle(true);
})();
