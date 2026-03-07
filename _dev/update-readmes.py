#!/usr/bin/env python3
"""Add preview.svg image reference to each section's README."""

import os
import re

README_MAP = {
    "FAQ": "readme.md",
    "Scarcity Bar": "README.md",
    "Shop by State Map": "README.md",
    "Media Slider Snap": "README.md",
    "Tabbed Description": "README.md",
    "Sectioned Contact Form": "README.md",
    "IP Redirection": "README.md",
    "Videos Slider": "README.md",
    "Video Slider": "README.md",
    "Hero Slider (rocklss)": "README.md",
    "Image Gallery (BoldizArt)": "README.md",
    "Timeline (rocklss)": "README.md",
    "Tooltips": "README.md",
    "Pricing Table (rocklss)": "README.md",
    "Marquee Products": "README.md",
    "YouTube Section": "README.md",
    "Pagination With Numbers": "README.md",
    "Fancy Slick Carousel": "README.md",
    "Collection Page Swatches": "README.md",
    "Double Block Section": "README.md",
    "Quiz": "README.md",
    "App Optimization": "readme.md",
    "Section Lab/How To Use": "README.md",
    "Section Lab/Real Results": "README.md",
    "Section Lab/Frequently Bought Together": "README.md",
    "Section Lab/UGC Videos Homepage": "README.md",
    "Section Lab/Payment Icons": "README.md",
    "Section Lab/Native Video Slider": "README.md",
    "Section Lab/Nudges Widget": "README.md",
    "Section Lab/Face Proof Bubble": "README.md",
    "Section Lab/Announcement Bar": "README.md",
    "Section Lab/Delivery Countdown": "README.md",
    "Section Lab/Price Bubble Widget": "README.md",
    "Section Lab/Social Proof Video": "README.md",
    "Section Lab/Icon List": "README.md",
    "Section Lab/Before And After": "README.md",
    "Section Lab/Story Navigation": "README.md",
}

base = "/workspace"

for folder, readme_name in README_MAP.items():
    readme_path = os.path.join(base, folder, readme_name)
    svg_path = os.path.join(base, folder, "preview.svg")

    if not os.path.isfile(readme_path):
        print(f"SKIP (no readme): {readme_path}")
        continue
    if not os.path.isfile(svg_path):
        print(f"SKIP (no svg): {svg_path}")
        continue

    with open(readme_path, "r") as f:
        content = f.read()

    if "preview.svg" in content:
        print(f"SKIP (already has image): {readme_path}")
        continue

    # Insert image right after the first H1 heading line
    lines = content.split("\n")
    insert_idx = None
    for i, line in enumerate(lines):
        if line.startswith("# "):
            insert_idx = i + 1
            break

    if insert_idx is None:
        print(f"SKIP (no H1 found): {readme_path}")
        continue

    # Skip any blank lines right after the H1
    while insert_idx < len(lines) and lines[insert_idx].strip() == "":
        insert_idx += 1

    # Insert the image reference with a blank line before and after
    image_line = "![Preview](preview.svg)"
    lines.insert(insert_idx, "")
    lines.insert(insert_idx + 1, image_line)
    lines.insert(insert_idx + 2, "")

    with open(readme_path, "w") as f:
        f.write("\n".join(lines))

    print(f"OK: {readme_path}")
