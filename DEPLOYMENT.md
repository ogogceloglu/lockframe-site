# Cloudflare Pages deployment (GitHub integration)

The site is live at https://lockframe.games through Cloudflare Pages, connected to
`ogogceloglu/lockframe-site` (`main`). These instructions document the existing setup
and how to reproduce it; normal updates deploy through GitHub pushes. No DNS change
is needed for content updates.

## 1. GitHub repository

The repository is `ogogceloglu/lockframe-site`. To connect an existing local checkout, push `main`:

```sh
git remote add origin https://github.com/ogogceloglu/lockframe-site.git
git push -u origin main
```

Cloudflare's GitHub App must be allowed to access this repository.

## 2. Create the Pages project

1. In Cloudflare, open **Workers & Pages** and choose **Create application → Pages → Connect to Git**.
2. Authorize the Cloudflare GitHub App for `lockframe-site` only, or include it in an existing
   installation.
3. Select the `lockframe-site` repository.
4. Use these build settings:

   - Production branch: `main`
   - Framework preset: `None`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leave empty
   - Environment variable: `NODE_VERSION=22`

5. Review `LEGAL_REVIEW.md`, run `npm run build` locally and inspect `dist/` before selecting
   **Save and Deploy**.

Connecting GitHub enables a deployment on pushes to the selected production branch and preview
deployments for configured preview branches. Configure branch controls before the first production
push if that behavior is not desired.

## 3. Custom domain — only when explicitly ready

After the `*.pages.dev` preview is approved, add the exact custom domain **lockframe.games** in the
Pages project's **Custom domains** screen. Follow the DNS records Cloudflare displays. Do not use
`lockframe.game`.

DNS changes are intentionally not included in this repository and must be performed manually by the
domain owner. Verify both the apex domain and HTTPS after Cloudflare marks the certificate active.

## 4. Production checks

Confirm all of the following after deployment:

- `https://lockframe.games/`
- `https://lockframe.games/tr/`
- `https://lockframe.games/privacy/` without login, cookie wall or ad scripts
- `https://lockframe.games/support/`
- `https://lockframe.games/app-ads.txt` returns plain text with HTTP 200
- language, canonical and alternate links resolve correctly
- security headers from `_headers` are present
- mobile layouts at 320 px, 390 px and tablet/desktop widths
- App Store badges use the owner-supplied listing URL and the site states the game is available

Finally, set the App Store Connect Privacy Policy URL to
`https://lockframe.games/privacy/`, the Support URL to `https://lockframe.games/support/`, and the
Developer Website to `https://lockframe.games/` only after the domain is live.

Cloudflare reference: <https://developers.cloudflare.com/pages/configuration/git-integration/>
