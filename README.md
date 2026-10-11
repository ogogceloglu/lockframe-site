# LOCKFRAME — official website

Production-ready static site for **LOCKFRAME: Perspective Run** at
[lockframe.games](https://lockframe.games).

The site is intentionally framework-free. It uses plain HTML and CSS, has no database, makes no
client-side network requests, and ships no JavaScript. English and Turkish are separate crawlable
routes. The Privacy Policy remains readable with JavaScript disabled and contains no cookie wall or
advertising code.

## Routes

| Route | Content |
|---|---|
| `/` | English landing page |
| `/tr/` | Turkish landing page |
| `/privacy/` | English Privacy Policy |
| `/privacy/tr/` | Turkish Privacy Policy |
| `/support/` | English support |
| `/support/tr/` | Turkish support |
| `/app-ads.txt` | Google authorized seller record |

## Local verification

Requires Node 20 or later; there are no npm dependencies.

```sh
npm run check
npm run build
npm run dev
```

Then open `http://127.0.0.1:4173`. After `npm run build`, the server previews `dist/`.

## App Store link

No App Store URL is invented or hidden in the site. When the public listing exists:

1. Replace the disabled `.store-button` span in `index.html` and `tr/index.html` with an anchor.
2. Use the exact public App Store URL from App Store Connect.
3. Remove the nearby `TODO(APP_STORE_URL)` comment.
4. Run `npm run check` and test the link on a real device.

## Asset provenance

The app icon, Barlow fonts and the three gameplay captures were copied from the local `LockFrame`
game repository. The screenshots were resized and JPEG-compressed for the web; the original Unity
assets were not modified. See `THIRD_PARTY_NOTICES.md` for the font license.

## Important release reviews

Read `LEGAL_REVIEW.md` before publishing the site or submitting the game. It records claims checked
against the current game/backend code and the legal or production facts that still need owner or
counsel confirmation.

Deployment is documented in `DEPLOYMENT.md`. Nothing in this repository changes DNS or performs a
deployment.

