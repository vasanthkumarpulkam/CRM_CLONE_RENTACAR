#!/usr/bin/env python3
"""
Contrast checker for replica/design/tokens.json
Reads contrast_pairs and checks WCAG AA compliance.
Exit 1 if any pair fails its required ratio.
"""

import json, sys, math

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def linearise(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def luminance(hex_color):
    r, g, b = hex_to_rgb(hex_color)
    R, G, B = linearise(r), linearise(g), linearise(b)
    return 0.2126 * R + 0.7152 * G + 0.0722 * B

def contrast(hex1, hex2):
    l1, l2 = luminance(hex1), luminance(hex2)
    lighter, darker = max(l1, l2), min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def main():
    with open(sys.argv[1]) as f:
        tokens = json.load(f)

    roles = tokens['color']['roles']
    pairs = tokens['color']['contrast_pairs']

    def get_val(role_name):
        return roles[role_name]['value']

    failures = []
    print(f"\n{'Pair':<40} {'Ratio':>6}  {'Required':>8}  {'Result'}")
    print("-" * 70)
    for p in pairs:
        fg = get_val(p['fg'])
        bg = get_val(p['bg'])
        ratio = contrast(fg, bg)
        required = p['required']
        ok = ratio >= required
        label = f"{p['fg']} on {p['bg']}"
        status = "✓ PASS" if ok else "✗ FAIL"
        print(f"{label:<40} {ratio:>6.2f}  {required:>8.1f}  {status}  ({p['usage']})")
        if not ok:
            failures.append((label, ratio, required))

    print()
    if failures:
        print(f"FAILED: {len(failures)} contrast pair(s) below AA threshold:")
        for label, ratio, required in failures:
            print(f"  {label}: {ratio:.2f} (need {required:.1f})")
        sys.exit(1)
    else:
        print(f"All {len(pairs)} contrast pairs pass WCAG AA ✓")

if __name__ == '__main__':
    main()
