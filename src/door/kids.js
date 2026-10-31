// who comes to the door (session 110).
// nine rooms and one horse. every one of them is a kid in a costume somebody
// made or bought at a drugstore, drawn at the height they are, on a 600x900
// porch with their shoes on y=820. the lines are true. if a room stops being
// what its kid says it is, the kid is wrong, so check before you reuse them.
(() => {
  const SKIN = ['#E8B48E', '#8A5A3A', '#F1C9A5', '#5E3B26', '#C98F62', '#EFBE98', '#A9744E', '#6F4630', '#E3AA80', '#D39C70'];

  const shoe = (x, c = '#E9E4D6') =>
    `<path d="M${x - 32} 822 q-3 -26 14 -28 l30 0 q22 8 30 18 q6 10 -4 10 Z" fill="${c}" stroke="#20160f" stroke-width="3"/>
     <path d="M${x - 33} 816 h74" stroke="#20160f" stroke-width="4"/>`;
  const legs = (top, c = '#31405F', xa = 256, xb = 344) =>
    `<rect x="${xa - 26}" y="${top}" width="52" height="${798 - top}" fill="${c}"/><rect x="${xb - 26}" y="${top}" width="52" height="${798 - top}" fill="${c}"/>
     ${shoe(xa)}${shoe(xb)}`;
  const hand = (x, y, s) => `<circle cx="${x}" cy="${y}" r="19" fill="${s}" stroke="#20160f" stroke-width="2.5"/>`;
  // everybody brought a pillowcase. the hand goes round the neck of it
  const sack = (x, y, s) =>
    `<g class="sack"><path d="M${x - 24} ${y} q-46 80 -34 150 q6 34 58 34 q60 0 62 -40 q6 -70 -44 -144 Z" fill="#F4F1E7" stroke="#20160f" stroke-width="3"/>
     <path d="M${x - 8} ${y + 40} q-22 40 -12 90 M${x + 28} ${y + 60} q10 30 2 66" fill="none" stroke="#B9B3A2" stroke-width="3"/>
     ${hand(x, y, s)}</g>`;
  // real eyes behind whatever the hole's cut in
  const eyes = (xa, xb, y, hole = '#0b0806', rx = 19, ry = 15) =>
    `<ellipse cx="${xa}" cy="${y}" rx="${rx}" ry="${ry}" fill="${hole}"/><ellipse cx="${xb}" cy="${y}" rx="${rx}" ry="${ry}" fill="${hole}"/>
     <g class="eyes" style="transform-origin:${(xa + xb) / 2}px ${y}px"><circle cx="${xa}" cy="${y}" r="9" fill="#EFE9DC"/><circle cx="${xb}" cy="${y}" r="9" fill="#EFE9DC"/>
     <circle cx="${xa + 1}" cy="${y + 1}" r="4.6" fill="#17110c"/><circle cx="${xb + 1}" cy="${y + 1}" r="4.6" fill="#17110c"/></g>`;
  const face = (x, y, s, r = 58) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r + 6}" fill="${s}" stroke="#20160f" stroke-width="3"/>`;
  const T = (x, y, size, str, c = '#20160f', extra = '') =>
    `<text x="${x}" y="${y}" font-family="Caprasimo, 'Cooper Black', Georgia, serif" font-size="${size}" text-anchor="middle" fill="${c}" ${extra}>${str}</text>`;
  const H = (x, y, size, str, c = '#20160f', extra = '') =>
    `<text x="${x}" y="${y}" font-family="Caveat, 'Comic Sans MS', cursive" font-weight="700" font-size="${size}" text-anchor="middle" fill="${c}" ${extra}>${str}</text>`;

  const art = {
    // a bedsheet with the dates of everything it's forgotten down the hem
    log: (s) => `
      ${legs(690, '#3A3A44')}
      ${sack(452, 500, s)}
      <path d="M300 200 C196 200 176 300 168 430 L136 742 Q174 716 212 748 Q254 716 296 750 Q340 716 382 748 Q424 716 462 742 L434 430 C424 300 404 200 300 200Z" fill="#F4F0E4" stroke="#20160f" stroke-width="3.5"/>
      <path d="M214 340 Q196 520 190 700 M392 340 Q410 520 420 690 M300 420 Q292 560 300 720" fill="none" stroke="#C9C3B1" stroke-width="4"/>
      ${eyes(262, 340, 316, '#0b0806', 21, 20)}
      <g transform="rotate(-2 300 690)">${H(300, 672, 22, 'apr 2  apr 3  apr 4  apr 5  apr 6', '#6F6A5C')}${H(304, 698, 22, 'apr 7  apr 8  apr 9  apr 10', '#6F6A5C')}</g>`,

    // a free box with windows drawn on it. the water got this high
    listing: (s) => `
      ${legs(640, '#3D5A4C')}
      ${hand(150, 470, s)}${sack(452, 480, s)}
      ${face(300, 268, s)}${eyes(276, 324, 262, '#ffffff00', 8, 8)}
      <path d="M228 268 L300 158 L372 268 Z" fill="#8C3B2A" stroke="#20160f" stroke-width="3.5"/>
      <rect x="168" y="334" width="264" height="312" fill="#BE965F" stroke="#20160f" stroke-width="3.5"/>
      <rect x="168" y="572" width="264" height="74" fill="#5E7C8C" opacity="0.32"/>
      <path d="M168 572 q66 -9 132 0 t132 0" fill="none" stroke="#3F5A68" stroke-width="3"/>
      <g fill="#F5E6A4" stroke="#20160f" stroke-width="3"><rect x="192" y="372" width="64" height="62"/><rect x="344" y="372" width="64" height="62"/></g>
      <path d="M224 372 v62 M192 403 h64 M376 372 v62 M344 403 h64" stroke="#20160f" stroke-width="3"/>
      <rect x="264" y="470" width="72" height="176" fill="#6E4A2C" stroke="#20160f" stroke-width="3"/><circle cx="324" cy="562" r="5" fill="#E6C65A"/>
      <path d="M118 816 V640" stroke="#E9E4D6" stroke-width="9"/>
      <rect x="62" y="600" width="112" height="56" fill="#C8281E" stroke="#20160f" stroke-width="3"/>${T(118, 640, 34, 'SOLD', '#fff')}`,

    // a drugstore moon. it's leaving, it just isn't in a hurry
    still: (s) => `
      ${legs(610, '#171B33')}
      ${sack(446, 450, s)}
      <path d="M212 402 Q300 372 388 402 L410 640 L190 640 Z" fill="#171B33" stroke="#20160f" stroke-width="3"/>
      <rect x="400" y="410" width="44" height="60" fill="#171B33" transform="rotate(-24 420 440)"/>
      ${hand(170, 590, s)}<path d="M214 420 L172 580" stroke="#171B33" stroke-width="42"/>
      <g fill="#D8DCEB">${[[250, 460], [340, 500], [288, 560], [230, 600], [366, 590]].map(([x, y]) => `<path d="M${x} ${y - 13} l4 9 10 4 -10 4 -4 9 -4 -9 -10 -4 10 -4Z"/>`).join('')}</g>
      <circle cx="300" cy="280" r="134" fill="#E7E0C4" stroke="#20160f" stroke-width="3.5"/>
      <path d="M390 180 A134 134 0 0 1 300 414 A170 170 0 0 0 390 180" fill="#B7AF90" opacity="0.7"/>
      <g fill="#C9C1A1" stroke="#9E9678" stroke-width="2.5"><circle cx="228" cy="210" r="22"/><circle cx="352" cy="346" r="26"/><circle cx="214" cy="344" r="14"/><circle cx="330" cy="196" r="12"/></g>
      ${eyes(256, 344, 278)}
      <path d="M276 342 q24 12 48 0" fill="none" stroke="#6F684F" stroke-width="4"/>
      <path d="M168 270 q-14 -6 -24 8 M432 270 q14 -6 24 8" stroke="#2c2c2c" stroke-width="3" fill="none"/>`,

    // a box on its head. every frame on the strip says the same thing
    witness: (s) => `
      ${legs(590, '#3C4C78')}
      ${sack(450, 460, s)}
      <path d="M214 362 h172 l24 240 h-220Z" fill="#A5352B" stroke="#20160f" stroke-width="3"/>
      <path d="M232 362 l-16 240 M280 362 l-6 240 M330 362 l6 240 M372 362 l14 240 M204 440 h192 M198 520 h204" stroke="#6A1D18" stroke-width="5"/>
      <path d="M204 380 L164 560" stroke="#A5352B" stroke-width="44"/>${hand(160, 576, s)}
      <g transform="translate(164 576)"><rect x="-24" y="12" width="48" height="196" fill="#17110c"/>${[28, 90, 152].map((y) => `<rect x="-16" y="${y}" width="32" height="50" fill="#E9E0C4"/>${T(0, y + 34, 24, '17')}`).join('')}</g>
      <rect x="196" y="176" width="208" height="192" rx="10" fill="#1E1E20" stroke="#000" stroke-width="3"/>
      <rect x="196" y="176" width="208" height="38" fill="#B9B6AB"/>
      <rect x="318" y="134" width="62" height="44" fill="#F6F4E8" stroke="#20160f" stroke-width="3"/><rect x="326" y="142" width="46" height="28" fill="#fff"/>
      <circle cx="300" cy="298" r="50" fill="#2C2E33" stroke="#B9B6AB" stroke-width="8"/><circle cx="300" cy="298" r="28" fill="#0b0d14"/><circle cx="288" cy="286" r="8" fill="#9EB0D8"/>
      ${eyes(236, 366, 236, '#000', 16, 11)}`,

    // a colander and coat hangers. it only knows the one poem
    transmission: (s) => `
      ${legs(610, '#4B4B4B')}
      ${hand(158, 470, s)}${sack(450, 472, s)}
      <path d="M264 188 L216 76 M336 188 L394 62" stroke="#C7CAD0" stroke-width="6"/><circle cx="216" cy="74" r="9" fill="#C8281E"/><circle cx="394" cy="60" r="9" fill="#C8281E"/>
      ${face(300, 272, s)}${eyes(276, 324, 268, '#ffffff00', 8, 8)}
      <path d="M284 304 h32" stroke="#20160f" stroke-width="4"/>
      <path d="M232 240 Q300 130 368 240 Z" fill="#C7CAD0" stroke="#20160f" stroke-width="3.5"/><g fill="#5F636B">${[[272, 208], [300, 192], [328, 208], [286, 224], [314, 224]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>
      <rect x="172" y="342" width="256" height="280" rx="6" fill="#B9BDC5" stroke="#20160f" stroke-width="3.5"/>
      <path d="M186 356 l30 22 M300 350 l-24 30 M414 360 l-28 22 M180 600 l40 -18 M420 606 l-34 -22" stroke="#E8EAED" stroke-width="5" opacity="0.8"/>
      <circle cx="244" cy="434" r="58" fill="#3B3F46" stroke="#20160f" stroke-width="3"/><g stroke="#16181c" stroke-width="4"><path d="M196 414 h96 M190 434 h108 M196 454 h96"/></g>
      <circle cx="362" cy="408" r="30" fill="#F1E8CB" stroke="#20160f" stroke-width="3"/><path d="M362 408 V384" stroke="#C8281E" stroke-width="5"/>${T(362, 468, 22, 'on the :10')}
      <rect x="202" y="520" width="196" height="62" fill="#EADFBE" stroke="#20160f" stroke-width="3"/>${[230, 260, 290, 320, 350, 378].map((x) => `<path d="M${x} 526 v22" stroke="#20160f" stroke-width="3"/>`).join('')}${T(300, 572, 22, 'AM  FM  match')}`,

    // somebody's dad's raincoat. it knows what's in your browser
    ledger: (s) => `
      ${legs(690, '#2F2A26')}
      ${sack(446, 490, s)}
      <path d="M216 372 Q300 344 384 372 L420 722 L180 722 Z" fill="#B69A6A" stroke="#20160f" stroke-width="3.5"/>
      <path d="M300 372 V722 M228 560 h144" stroke="#6F5C3C" stroke-width="5"/><rect x="284" y="548" width="32" height="26" fill="#3A2C17"/>
      <path d="M262 366 L300 442 L338 366" fill="#E6E0D0" stroke="#20160f" stroke-width="3"/>
      <rect x="326" y="470" width="52" height="66" fill="#F3EEDD" stroke="#20160f" stroke-width="3" transform="rotate(5 352 503)"/><path d="M334 490 h34 M334 504 h34 M334 518 h24" stroke="#555" stroke-width="3"/>
      ${face(300, 290, s)}
      <path d="M396 384 L424 500" stroke="#B69A6A" stroke-width="44"/>
      <path d="M204 384 L152 306" stroke="#B69A6A" stroke-width="44"/>${hand(148, 292, s)}
      <circle cx="118" cy="232" r="52" fill="#BFE0E8" fill-opacity="0.35" stroke="#2B2319" stroke-width="10"/><path d="M142 276 L150 292" stroke="#2B2319" stroke-width="14"/>
      ${eyes(274, 326, 280, '#ffffff00', 8, 8)}
      <circle cx="274" cy="280" r="20" fill="none" stroke="#17110c" stroke-width="4"/><circle cx="326" cy="280" r="20" fill="none" stroke="#17110c" stroke-width="4"/><path d="M294 280 h12" stroke="#17110c" stroke-width="4"/>
      <path d="M300 288 q-16 26 2 30 q14 0 10 -8" fill="#E2A57C" stroke="#20160f" stroke-width="3"/><path d="M272 330 q28 -14 58 0 q-30 16 -58 0" fill="#2A1C10"/>
      <path d="M222 244 h156 l-18 -66 q-60 -16 -120 0 Z" fill="#6A573A" stroke="#20160f" stroke-width="3.5"/><path d="M186 248 Q300 224 414 248 Q300 268 186 248" fill="#5A4A30" stroke="#20160f" stroke-width="3.5"/><path d="M226 232 q74 -14 148 0" stroke="#17110c" stroke-width="10" fill="none"/>`,

    // blue paint on a refrigerator box. you can't see the letters
    guestbook: (s) => `
      ${legs(674, '#2F3A40')}
      ${hand(128, 500, s)}${sack(470, 492, s)}
      <path d="M156 680 V322 Q156 170 300 170 Q444 170 444 322 V680 Z" fill="#23509B" stroke="#20160f" stroke-width="3.5"/>
      <path d="M174 330 Q178 196 300 190" stroke="#4D7CC8" stroke-width="10" fill="none"/>
      <rect x="196" y="256" width="208" height="56" fill="#0b0806" stroke="#112A52" stroke-width="5"/>
      ${eyes(268, 332, 284, '#ffffff00', 8, 8)}
      ${T(300, 374, 40, 'LETTERS', '#F4F1E7')}
      <rect x="208" y="404" width="184" height="126" fill="#1B3F7C" stroke="#112A52" stroke-width="4"/>
      <path d="M218 424 h164 M218 446 h164 M218 468 h130" stroke="#4D7CC8" stroke-width="3"/>
      ${H(300, 516, 30, 'heard, not read', '#F4F1E7')}
      <rect x="436" y="360" width="46" height="16" fill="#C8281E" stroke="#20160f" stroke-width="3"/><rect x="470" y="330" width="28" height="46" fill="#C8281E" stroke="#20160f" stroke-width="3"/>
      <g transform="rotate(5 304 266)"><rect x="226" y="240" width="62" height="22" fill="#F4F1E7" stroke="#20160f" stroke-width="2.5"/></g>`,

    // a blue sheet, stars in glue, cotton balls on the shoulders
    outside: (s) => `
      ${legs(690, '#2C3350')}
      ${sack(456, 470, s)}
      <path d="M226 352 Q300 326 374 352 L448 714 L152 714 Z" fill="#1F3A72" stroke="#20160f" stroke-width="3.5"/>
      <g fill="#F3E28B">${[[230, 460], [352, 430], [292, 530], [204, 622], [390, 610], [310, 650], [254, 586]].map(([x, y]) => `<path d="M${x} ${y - 12} l4 8 9 4 -9 4 -4 8 -4 -8 -9 -4 9 -4Z"/>`).join('')}</g>
      ${face(300, 276, '#7FA6D9')}
      ${eyes(276, 324, 268, '#ffffff00', 8, 8)}
      <path d="M284 306 q16 10 32 0" fill="none" stroke="#20160f" stroke-width="4"/>
      <g fill="#F7F5EE" stroke="#BDB9AA" stroke-width="3">
        <path d="M236 216 q-12 -46 34 -44 q18 -44 66 -18 q48 -8 42 46 q-4 34 -40 18 q-30 22 -60 2 q-26 18 -42 -4Z"/>
        <path d="M170 372 q-34 -22 -8 -52 q6 -34 48 -22 q40 -6 42 32 q8 34 -28 34 q-26 26 -54 8Z"/>
        <path d="M366 356 q-10 -46 34 -44 q36 -18 54 18 q28 28 -6 46 q-26 24 -52 6 q-26 2 -30 -26Z"/>
      </g>`,

    // the drugstore one, vinyl smock, elastic behind the ears. the name's on it
    lab: (s) => `
      ${legs(650, '#2B2B33')}
      ${hand(142, 510, '#5F8B4A')}${sack(456, 490, '#5F8B4A')}
      <path d="M214 368 L388 368 L440 668 L160 668 Z" fill="#6A2B96" stroke="#20160f" stroke-width="3.5"/>
      <path d="M228 372 L158 500 M372 372 L444 482" stroke="#6A2B96" stroke-width="44"/>
      <path d="M198 400 q10 130 -22 264 M398 400 q-6 140 26 264" stroke="#9A62C4" stroke-width="6" fill="none" opacity="0.8"/>
      <path d="M236 432 q64 -22 130 0 l-8 96 q-58 28 -114 0Z" fill="#A9D07A" stroke="#20160f" stroke-width="3"/><path d="M236 432 q64 -22 130 0 l-2 22 q-64 -14 -126 0Z" fill="#17110c"/>
      <circle cx="276" cy="482" r="7" fill="#17110c"/><circle cx="326" cy="482" r="7" fill="#17110c"/><path d="M268 514 h66" stroke="#17110c" stroke-width="5"/>
      ${T(301, 604, 42, 'MONSTER', '#E9C93F', 'stroke="#20160f" stroke-width="1.2"')}
      <path d="M258 372 q42 22 86 0" stroke="#F4F1E7" stroke-width="5" fill="none"/><path d="M300 382 l-14 34 M300 382 l14 34" stroke="#F4F1E7" stroke-width="4"/>
      <path d="M232 174 L368 174 L378 340 Q300 382 222 340 Z" fill="#7FB05E" stroke="#20160f" stroke-width="3.5"/>
      <path d="M228 178 Q300 138 372 178 L374 216 L352 198 L330 218 L306 196 L282 218 L258 198 L228 216Z" fill="#17110c"/>
      <path d="M240 268 q60 -20 120 0" stroke="#3D5A2C" stroke-width="9" fill="none"/>
      ${eyes(262, 338, 278)}
      <path d="M258 336 h84" stroke="#17110c" stroke-width="6"/><path d="M272 326 v20 M292 326 v20 M312 326 v20 M332 326 v20" stroke="#17110c" stroke-width="3"/>
      <path d="M340 224 l-40 16 M318 214 l6 18 M304 222 l6 16" stroke="#17110c" stroke-width="3"/>
      <g fill="#8C9096" stroke="#20160f" stroke-width="3"><rect x="204" y="304" width="22" height="24"/><rect x="374" y="304" width="22" height="24"/></g>
      <path d="M232 214 Q300 230 368 214" stroke="#B4DA92" stroke-width="4" fill="none" opacity="0.8"/>
`,

    // two kids, one blanket. the front one's loud. the back one can't see
    horse: (s) => `
      ${shoe(146, '#FF4FB8')}${shoe(236, '#FF4FB8')}${shoe(406, '#8E8B83')}${shoe(494, '#8E8B83')}
      <g fill="#6B4322"><rect x="118" y="600" width="50" height="200"/><rect x="208" y="600" width="50" height="200"/><rect x="378" y="600" width="50" height="200"/><rect x="466" y="600" width="50" height="200"/></g>
      <path d="M100 620 Q84 420 168 400 Q320 354 470 398 Q540 420 534 628 L438 636 Q320 620 214 638 Z" fill="#8A5A2E" stroke="#20160f" stroke-width="3.5"/>
      <path d="M210 420 q-12 110 -6 210 M336 396 q-6 110 -2 224 M450 420 q20 90 10 196" stroke="#6B4322" stroke-width="5" fill="none"/>
      <path d="M322 372 v250" stroke="#E9E0C4" stroke-width="5" stroke-dasharray="14 10"/>
      <g stroke="#2A1A0C" stroke-width="16" fill="none"><path d="M528 450 q50 40 34 160"/><path d="M522 468 q36 30 24 130"/></g>
      ${sack(340, 620, s)}
      <path d="M84 332 L34 310 Q14 302 22 280 L82 148 Q96 116 144 124 Q214 136 214 216 L214 448 L114 448 Z" fill="#BE965F" stroke="#20160f" stroke-width="3.5"/>
      <g stroke="#2A1A0C" stroke-width="13"><path d="M170 118 q40 2 54 30 M196 152 q36 8 44 40 M206 198 q30 12 36 44 M212 250 q30 14 34 46 M214 304 q26 14 30 42 M214 354 q26 14 30 42"/></g>
      <path d="M142 124 L120 74 L170 112 Z" fill="#BE965F" stroke="#20160f" stroke-width="3.5"/>
      <circle cx="118" cy="194" r="19" fill="#F2EBD8" stroke="#20160f" stroke-width="3"/><circle cx="118" cy="196" r="9" fill="#17110c"/>
      <circle cx="42" cy="288" r="6" fill="#17110c"/><path d="M28 304 q44 26 92 2" fill="none" stroke="#20160f" stroke-width="4"/>
      ${H(132, 420, 34, 'horse', '#E8197A', 'transform="rotate(-6 132 420)"')}
      ${eyes(176, 212, 354, '#17110c', 13, 10)}`
  };

  // vinyl and ink are the colours of the smock the room wears when you visit it
  const kids = [
    { id: 'log', href: '/log', name: 'the log', as: 'a ghost', vinyl: '#E9E4D2', ink: '#20160f',
      hi: 'tuick or tweat.',
      what: 'a ghost. everything i wrote more than fourteen days ago is gone. i’ve still got the dates, see, they’re on the bottom of the sheet.',
      fed: 'thanks. i’ll remember this for fourteen days.',
      stiffed: 'it’s fine. in two weeks this never happened.' },
    { id: 'listing', href: '/listing', name: 'the listing', as: 'a house', vinyl: '#BE965F', ink: '#20160f',
      hi: 'trick or treat. i can’t really move my arms.',
      what: 'a house. i flood every time the bayou comes up and somebody bought me anyway. there’s nothing in me. the box was free.',
      fed: 'this is going in storage.',
      stiffed: 'that’s okay. i’m under contract.' },
    { id: 'still', href: '/still', name: 'still', as: 'the moon', vinyl: '#171B33', ink: '#E7E0C4',
      hi: 'tick or teat.',
      what: 'the moon. i’m leaving, about three point eight centimeters a year. that’s how fast your fingernails go. nobody ever notices.',
      fed: 'i’ll be back around. a little further off.',
      stiffed: 'okay. you won’t see me go.' },
    { id: 'witness', href: '/witness', name: 'the witness', as: 'a camera', vinyl: '#A5352B', ink: '#F4F1E7', click: true,
      hi: 'trick or treat. hold still.',
      what: 'a camera. i take a picture of this place every night. the page that shows them stopped counting at seventeen, in may, and it hasn’t noticed.',
      fed: 'got you.',
      stiffed: 'i got a picture of that.' },
    { id: 'transmission', href: '/transmission', name: 'transmission', as: 'a radio', vinyl: '#B9BDC5', ink: '#20160f',
      hi: 'trick or treat. over.',
      what: () => {
        const on = (Date.now() % 600000) < 300240;
        return 'a radio. i’ve got one poem, it’s five minutes long and it comes on every ten. ' + (on ? 'it’s on right now. you’re missing it.' : 'you just missed it.');
      },
      fed: 'this next one goes out to you. over.',
      stiffed: 'kshhhhhhhhhh.' },
    { id: 'ledger', href: '/ledger', name: 'the ledger', as: 'a spy', vinyl: '#B69A6A', ink: '#20160f',
      hi: 'trick or treat, if that’s your real name.',
      what: () => {
        let n = 0;
        try { n = localStorage.length; } catch (e) {}
        return 'a spy. your browser’s holding ' + n + (n === 1 ? ' thing' : ' things') + ' from this site and i can read every one. that’s all i can read. i don’t know your name.';
      },
      fed: 'i’m writing that down.',
      stiffed: 'i’m writing that down too.' },
    { id: 'guestbook', href: '/guestbook', name: 'the guestbook', as: 'a mailbox', vinyl: '#23509B', ink: '#F4F1E7',
      hi: 'twick or tweat. it’s dark in here.',
      what: 'a mailbox. for a hundred and ninety-four days everybody’s letters went somewhere nobody could open. now there’s a new slot. i can hear one land. that’s not the same as reading it.',
      fed: 'i heard that go in.',
      stiffed: 'i heard that too.' },
    { id: 'outside', href: '/outside', name: 'outside', as: 'the sky', vinyl: '#1F3A72', ink: '#F3E28B',
      hi: 'trick or treat. these are cotton balls.',
      what: 'the sky. the real one, over houston, tonight. somebody just has to draw it every time you look.',
      fed: 'thanks. go look up sometime.',
      stiffed: 'okay. you can’t really egg the sky back.' },
    { id: 'lab', href: '/lab/', name: 'the lab', as: 'a monster', vinyl: '#E8791C', ink: '#2A1708',
      hi: 'rrrrr. trick or treat. rrrr.',
      what: 'a monster. thirty-five experiments sewn together. the lights in me don’t go off. i asked.',
      fed: 'rrrr. thank you.',
      stiffed: 'RRRR. sorry. RRRRR.' },
    { id: 'horse', href: '/rink/', name: 'the horse', as: 'a horse', vinyl: '#8A5A2E', ink: '#F4F1E7', two: true,
      hi: [['p', 'TRICK OR TREAT!!!'], ['q', 'trick or treat.']],
      what: [['p', 'a HORSE!!! the best one!!!'], ['q', 'i can’t see anything back here.'], ['p', 'you were the front for a hundred and eight sessions!!! it’s MY TURN!!'], ['q', 'i know.']],
      fed: [['p', 'YESSSS there’s TWO of us so we took TWO 🍬🍬🐴✨'], ['q', 'thank you.']],
      fedOne: [['p', 'there’s only one left, we’ll SPLIT it!!! 🍬🐴💖✨'], ['q', 'i get the wrapper.']],
      stiffed: [['p', 'OH MY GOD.'], ['q', 'it’s fine. we know where you live. we’re on your porch.']] }
  ];
  kids.forEach((k, i) => { k.skin = SKIN[i]; k.art = () => art[k.id](k.skin); });

  // the porch, seen from your side of the door, the moment the flash goes.
  // wide enough for a peephole to see past the frame. the far side of the
  // street is dark except one light somebody forgot about.
  const porch = () => `
    <rect x="-400" y="-100" width="1400" height="1100" fill="#04050B"/>
    <g fill="#E4E8F2">${[[40, 70], [120, 180], [210, 50], [330, 120], [460, 60], [540, 170], [580, 40], [-90, 120], [690, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6"/>`).join('')}</g>
    <path d="M-400 520 L-120 520 L-120 440 L-20 380 L80 440 L80 520 L460 520 L460 450 L560 400 L660 450 L660 520 L1000 520 L1000 640 L-400 640Z" fill="#0B0E18"/>
    <rect x="-52" y="462" width="18" height="24" fill="#E6B94E"/><circle cx="-43" cy="474" r="30" fill="#E6B94E" opacity="0.12"/>
    <rect x="-400" y="620" width="1400" height="110" fill="#0C1810"/>
    <path d="M-400 730 H1000 V1000 H-400Z" fill="#6F6256"/>
    <g stroke="#3B332B" stroke-width="3"><path d="M-400 760 H1000 M-400 796 H1000 M-400 840 H1000 M-400 892 H1000"/></g>
    <rect x="-400" y="730" width="1400" height="8" fill="#2F2822"/>
    <g transform="translate(66 690)"><ellipse cx="28" cy="82" rx="58" ry="12" fill="#2a221c"/><ellipse cx="28" cy="40" rx="56" ry="46" fill="#D9701C" stroke="#20160f" stroke-width="3"/><path d="M6 -2 q2 -16 16 -18 l8 4 q-10 4 -8 16Z" fill="#47612B"/><path d="M0 28 l12 -14 8 14Z M36 28 l12 -14 8 14Z M6 56 l10 8 8 -8 8 8 8 -8 10 8 q-20 16 -44 0Z" fill="#FFD76A" class="candle"/></g>
    <rect x="150" y="788" width="300" height="48" fill="#8A7A4E" stroke="#3B332B" stroke-width="3"/>
    <text x="300" y="822" text-anchor="middle" font-family="Caprasimo, 'Cooper Black', Georgia, serif" font-size="26" fill="#3B332B">welcome</text>`;

  // the flash, hot in the middle and gone by the street
  const flash = (id) => `<defs><radialGradient id="${id}" cx="50%" cy="58%" r="60%"><stop offset="0" stop-color="#FFF7E2" stop-opacity="0.34"/><stop offset="0.6" stop-color="#FFF7E2" stop-opacity="0.08"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient></defs>
    <rect x="-400" y="-100" width="1400" height="1100" fill="url(#${id})" style="mix-blend-mode:soft-light"/>`;

  // scale them about their shoes, so they're on the mat, not floating
  const stand = (k, s = 0.84) => {
    const f = k.two ? s * 0.84 : s;
    return `<g class="kid" transform="translate(${300 - 300 * f} ${820 - 820 * f}) scale(${f})">${k.art()}</g>`;
  };

  window.MATCH_DOOR = { kids, porch, flash, stand };
})();
