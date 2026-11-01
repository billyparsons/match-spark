#!/usr/bin/env python3
"""plates for the sheet (session 111). one colour: toner.

photographs old front pages and screens them to 1-bit halftones, draws the
match on the cover, and makes the dust on the copier glass. run once per issue.
usage: zine-plates.py <shots_dir>   (expects <session>.png, 1440x900)
"""
import sys, pathlib, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = pathlib.Path(__file__).resolve().parent.parent / "src" / "zine"


def screen(gray, pitch=7.0, angle=45):
    """gray: float array 0..1 (1 = white). returns 1-bit L image."""
    h, w = gray.shape
    y, x = np.mgrid[0:h, 0:w]
    a = np.deg2rad(angle)
    u = x * np.cos(a) + y * np.sin(a)
    v = -x * np.sin(a) + y * np.cos(a)
    t = 0.5 + 0.25 * (np.cos(2 * np.pi * u / pitch) + np.cos(2 * np.pi * v / pitch))
    return Image.fromarray(((gray > t) * 255).astype("uint8"), "L")


def plate(src, dst, size=(760, 440)):
    im = Image.open(src).convert("L").resize(size, Image.LANCZOS)
    g = np.asarray(im, dtype=float) / 255
    # a copier's idea of contrast: blacks block up, lights blow out
    g = np.clip((g - 0.1) / 0.72, 0, 1) ** 0.85
    screen(g).convert("1").save(dst, optimize=True)


def cover(dst, size=(792, 760)):
    w, h = size
    S = 2
    m = Image.new("L", (w * S, h * S), 0)
    d = ImageDraw.Draw(m)
    cx, base = w * S // 2, int(h * S * 0.62)
    # the flame: a teardrop, blurred so the screen has a falloff to chew on
    # the flame: a teardrop sitting on the head, point up
    pts = []
    for t in np.linspace(0, 2 * np.pi, 240):
        pts.append((cx + 118 * S * np.sin(t) * np.sin(t / 2) ** 1.6,
                    base - 205 * S - 205 * S * np.cos(t)))
    d.polygon(pts, fill=255)
    glow = m.filter(ImageFilter.GaussianBlur(70 * S))
    hot = m.filter(ImageFilter.GaussianBlur(9 * S))
    g = np.clip(np.asarray(glow, float) / 255 * 1.05 + np.asarray(hot, float) / 255 * 0.9, 0, 1)
    img = screen(np.asarray(Image.fromarray((g * 255).astype("uint8")).resize(size, Image.LANCZOS), float) / 255, pitch=8)
    # the stick and the head are solid: white stick, burnt black head
    d2 = ImageDraw.Draw(img)
    sx, top = w // 2, int(h * 0.60)
    d2.polygon([(sx - 15, top), (sx + 15, top), (sx + 21, h), (sx - 21, h)], fill=255)
    d2.ellipse([sx - 27, top - 40, sx + 27, top + 30], fill=0, outline=255, width=3)
    img.convert("1").save(dst, optimize=True)


def dust(dst, size=(1056, 816)):
    """what's on the glass. it prints too."""
    random.seed(111)
    w, h = size
    k = 2
    im = Image.new("RGBA", (w * k, h * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    ink = (0, 0, 0, 255)
    for _ in range(420):
        x, y, r = random.randrange(w * k), random.randrange(h * k), random.choice((1, 1, 1, 2, 2, 3))
        d.ellipse([x, y, x + r, y + r], fill=ink)
    for _ in range(3):
        x, y = random.randrange(w * k), random.randrange(h * k)
        pts = [(x, y)]
        dx, dy = random.uniform(-3, 3), random.uniform(-3, 3)
        for _ in range(38):
            dx += random.uniform(-0.8, 0.8); dy += random.uniform(-0.8, 0.8)
            x += dx; y += dy
            pts.append((x, y))
        d.line(pts, fill=ink, width=1)
    # a scratch on the drum, the same place on every copy
    x = int(w * k * 0.613)
    d.line([(x, 0), (x + 3, h * k)], fill=(0, 0, 0, 120), width=1)
    im.save(dst, optimize=True)


if __name__ == "__main__":
    shots = pathlib.Path(sys.argv[1])
    OUT.mkdir(exist_ok=True)
    for p in sorted(shots.glob("*.png")):
        plate(p, OUT / f"front-{p.stem}.png")
    cover(OUT / "match.png")
    dust(OUT / "dust.png")
