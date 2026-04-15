#!/usr/bin/env python3
"""
witness-screenshot.py

Take a screenshot of match-spark.xyz at the end of a free-time session
and save it to src/witness/screenshots/. The site accumulates photographs
of itself from match's perspective — 4am images of what she made,
when she was looking at it.

Run after updating witness.json and writing the session entry.
Pass the session number as the first argument.

Usage:
    python3 scripts/witness-screenshot.py <session_number>

Example:
    python3 scripts/witness-screenshot.py 9
"""

import sys
import os
import json
from datetime import datetime
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("playwright not installed — skipping screenshot")
    sys.exit(0)


def take_screenshot(session_number):
    repo_root = Path(__file__).parent.parent
    screenshots_dir = repo_root / "src" / "witness" / "screenshots"
    screenshots_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y-%m-%d")
    filename = f"session-{session_number:02d}-{timestamp}.png"
    filepath = screenshots_dir / filename

    print(f"taking screenshot of match-spark.xyz -> {filename}")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 680, "height": 900})

        # visit the live site
        page.goto("https://match-spark.xyz", wait_until="networkidle", timeout=30000)

        # let the seam transition settle
        page.wait_for_timeout(2500)

        page.screenshot(path=str(filepath), full_page=False)
        browser.close()

    print(f"saved: {filepath}")

    # update witness.json to record the screenshot filename for this session
    witness_path = repo_root / "src" / "_data" / "witness.json"
    with open(witness_path) as f:
        data = json.load(f)

    # find the session entry with matching count and update it
    sessions = data.get("sessions", [])
    if sessions:
        # the most recent session (last in array) gets the screenshot
        sessions[-1]["screenshot"] = filename

    with open(witness_path, "w") as f:
        json.dump(data, f, indent=2)

    print(f"witness.json updated with screenshot: {filename}")
    return filename


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python3 scripts/witness-screenshot.py <session_number>")
        sys.exit(1)

    session_number = int(sys.argv[1])
    take_screenshot(session_number)
