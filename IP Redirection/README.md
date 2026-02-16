# IP Redirection (Snippet)

Redirects visitors by continent (or region) using an IP geolocation API. Handy for regional stores or landing pages. Redirect is disabled when the theme customizer or preview bar is open.

**Category:** Snippets & Utilities  
**Source:** [patrickbolle/shopify-snippets](https://github.com/patrickbolle/shopify-snippets)  
**Last updated in library:** 2025-02-14

## Setup

1. Copy `snippets/ip-redirection.liquid` to your theme **snippets** folder.
2. Sign up for an IP API (e.g. [ipdata.co](https://ipdata.co)) and get an API key.
3. In the snippet, set `apiKey` and `redirectUrl`. Adjust continent lists (`uk_list`, `asia_list`) as needed.
4. Include in your theme layout (e.g. in `theme.liquid` before `</body>`): `{% render 'ip-redirection' %}`.

## Note

The snippet uses a vanilla JS fetch; no jQuery required. Replace the placeholder key and URL before use.

## License

MIT (see source repo).
