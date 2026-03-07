#!/usr/bin/env python3
"""Generate SVG wireframe preview images for every section in the library."""

import os

SECTIONS = {
    "FAQ": {
        "title": "FAQ",
        "body": """
        <rect x="40" y="50" width="320" height="36" rx="4" fill="#f0f0f0" stroke="#ccc"/>
        <text x="56" y="73" font-size="13" fill="#444">What is your return policy?</text>
        <text x="340" y="73" font-size="16" fill="#999">+</text>

        <rect x="40" y="94" width="320" height="36" rx="4" fill="#e8f4e8" stroke="#aad4aa"/>
        <text x="56" y="117" font-size="13" fill="#444">Do you ship internationally?</text>
        <text x="340" y="117" font-size="16" fill="#5a5">−</text>
        <rect x="40" y="130" width="320" height="30" rx="4" fill="#f8fdf8" stroke="#cce8cc"/>
        <text x="56" y="150" font-size="11" fill="#666">Yes — we ship to over 60 countries.</text>

        <rect x="40" y="168" width="320" height="36" rx="4" fill="#f0f0f0" stroke="#ccc"/>
        <text x="56" y="191" font-size="13" fill="#444">How long does delivery take?</text>
        <text x="340" y="191" font-size="16" fill="#999">+</text>

        <rect x="40" y="212" width="320" height="36" rx="4" fill="#f0f0f0" stroke="#ccc"/>
        <text x="56" y="235" font-size="13" fill="#444">Can I cancel my order?</text>
        <text x="340" y="235" font-size="16" fill="#999">+</text>
        """,
    },
    "Scarcity Bar": {
        "title": "Scarcity Bar",
        "body": """
        <rect x="60" y="90" width="280" height="8" rx="4" fill="#eee"/>
        <rect x="60" y="90" width="84" height="8" rx="4" fill="#e74c3c"/>
        <circle cx="144" cy="94" r="5" fill="#e74c3c" opacity="0.5">
          <animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <text x="200" y="130" text-anchor="middle" font-size="14" fill="#e74c3c" font-weight="600">Only 3 items left!</text>
        <text x="200" y="155" text-anchor="middle" font-size="11" fill="#999">Hurry — selling fast</text>

        <rect x="100" y="170" width="200" height="34" rx="17" fill="#222"/>
        <text x="200" y="192" text-anchor="middle" font-size="13" fill="#fff" font-weight="500">Add to Cart</text>
        """,
    },
    "Shop by State Map": {
        "title": "Shop by State Map",
        "body": """
        <ellipse cx="200" cy="145" rx="120" ry="90" fill="#e8f0e8" stroke="#88bb88" stroke-width="1.5"/>
        <text x="200" y="100" text-anchor="middle" font-size="10" fill="#666">Rajasthan</text>
        <rect x="155" y="105" width="45" height="30" rx="3" fill="#66aa66" opacity="0.5"/>
        <text x="220" y="130" text-anchor="middle" font-size="9" fill="#666">Gujarat</text>
        <rect x="195" y="133" width="35" height="22" rx="3" fill="#88cc88" opacity="0.4"/>
        <text x="240" y="160" text-anchor="middle" font-size="9" fill="#666">Maharashtra</text>
        <rect x="200" y="155" width="50" height="25" rx="3" fill="#99dd99" opacity="0.4"/>
        <text x="200" y="210" text-anchor="middle" font-size="11" fill="#555">Click a state → browse its collection</text>
        """,
    },
    "Media Slider Snap": {
        "title": "Media Slider Snap",
        "body": """
        <rect x="30" y="60" width="90" height="140" rx="6" fill="#ddd" opacity="0.5"/>
        <rect x="135" y="50" width="130" height="160" rx="6" fill="#e0e8f0" stroke="#7799cc" stroke-width="1.5"/>
        <polygon points="185,110 185,150 210,130" fill="#7799cc"/>
        <rect x="280" y="60" width="90" height="140" rx="6" fill="#ddd" opacity="0.5"/>

        <text x="200" y="235" text-anchor="middle" font-size="11" fill="#999">‹ scroll-snap carousel ›</text>
        <circle cx="180" cy="225" r="4" fill="#999"/>
        <circle cx="200" cy="225" r="4" fill="#7799cc"/>
        <circle cx="220" cy="225" r="4" fill="#999"/>
        """,
    },
    "Tabbed Description": {
        "title": "Tabbed Description",
        "body": """
        <rect x="50" y="70" width="80" height="30" rx="4" fill="#333"/>
        <text x="90" y="90" text-anchor="middle" font-size="11" fill="#fff">Details</text>
        <rect x="130" y="70" width="80" height="30" rx="4" fill="#eee" stroke="#ccc"/>
        <text x="170" y="90" text-anchor="middle" font-size="11" fill="#666">Shipping</text>
        <rect x="210" y="70" width="80" height="30" rx="4" fill="#eee" stroke="#ccc"/>
        <text x="250" y="90" text-anchor="middle" font-size="11" fill="#666">Reviews</text>

        <rect x="50" y="100" width="300" height="120" rx="4" fill="#fafafa" stroke="#ddd"/>
        <rect x="66" y="118" width="200" height="8" rx="2" fill="#ddd"/>
        <rect x="66" y="134" width="260" height="8" rx="2" fill="#ddd"/>
        <rect x="66" y="150" width="180" height="8" rx="2" fill="#ddd"/>
        <rect x="66" y="170" width="240" height="8" rx="2" fill="#eee"/>
        <rect x="66" y="186" width="140" height="8" rx="2" fill="#eee"/>
        """,
    },
    "Sectioned Contact Form": {
        "title": "Sectioned Contact Form",
        "body": """
        <text x="200" y="65" text-anchor="middle" font-size="16" fill="#333" font-weight="600">Contact Us</text>
        <rect x="60" y="80" width="130" height="28" rx="4" fill="#fff" stroke="#ccc"/>
        <text x="72" y="99" font-size="10" fill="#aaa">Name</text>
        <rect x="210" y="80" width="130" height="28" rx="4" fill="#fff" stroke="#ccc"/>
        <text x="222" y="99" font-size="10" fill="#aaa">Email *</text>

        <rect x="60" y="116" width="280" height="28" rx="4" fill="#fff" stroke="#ccc"/>
        <text x="72" y="135" font-size="10" fill="#aaa">Subject</text>

        <rect x="60" y="152" width="280" height="56" rx="4" fill="#fff" stroke="#ccc"/>
        <text x="72" y="172" font-size="10" fill="#aaa">Message *</text>

        <rect x="60" y="218" width="100" height="30" rx="15" fill="#333"/>
        <text x="110" y="238" text-anchor="middle" font-size="11" fill="#fff">Send</text>
        """,
    },
    "IP Redirection": {
        "title": "IP Redirection",
        "body": """
        <circle cx="150" cy="130" r="50" fill="none" stroke="#7799cc" stroke-width="2"/>
        <ellipse cx="150" cy="130" rx="50" ry="20" fill="none" stroke="#7799cc" stroke-width="1" stroke-dasharray="4"/>
        <line x1="150" y1="80" x2="150" y2="180" stroke="#7799cc" stroke-width="1" stroke-dasharray="4"/>
        <text x="150" y="135" text-anchor="middle" font-size="20">🌍</text>

        <line x1="210" y1="120" x2="280" y2="100" stroke="#e74c3c" stroke-width="2" marker-end="url(#arrowhead)"/>
        <defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#e74c3c"/></marker></defs>

        <rect x="250" y="85" width="100" height="24" rx="4" fill="#fdecea"/>
        <text x="300" y="101" text-anchor="middle" font-size="10" fill="#c0392b">→ store.co.uk</text>
        <rect x="250" y="115" width="100" height="24" rx="4" fill="#e8f4e8"/>
        <text x="300" y="131" text-anchor="middle" font-size="10" fill="#27ae60">→ store.com</text>

        <text x="200" y="210" text-anchor="middle" font-size="11" fill="#999">Redirect visitors by region via IP</text>
        """,
    },
    "Videos Slider": {
        "title": "Videos Slider",
        "body": """
        <rect x="20" y="65" width="100" height="130" rx="6" fill="#e0e8f0" stroke="#99b"/>
        <polygon points="55,115 55,145 80,130" fill="#7799cc"/>
        <rect x="130" y="65" width="100" height="130" rx="6" fill="#e8e0f0" stroke="#99b"/>
        <rect x="155" y="95" width="50" height="30" rx="2" fill="#ccc"/>
        <rect x="240" y="65" width="100" height="130" rx="6" fill="#e0f0e8" stroke="#99b"/>
        <polygon points="275,115 275,145 300,130" fill="#7799cc"/>
        <rect x="350" y="65" width="50" height="130" rx="6" fill="#eee" opacity="0.5"/>

        <text x="30" y="118" font-size="22" fill="#99b">‹</text>
        <text x="355" y="118" font-size="22" fill="#99b">›</text>
        <text x="200" y="220" text-anchor="middle" font-size="11" fill="#999">∞ infinite carousel — images + videos</text>
        """,
    },
    "Video Slider": {
        "title": "Video Slider",
        "body": """
        <text x="200" y="60" text-anchor="middle" font-size="14" fill="#333" font-weight="600">Featured Videos</text>
        <rect x="20" y="75" width="115" height="80" rx="4" fill="#e8e8e8" stroke="#ccc"/>
        <polygon points="60,100 60,130 85,115" fill="#999"/>
        <rect x="143" y="75" width="115" height="80" rx="4" fill="#e8e8e8" stroke="#ccc"/>
        <polygon points="183,100 183,130 208,115" fill="#999"/>
        <rect x="266" y="75" width="115" height="80" rx="4" fill="#e8e8e8" stroke="#ccc"/>
        <polygon points="306,100 306,130 331,115" fill="#999"/>

        <circle cx="186" cy="175" r="4" fill="#ccc"/>
        <circle cx="200" cy="175" r="4" fill="#555"/>
        <circle cx="214" cy="175" r="4" fill="#ccc"/>
        <text x="35" y="120" font-size="18" fill="#bbb">‹</text>
        <text x="370" y="120" font-size="18" fill="#bbb">›</text>
        <text x="200" y="210" text-anchor="middle" font-size="10" fill="#aaa">Swiper.js powered</text>
        """,
    },
    "Hero Slider (rocklss)": {
        "title": "Hero Slider",
        "body": """
        <rect x="20" y="50" width="360" height="170" rx="6" fill="#2c3e50"/>
        <rect x="20" y="50" width="360" height="170" rx="6" fill="url(#heroGrad)" opacity="0.5"/>
        <defs><linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3498db" stop-opacity="0.4"/><stop offset="100%" stop-color="#2c3e50" stop-opacity="0.1"/></linearGradient></defs>
        <text x="200" y="115" text-anchor="middle" font-size="20" fill="#fff" font-weight="700">Hero Headline</text>
        <text x="200" y="140" text-anchor="middle" font-size="12" fill="#ccc">Subtitle text goes here</text>
        <rect x="155" y="155" width="90" height="28" rx="14" fill="#3498db"/>
        <text x="200" y="174" text-anchor="middle" font-size="11" fill="#fff">Shop Now</text>

        <text x="35" y="140" font-size="24" fill="rgba(255,255,255,0.5)">‹</text>
        <text x="365" y="140" font-size="24" fill="rgba(255,255,255,0.5)">›</text>
        <circle cx="186" cy="232" r="4" fill="#ccc"/>
        <circle cx="200" cy="232" r="4" fill="#555"/>
        <circle cx="214" cy="232" r="4" fill="#ccc"/>
        """,
    },
    "Image Gallery (BoldizArt)": {
        "title": "Image Gallery",
        "body": """
        <rect x="30" y="60" width="95" height="75" rx="4" fill="#e8ddd0" stroke="#ccc"/>
        <rect x="135" y="60" width="95" height="75" rx="4" fill="#d0dde8" stroke="#ccc"/>
        <rect x="240" y="60" width="95" height="75" rx="4" fill="#dde8d0" stroke="#ccc"/>
        <rect x="30" y="145" width="95" height="75" rx="4" fill="#e8d0dd" stroke="#ccc"/>
        <rect x="135" y="145" width="95" height="75" rx="4" fill="#d0e8dd" stroke="#ccc"/>
        <rect x="240" y="145" width="95" height="75" rx="4" fill="#ddd0e8" stroke="#ccc"/>

        <text x="77" y="102" text-anchor="middle" font-size="20" fill="#bbb">🖼</text>
        <text x="182" y="102" text-anchor="middle" font-size="20" fill="#bbb">🖼</text>
        <text x="287" y="102" text-anchor="middle" font-size="20" fill="#bbb">🖼</text>
        <text x="77" y="187" text-anchor="middle" font-size="20" fill="#bbb">🖼</text>
        <text x="182" y="187" text-anchor="middle" font-size="20" fill="#bbb">🖼</text>
        <text x="287" y="187" text-anchor="middle" font-size="20" fill="#bbb">🖼</text>
        """,
    },
    "Timeline (rocklss)": {
        "title": "Timeline",
        "body": """
        <line x1="200" y1="55" x2="200" y2="245" stroke="#ddd" stroke-width="2"/>
        <circle cx="200" cy="80" r="8" fill="#3498db"/>
        <rect x="220" y="66" width="130" height="28" rx="4" fill="#f0f7ff" stroke="#b3d4f7"/>
        <text x="232" y="84" font-size="10" fill="#555">2024 — Founded</text>

        <circle cx="200" cy="130" r="8" fill="#2ecc71"/>
        <rect x="50" y="116" width="130" height="28" rx="4" fill="#f0fff0" stroke="#b3e6b3"/>
        <text x="62" y="134" font-size="10" fill="#555">2023 — First launch</text>

        <circle cx="200" cy="180" r="8" fill="#e74c3c"/>
        <rect x="220" y="166" width="130" height="28" rx="4" fill="#fff0f0" stroke="#f7b3b3"/>
        <text x="232" y="184" font-size="10" fill="#555">2022 — 10k users</text>

        <circle cx="200" cy="230" r="8" fill="#f39c12"/>
        <rect x="50" y="216" width="130" height="28" rx="4" fill="#fff8f0" stroke="#f7d9b3"/>
        <text x="62" y="234" font-size="10" fill="#555">2021 — Prototype</text>
        """,
    },
    "Tooltips": {
        "title": "Tooltips",
        "body": """
        <rect x="100" y="60" width="200" height="150" rx="8" fill="#f5f5f5" stroke="#ddd"/>
        <text x="200" y="140" text-anchor="middle" font-size="28" fill="#ccc">👕</text>
        <text x="200" y="225" text-anchor="middle" font-size="12" fill="#555">Product Image</text>

        <circle cx="160" cy="100" r="10" fill="#3498db" stroke="#fff" stroke-width="2"/>
        <text x="160" y="104" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">1</text>
        <rect x="90" y="70" width="60" height="20" rx="4" fill="#333"/>
        <text x="120" y="84" text-anchor="middle" font-size="9" fill="#fff">Organic</text>
        <polygon points="118,90 122,90 120,95" fill="#333"/>

        <circle cx="240" cy="130" r="10" fill="#e74c3c" stroke="#fff" stroke-width="2"/>
        <text x="240" y="134" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">2</text>
        <rect x="255" y="120" width="80" height="20" rx="4" fill="#333"/>
        <text x="295" y="134" text-anchor="middle" font-size="9" fill="#fff">100% Cotton</text>
        <polygon points="257,130 253,128 253,132" fill="#333"/>
        """,
    },
    "Pricing Table (rocklss)": {
        "title": "Pricing Table",
        "body": """
        <rect x="25" y="55" width="105" height="175" rx="6" fill="#fafafa" stroke="#ddd"/>
        <text x="77" y="80" text-anchor="middle" font-size="12" fill="#666" font-weight="600">Basic</text>
        <text x="77" y="105" text-anchor="middle" font-size="22" fill="#333" font-weight="700">$9</text>
        <text x="77" y="118" text-anchor="middle" font-size="9" fill="#999">/month</text>
        <rect x="45" y="130" width="65" height="6" rx="2" fill="#eee"/>
        <rect x="45" y="142" width="55" height="6" rx="2" fill="#eee"/>
        <rect x="45" y="154" width="60" height="6" rx="2" fill="#eee"/>
        <rect x="45" y="195" width="65" height="24" rx="12" fill="#ddd"/>
        <text x="77" y="211" text-anchor="middle" font-size="10" fill="#666">Choose</text>

        <rect x="148" y="45" width="105" height="195" rx="6" fill="#3498db" stroke="#2980b9"/>
        <text x="200" y="70" text-anchor="middle" font-size="12" fill="#fff" font-weight="600">Pro ⭐</text>
        <text x="200" y="98" text-anchor="middle" font-size="22" fill="#fff" font-weight="700">$29</text>
        <text x="200" y="111" text-anchor="middle" font-size="9" fill="#ddeeff">/month</text>
        <rect x="168" y="125" width="65" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="168" y="137" width="55" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="168" y="149" width="60" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="168" y="161" width="50" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="168" y="200" width="65" height="24" rx="12" fill="#fff"/>
        <text x="200" y="216" text-anchor="middle" font-size="10" fill="#3498db" font-weight="600">Choose</text>

        <rect x="270" y="55" width="105" height="175" rx="6" fill="#fafafa" stroke="#ddd"/>
        <text x="322" y="80" text-anchor="middle" font-size="12" fill="#666" font-weight="600">Team</text>
        <text x="322" y="105" text-anchor="middle" font-size="22" fill="#333" font-weight="700">$79</text>
        <text x="322" y="118" text-anchor="middle" font-size="9" fill="#999">/month</text>
        <rect x="290" y="130" width="65" height="6" rx="2" fill="#eee"/>
        <rect x="290" y="142" width="55" height="6" rx="2" fill="#eee"/>
        <rect x="290" y="154" width="60" height="6" rx="2" fill="#eee"/>
        <rect x="290" y="195" width="65" height="24" rx="12" fill="#ddd"/>
        <text x="322" y="211" text-anchor="middle" font-size="10" fill="#666">Choose</text>
        """,
    },
    "Marquee Products": {
        "title": "Marquee Products",
        "body": """
        <rect x="10" y="70" width="80" height="100" rx="6" fill="#f5f0eb" stroke="#ddd"/>
        <rect x="20" y="80" width="60" height="50" rx="3" fill="#e8ddd0"/>
        <rect x="20" y="138" width="50" height="6" rx="2" fill="#ddd"/>
        <text x="20" y="157" font-size="10" fill="#999">$29</text>

        <rect x="100" y="70" width="80" height="100" rx="6" fill="#ebf0f5" stroke="#ddd"/>
        <rect x="110" y="80" width="60" height="50" rx="3" fill="#d0dde8"/>
        <rect x="110" y="138" width="50" height="6" rx="2" fill="#ddd"/>
        <text x="110" y="157" font-size="10" fill="#999">$49</text>

        <rect x="190" y="70" width="80" height="100" rx="6" fill="#f0f5eb" stroke="#ddd"/>
        <rect x="200" y="80" width="60" height="50" rx="3" fill="#dde8d0"/>
        <rect x="200" y="138" width="50" height="6" rx="2" fill="#ddd"/>
        <text x="200" y="157" font-size="10" fill="#999">$19</text>

        <rect x="280" y="70" width="80" height="100" rx="6" fill="#f5ebf0" stroke="#ddd"/>
        <rect x="290" y="80" width="60" height="50" rx="3" fill="#e8d0dd"/>
        <rect x="290" y="138" width="50" height="6" rx="2" fill="#ddd"/>
        <text x="290" y="157" font-size="10" fill="#999">$39</text>

        <text x="15" y="200" font-size="11" fill="#aaa">◀ marquee scrolling ▶</text>
        <text x="200" y="230" text-anchor="middle" font-size="10" fill="#bbb">pauses on hover</text>
        """,
    },
    "YouTube Section": {
        "title": "YouTube Section",
        "body": """
        <rect x="40" y="55" width="320" height="180" rx="8" fill="#111"/>
        <rect x="155" y="120" width="90" height="50" rx="10" fill="#e74c3c"/>
        <polygon points="188,135 188,160 213,148" fill="#fff"/>
        <text x="200" y="252" text-anchor="middle" font-size="11" fill="#999">Embedded YouTube video</text>
        """,
    },
    "Pagination With Numbers": {
        "title": "Pagination With Numbers",
        "body": """
        <text x="200" y="100" text-anchor="middle" font-size="12" fill="#666">Page 3 of 8</text>
        <rect x="68" y="120" width="32" height="32" rx="4" fill="#eee" stroke="#ccc"/>
        <text x="84" y="141" text-anchor="middle" font-size="13" fill="#999">‹</text>
        <rect x="108" y="120" width="32" height="32" rx="4" fill="#eee" stroke="#ccc"/>
        <text x="124" y="141" text-anchor="middle" font-size="12" fill="#666">1</text>
        <rect x="148" y="120" width="32" height="32" rx="4" fill="#eee" stroke="#ccc"/>
        <text x="164" y="141" text-anchor="middle" font-size="12" fill="#666">2</text>
        <rect x="188" y="120" width="32" height="32" rx="4" fill="#333"/>
        <text x="204" y="141" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">3</text>
        <rect x="228" y="120" width="32" height="32" rx="4" fill="#eee" stroke="#ccc"/>
        <text x="244" y="141" text-anchor="middle" font-size="12" fill="#666">4</text>
        <rect x="268" y="120" width="32" height="32" rx="4" fill="#eee" stroke="#ccc"/>
        <text x="284" y="141" text-anchor="middle" font-size="12" fill="#666">…</text>
        <rect x="308" y="120" width="32" height="32" rx="4" fill="#eee" stroke="#ccc"/>
        <text x="324" y="141" text-anchor="middle" font-size="13" fill="#999">›</text>

        <text x="200" y="185" text-anchor="middle" font-size="11" fill="#bbb">Numbered pagination snippet</text>
        """,
    },
    "Fancy Slick Carousel": {
        "title": "Fancy Slick Carousel",
        "body": """
        <rect x="20" y="50" width="360" height="170" rx="6" fill="#34495e"/>
        <rect x="20" y="50" width="360" height="170" rx="6" fill="url(#slickGrad)" opacity="0.6"/>
        <defs><linearGradient id="slickGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(0,0,0,0.7)"/></linearGradient></defs>

        <text x="200" y="120" text-anchor="middle" font-size="18" fill="#fff" font-weight="700">Summer Collection</text>
        <text x="200" y="142" text-anchor="middle" font-size="11" fill="#ccc">Up to 50% off — limited time</text>
        <rect x="155" y="155" width="90" height="26" rx="13" fill="#e74c3c"/>
        <text x="200" y="173" text-anchor="middle" font-size="10" fill="#fff">Shop Now →</text>

        <rect x="20" y="220" width="120" height="3" rx="1" fill="#eee"/>
        <rect x="20" y="220" width="40" height="3" rx="1" fill="#e74c3c"/>
        <text x="200" y="245" text-anchor="middle" font-size="10" fill="#bbb">Slick carousel with progress bar</text>
        """,
    },
    "Collection Page Swatches": {
        "title": "Collection Page Swatches",
        "body": """
        <rect x="50" y="55" width="120" height="120" rx="6" fill="#f0f0f0" stroke="#ddd"/>
        <text x="110" y="120" text-anchor="middle" font-size="28" fill="#ccc">👕</text>
        <text x="110" y="195" text-anchor="middle" font-size="11" fill="#555">Classic T-Shirt</text>
        <text x="110" y="210" text-anchor="middle" font-size="10" fill="#999">$29.00</text>
        <circle cx="82" cy="225" r="8" fill="#2c3e50" stroke="#aaa" stroke-width="2"/>
        <circle cx="102" cy="225" r="8" fill="#e74c3c" stroke="#aaa" stroke-width="1"/>
        <circle cx="122" cy="225" r="8" fill="#3498db" stroke="#aaa" stroke-width="1"/>
        <circle cx="142" cy="225" r="8" fill="#f1c40f" stroke="#aaa" stroke-width="1"/>

        <rect x="220" y="55" width="120" height="120" rx="6" fill="#f0f0f0" stroke="#ddd"/>
        <text x="280" y="120" text-anchor="middle" font-size="28" fill="#ccc">👟</text>
        <text x="280" y="195" text-anchor="middle" font-size="11" fill="#555">Running Shoes</text>
        <text x="280" y="210" text-anchor="middle" font-size="10" fill="#999">$89.00</text>
        <circle cx="262" cy="225" r="8" fill="#222" stroke="#aaa" stroke-width="2"/>
        <circle cx="282" cy="225" r="8" fill="#ecf0f1" stroke="#aaa" stroke-width="1"/>
        """,
    },
    "Double Block Section": {
        "title": "Double Block Section",
        "body": """
        <rect x="25" y="60" width="240" height="160" rx="6" fill="#e0e8f0" stroke="#b0c4de"/>
        <text x="145" y="145" text-anchor="middle" font-size="14" fill="#667" font-weight="500">3/4 Block</text>
        <text x="145" y="165" text-anchor="middle" font-size="10" fill="#999">Main image / content</text>

        <rect x="275" y="60" width="100" height="160" rx="6" fill="#f0e8e0" stroke="#deb887"/>
        <text x="325" y="145" text-anchor="middle" font-size="12" fill="#876" font-weight="500">1/4</text>
        <text x="325" y="162" text-anchor="middle" font-size="9" fill="#999">Side</text>
        """,
    },
    "Quiz": {
        "title": "Quiz",
        "body": """
        <text x="200" y="60" text-anchor="middle" font-size="14" fill="#333" font-weight="600">Find Your Perfect Product</text>
        <text x="200" y="80" text-anchor="middle" font-size="11" fill="#888">Question 2 of 4</text>
        <rect x="80" y="88" width="240" height="3" rx="1" fill="#eee"/>
        <rect x="80" y="88" width="120" height="3" rx="1" fill="#3498db"/>

        <text x="200" y="115" text-anchor="middle" font-size="13" fill="#444">What's your skin type?</text>

        <rect x="60" y="130" width="130" height="38" rx="6" fill="#fff" stroke="#3498db" stroke-width="1.5"/>
        <text x="125" y="154" text-anchor="middle" font-size="11" fill="#3498db">Oily</text>
        <rect x="210" y="130" width="130" height="38" rx="6" fill="#3498db"/>
        <text x="275" y="154" text-anchor="middle" font-size="11" fill="#fff" font-weight="600">Dry ✓</text>
        <rect x="60" y="178" width="130" height="38" rx="6" fill="#fff" stroke="#ddd"/>
        <text x="125" y="202" text-anchor="middle" font-size="11" fill="#666">Combination</text>
        <rect x="210" y="178" width="130" height="38" rx="6" fill="#fff" stroke="#ddd"/>
        <text x="275" y="202" text-anchor="middle" font-size="11" fill="#666">Sensitive</text>

        <rect x="145" y="228" width="110" height="28" rx="14" fill="#333"/>
        <text x="200" y="247" text-anchor="middle" font-size="11" fill="#fff">Next →</text>
        """,
    },
    "App Optimization": {
        "title": "App Optimization",
        "body": """
        <text x="200" y="60" text-anchor="middle" font-size="11" fill="#666">JavaScript Bundle Size</text>
        <rect x="50" y="80" width="140" height="14" rx="3" fill="#e74c3c" opacity="0.8"/>
        <text x="195" y="91" font-size="10" fill="#c0392b" font-weight="600">679 KB</text>
        <text x="250" y="91" font-size="9" fill="#999">Unoptimized</text>

        <rect x="50" y="104" width="60" height="14" rx="3" fill="#27ae60" opacity="0.8"/>
        <text x="115" y="115" font-size="10" fill="#1e8449" font-weight="600">291 KB</text>
        <text x="170" y="115" font-size="9" fill="#999">Optimized ✓</text>

        <text x="200" y="150" text-anchor="middle" font-size="11" fill="#666">Loading Strategy</text>
        <rect x="50" y="160" width="300" height="28" rx="4" fill="#f0fff0" stroke="#b3e6b3"/>
        <text x="200" y="179" text-anchor="middle" font-size="10" fill="#555">✓ Load on interaction (lazy)</text>
        <rect x="50" y="194" width="300" height="28" rx="4" fill="#fff0f0" stroke="#f7b3b3"/>
        <text x="200" y="213" text-anchor="middle" font-size="10" fill="#555">✗ Block entirely on this page</text>
        """,
    },
    "Section Lab/How To Use": {
        "title": "How To Use",
        "body": """
        <circle cx="60" cy="85" r="16" fill="#EEEFE8"/>
        <text x="60" y="90" text-anchor="middle" font-size="14" fill="#272E0F" font-weight="700">1</text>
        <text x="85" y="90" font-size="12" fill="#272E0F" font-weight="700">CLEANSE</text>
        <rect x="85" y="100" width="250" height="6" rx="2" fill="#eee"/>

        <circle cx="60" cy="140" r="16" fill="#EEEFE8"/>
        <text x="60" y="145" text-anchor="middle" font-size="14" fill="#272E0F" font-weight="700">2</text>
        <text x="85" y="145" font-size="12" fill="#272E0F" font-weight="700">APPLY SERUM</text>
        <rect x="85" y="155" width="220" height="6" rx="2" fill="#eee"/>

        <circle cx="60" cy="195" r="16" fill="#EEEFE8"/>
        <text x="60" y="200" text-anchor="middle" font-size="14" fill="#272E0F" font-weight="700">3</text>
        <text x="85" y="200" font-size="12" fill="#272E0F" font-weight="700">MOISTURIZE</text>
        <rect x="85" y="210" width="180" height="6" rx="2" fill="#eee"/>
        """,
    },
    "Section Lab/Real Results": {
        "title": "Real Results",
        "body": """
        <text x="200" y="58" text-anchor="middle" font-size="14" fill="#333" font-weight="600">Real Results</text>
        <rect x="30" y="70" width="105" height="150" rx="8" fill="#fdf8f0" stroke="#e8ddd0"/>
        <circle cx="82" cy="105" r="22" fill="#e8ddd0"/>
        <text x="82" y="110" text-anchor="middle" font-size="16">👩</text>
        <rect x="50" y="135" width="65" height="6" rx="2" fill="#ddd"/>
        <text x="82" y="155" text-anchor="middle" font-size="9" fill="#999">★★★★★</text>
        <rect x="45" y="165" width="75" height="6" rx="2" fill="#eee"/>
        <rect x="50" y="177" width="60" height="6" rx="2" fill="#eee"/>
        <rect x="45" y="189" width="70" height="6" rx="2" fill="#eee"/>

        <rect x="148" y="70" width="105" height="150" rx="8" fill="#f0f8fd" stroke="#d0dde8"/>
        <circle cx="200" cy="105" r="22" fill="#d0dde8"/>
        <text x="200" y="110" text-anchor="middle" font-size="16">👨</text>
        <rect x="168" y="135" width="65" height="6" rx="2" fill="#ddd"/>
        <text x="200" y="155" text-anchor="middle" font-size="9" fill="#999">★★★★☆</text>
        <rect x="163" y="165" width="75" height="6" rx="2" fill="#eee"/>
        <rect x="168" y="177" width="60" height="6" rx="2" fill="#eee"/>

        <rect x="266" y="70" width="105" height="150" rx="8" fill="#f0fdf0" stroke="#d0e8d0"/>
        <circle cx="318" cy="105" r="22" fill="#d0e8d0"/>
        <text x="318" y="110" text-anchor="middle" font-size="16">👩</text>
        <rect x="286" y="135" width="65" height="6" rx="2" fill="#ddd"/>
        <text x="318" y="155" text-anchor="middle" font-size="9" fill="#999">★★★★★</text>
        <rect x="281" y="165" width="75" height="6" rx="2" fill="#eee"/>
        <rect x="286" y="177" width="60" height="6" rx="2" fill="#eee"/>
        """,
    },
    "Section Lab/Frequently Bought Together": {
        "title": "Frequently Bought Together",
        "body": """
        <text x="200" y="55" text-anchor="middle" font-size="13" fill="#333" font-weight="600">Frequently Bought Together</text>
        <rect x="30" y="70" width="90" height="90" rx="6" fill="#f0f0f0" stroke="#ddd"/>
        <text x="75" y="120" text-anchor="middle" font-size="20" fill="#ccc">🧴</text>
        <text x="75" y="175" text-anchor="middle" font-size="9" fill="#555">Serum</text>
        <text x="75" y="188" text-anchor="middle" font-size="10" fill="#333" font-weight="600">$35</text>

        <text x="140" y="120" text-anchor="middle" font-size="20" fill="#999">+</text>

        <rect x="155" y="70" width="90" height="90" rx="6" fill="#f0f0f0" stroke="#ddd"/>
        <text x="200" y="120" text-anchor="middle" font-size="20" fill="#ccc">🧴</text>
        <text x="200" y="175" text-anchor="middle" font-size="9" fill="#555">Moisturizer</text>
        <text x="200" y="188" text-anchor="middle" font-size="10" fill="#333" font-weight="600">$28</text>

        <text x="265" y="120" text-anchor="middle" font-size="20" fill="#999">+</text>

        <rect x="280" y="70" width="90" height="90" rx="6" fill="#f0f0f0" stroke="#ddd"/>
        <text x="325" y="120" text-anchor="middle" font-size="20" fill="#ccc">🧴</text>
        <text x="325" y="175" text-anchor="middle" font-size="9" fill="#555">Cleanser</text>
        <text x="325" y="188" text-anchor="middle" font-size="10" fill="#333" font-weight="600">$22</text>

        <rect x="100" y="205" width="200" height="30" rx="15" fill="#333"/>
        <text x="200" y="225" text-anchor="middle" font-size="11" fill="#fff">Add All — $85</text>
        """,
    },
    "Section Lab/UGC Videos Homepage": {
        "title": "UGC Videos Homepage",
        "body": """
        <text x="200" y="55" text-anchor="middle" font-size="14" fill="#333" font-weight="600">Customer Videos</text>
        <rect x="20" y="65" width="85" height="140" rx="8" fill="#1a1a2e" stroke="#333"/>
        <polygon points="50,120 50,150 72,135" fill="rgba(255,255,255,0.7)"/>
        <rect x="115" y="65" width="85" height="140" rx="8" fill="#16213e" stroke="#333"/>
        <polygon points="145,120 145,150 167,135" fill="rgba(255,255,255,0.7)"/>
        <rect x="210" y="65" width="85" height="140" rx="8" fill="#1a1a2e" stroke="#333"/>
        <polygon points="240,120 240,150 262,135" fill="rgba(255,255,255,0.7)"/>
        <rect x="305" y="65" width="85" height="140" rx="8" fill="#16213e" stroke="#333"/>
        <polygon points="335,120 335,150 357,135" fill="rgba(255,255,255,0.7)"/>
        <text x="200" y="230" text-anchor="middle" font-size="10" fill="#999">UGC video carousel</text>
        """,
    },
    "Section Lab/Payment Icons": {
        "title": "Payment Icons",
        "body": """
        <text x="200" y="100" text-anchor="middle" font-size="12" fill="#666">Accepted Payment Methods</text>
        <rect x="52" y="115" width="50" height="30" rx="4" fill="#1a1f71"/>
        <text x="77" y="135" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">VISA</text>
        <rect x="112" y="115" width="50" height="30" rx="4" fill="#eb001b"/>
        <text x="137" y="135" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">Master</text>
        <rect x="172" y="115" width="50" height="30" rx="4" fill="#006fcf"/>
        <text x="197" y="135" text-anchor="middle" font-size="7" fill="#fff" font-weight="700">AMEX</text>
        <rect x="232" y="115" width="50" height="30" rx="4" fill="#003087"/>
        <text x="257" y="135" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">PayPal</text>
        <rect x="292" y="115" width="50" height="30" rx="4" fill="#5a31f4"/>
        <text x="317" y="135" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">Shop</text>

        <text x="200" y="175" text-anchor="middle" font-size="10" fill="#aaa">Configurable icon blocks</text>
        """,
    },
    "Section Lab/Native Video Slider": {
        "title": "Native Video Slider",
        "body": """
        <rect x="30" y="60" width="150" height="150" rx="8" fill="#1a1a2e" stroke="#333"/>
        <polygon points="85,115 85,155 115,135" fill="rgba(255,255,255,0.7)"/>
        <text x="105" y="195" text-anchor="middle" font-size="9" fill="#999">Active</text>

        <rect x="195" y="75" width="80" height="120" rx="6" fill="#222" opacity="0.6"/>
        <polygon points="222,120 222,145 240,132" fill="rgba(255,255,255,0.4)"/>

        <rect x="290" y="75" width="80" height="120" rx="6" fill="#222" opacity="0.4"/>
        <polygon points="317,120 317,145 335,132" fill="rgba(255,255,255,0.3)"/>

        <text x="200" y="235" text-anchor="middle" font-size="10" fill="#999">Shopify-hosted videos — no external URLs</text>
        """,
    },
    "Section Lab/Nudges Widget": {
        "title": "Sales Nudge Widget",
        "body": """
        <rect x="20" y="50" width="360" height="180" rx="4" fill="#fafafa" stroke="#eee"/>
        <text x="200" y="130" text-anchor="middle" font-size="14" fill="#ccc">Your Store Page</text>

        <rect x="200" y="180" width="180" height="48" rx="8" fill="#333" stroke="#555"/>
        <circle cx="220" cy="204" r="12" fill="#f39c12"/>
        <text x="220" y="209" text-anchor="middle" font-size="12" fill="#fff">🔥</text>
        <text x="248" y="199" font-size="10" fill="#fff" font-weight="600">Sarah just bought</text>
        <text x="248" y="213" font-size="9" fill="#ccc">Vitamin C Serum — 2 min ago</text>
        """,
    },
    "Section Lab/Face Proof Bubble": {
        "title": "Face Proof Bubble",
        "body": """
        <rect x="20" y="50" width="360" height="180" rx="4" fill="#fafafa" stroke="#eee"/>
        <text x="200" y="140" text-anchor="middle" font-size="14" fill="#ccc">Product Page</text>

        <circle cx="330" cy="200" r="28" fill="#f0e0d0" stroke="#ddd" stroke-width="2"/>
        <text x="330" y="205" text-anchor="middle" font-size="22">👩</text>
        <circle cx="348" cy="180" r="9" fill="#27ae60" stroke="#fff" stroke-width="2"/>
        <text x="348" y="184" text-anchor="middle" font-size="8" fill="#fff">✓</text>

        <text x="200" y="252" text-anchor="middle" font-size="10" fill="#999">Floating social-proof avatar bubble</text>
        """,
    },
    "Section Lab/Announcement Bar": {
        "title": "Announcement Bar",
        "body": """
        <rect x="0" y="70" width="400" height="50" fill="#1a1a2e"/>
        <text x="200" y="100" text-anchor="middle" font-size="13" fill="#fff" font-weight="500">🎉  FREE SHIPPING on orders over $50  •  Ends in 02:15:30</text>

        <rect x="0" y="130" width="400" height="130" fill="#f8f8f8" stroke="#eee"/>
        <text x="200" y="200" text-anchor="middle" font-size="14" fill="#ccc">Rest of page…</text>
        """,
    },
    "Section Lab/Delivery Countdown": {
        "title": "Delivery Countdown",
        "body": """
        <rect x="50" y="80" width="300" height="100" rx="8" fill="#f8fdf8" stroke="#d4edda"/>
        <text x="200" y="110" text-anchor="middle" font-size="12" fill="#155724" font-weight="600">🚚  Order within</text>
        <text x="200" y="140" text-anchor="middle" font-size="28" fill="#155724" font-weight="700">2h 34m</text>
        <text x="200" y="165" text-anchor="middle" font-size="12" fill="#155724">for delivery by <tspan font-weight="600">Tomorrow</tspan></text>
        """,
    },
    "Section Lab/Price Bubble Widget": {
        "title": "Price Bubble Widget",
        "body": """
        <rect x="40" y="50" width="200" height="180" rx="8" fill="#f5f5f5" stroke="#ddd"/>
        <text x="140" y="145" text-anchor="middle" font-size="28" fill="#ccc">🧴</text>
        <text x="140" y="245" text-anchor="middle" font-size="11" fill="#555">Product</text>

        <circle cx="290" cy="100" r="36" fill="#e74c3c"/>
        <text x="290" y="96" text-anchor="middle" font-size="10" fill="#fff">SAVE</text>
        <text x="290" y="113" text-anchor="middle" font-size="16" fill="#fff" font-weight="700">20%</text>

        <circle cx="310" cy="190" r="28" fill="#27ae60"/>
        <text x="310" y="194" text-anchor="middle" font-size="14" fill="#fff" font-weight="700">$29</text>
        """,
    },
    "Section Lab/Social Proof Video": {
        "title": "Social Proof Video",
        "body": """
        <rect x="40" y="50" width="200" height="180" rx="8" fill="#f5f5f5" stroke="#ddd"/>
        <text x="140" y="145" text-anchor="middle" font-size="28" fill="#ccc">🧴</text>
        <text x="140" y="245" text-anchor="middle" font-size="11" fill="#555">Product Page</text>

        <rect x="270" y="75" width="100" height="140" rx="50" fill="#1a1a2e" stroke="#333" stroke-width="2"/>
        <polygon points="305,130 305,160 328,145" fill="rgba(255,255,255,0.7)"/>
        <circle cx="320" cy="90" r="10" fill="#e74c3c"/>
        <text x="320" y="94" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">▶</text>
        """,
    },
    "Section Lab/Icon List": {
        "title": "Icon List",
        "body": """
        <rect x="30" y="72" width="50" height="50" rx="25" fill="#f0f7ff"/>
        <text x="55" y="103" text-anchor="middle" font-size="20">🚚</text>
        <text x="55" y="140" text-anchor="middle" font-size="9" fill="#555">Free Ship</text>

        <rect x="110" y="72" width="50" height="50" rx="25" fill="#fff0f0"/>
        <text x="135" y="103" text-anchor="middle" font-size="20">🔒</text>
        <text x="135" y="140" text-anchor="middle" font-size="9" fill="#555">Secure</text>

        <rect x="190" y="72" width="50" height="50" rx="25" fill="#f0fff0"/>
        <text x="215" y="103" text-anchor="middle" font-size="20">🌿</text>
        <text x="215" y="140" text-anchor="middle" font-size="9" fill="#555">Natural</text>

        <rect x="270" y="72" width="50" height="50" rx="25" fill="#fff8f0"/>
        <text x="295" y="103" text-anchor="middle" font-size="20">⭐</text>
        <text x="295" y="140" text-anchor="middle" font-size="9" fill="#555">Top Rated</text>

        <rect x="350" y="72" width="50" height="50" rx="25" fill="#f8f0ff"/>
        <text x="375" y="103" text-anchor="middle" font-size="20">🔄</text>
        <text x="375" y="140" text-anchor="middle" font-size="9" fill="#555">Returns</text>
        <text x="200" y="185" text-anchor="middle" font-size="10" fill="#aaa">Product trust icons strip</text>
        """,
    },
    "Section Lab/Before And After": {
        "title": "Before And After",
        "body": """
        <rect x="30" y="60" width="155" height="160" rx="8" fill="#fdf0f0" stroke="#f0c0c0"/>
        <text x="107" y="130" text-anchor="middle" font-size="11" fill="#c0392b" font-weight="600">BEFORE</text>
        <text x="107" y="155" text-anchor="middle" font-size="30" fill="#ddd">😐</text>

        <rect x="215" y="60" width="155" height="160" rx="8" fill="#f0fdf0" stroke="#c0f0c0"/>
        <text x="292" y="130" text-anchor="middle" font-size="11" fill="#27ae60" font-weight="600">AFTER</text>
        <text x="292" y="155" text-anchor="middle" font-size="30" fill="#ddd">😊</text>

        <circle cx="200" cy="140" r="16" fill="#333"/>
        <text x="200" y="145" text-anchor="middle" font-size="14" fill="#fff">↔</text>
        """,
    },
    "Section Lab/Story Navigation": {
        "title": "Story Navigation",
        "body": """
        <circle cx="60" cy="110" r="30" fill="none" stroke="url(#storyGrad)" stroke-width="3"/>
        <defs><linearGradient id="storyGrad"><stop offset="0%" stop-color="#f09433"/><stop offset="50%" stop-color="#e6683c"/><stop offset="100%" stop-color="#dc2743"/></linearGradient></defs>
        <circle cx="60" cy="110" r="25" fill="#f0e0d0"/>
        <text x="60" y="116" text-anchor="middle" font-size="18">👩</text>
        <text x="60" y="155" text-anchor="middle" font-size="9" fill="#555">Skincare</text>

        <circle cx="140" cy="110" r="30" fill="none" stroke="url(#storyGrad)" stroke-width="3"/>
        <circle cx="140" cy="110" r="25" fill="#d0e0f0"/>
        <text x="140" y="116" text-anchor="middle" font-size="18">🧴</text>
        <text x="140" y="155" text-anchor="middle" font-size="9" fill="#555">Body</text>

        <circle cx="220" cy="110" r="30" fill="none" stroke="#ddd" stroke-width="2"/>
        <circle cx="220" cy="110" r="25" fill="#e0f0d0"/>
        <text x="220" y="116" text-anchor="middle" font-size="18">💄</text>
        <text x="220" y="155" text-anchor="middle" font-size="9" fill="#555">Makeup</text>

        <circle cx="300" cy="110" r="30" fill="none" stroke="#ddd" stroke-width="2"/>
        <circle cx="300" cy="110" r="25" fill="#f0d0e0"/>
        <text x="300" y="116" text-anchor="middle" font-size="18">💅</text>
        <text x="300" y="155" text-anchor="middle" font-size="9" fill="#555">Nails</text>

        <text x="200" y="195" text-anchor="middle" font-size="10" fill="#aaa">Instagram-style story navigation</text>
        """,
    },
    "Section Lab/Scrolling Content": {
        "title": "Scrolling Content",
        "body": """
        <rect x="30" y="60" width="340" height="40" rx="4" fill="#f5f5f5" stroke="#ddd"/>
        <text x="200" y="85" text-anchor="middle" font-size="11" fill="#555">Section 1 — scrolls into view</text>
        <rect x="30" y="110" width="340" height="40" rx="4" fill="#e8f4e8" stroke="#b3d4b3"/>
        <text x="200" y="135" text-anchor="middle" font-size="11" fill="#555" font-weight="600">Section 2 — active / visible ✓</text>
        <rect x="30" y="160" width="340" height="40" rx="4" fill="#f5f5f5" stroke="#ddd"/>
        <text x="200" y="185" text-anchor="middle" font-size="11" fill="#555">Section 3 — scrolls into view</text>
        <rect x="30" y="210" width="340" height="40" rx="4" fill="#f5f5f5" stroke="#ddd"/>
        <text x="200" y="235" text-anchor="middle" font-size="11" fill="#999">Section 4</text>
        """,
    },
}

SVG_TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 270" width="400" height="270">
  <defs>
    <style>text {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }}</style>
  </defs>
  <rect width="400" height="270" rx="12" fill="#fff" stroke="#e0e0e0" stroke-width="1"/>
  <text x="200" y="30" text-anchor="middle" font-size="11" fill="#aaa" letter-spacing="1" text-transform="uppercase">{title}</text>
  <line x1="160" y1="38" x2="240" y2="38" stroke="#eee" stroke-width="1"/>
  {body}
</svg>"""

def main():
    base = "/workspace"
    for folder, data in SECTIONS.items():
        section_dir = os.path.join(base, folder)
        if not os.path.isdir(section_dir):
            print(f"SKIP (dir not found): {section_dir}")
            continue

        svg = SVG_TEMPLATE.format(title=data["title"], body=data["body"])
        out_path = os.path.join(section_dir, "preview.svg")
        with open(out_path, "w") as f:
            f.write(svg)
        print(f"OK: {out_path}")

if __name__ == "__main__":
    main()
