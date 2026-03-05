# Embedding applets-engine applets in PowerPoint / iSpring

This document explains how to host a transformation applet and embed it as a web object inside a PowerPoint slide or iSpring lesson.

Options to host the applet

1) GitHub Pages (quick, public)
- Push your `applets-engine` (or a built site) to a GitHub repo and enable Pages for the `gh-pages` branch or `/docs` folder.
- Example URL after publish:
  `https://<your-org>.github.io/applets-engine/activity/index.html?src=/applets/configs/golden.json`

2) Host on an internal web server
- Place the repo's `activity` and `engine` files on any static server (IIS, nginx, S3 static site, etc.).

3) Local dev (for testing only)
- Run Vite locally and use the dev URL. Note: remote learners won't reach your local machine.

Embedding in PowerPoint / iSpring

- PowerPoint (modern): Insert -> Online Video -> Use From a URL (some versions accept an iframe). For consistent results use iSpring's Web Object:
  - iSpring: Insert -> Web Object and supply the URL to the hosted `activity/index.html?src=...`.
  - The web object will load the applet inside the slide and can be sized to fit the graph.

Best practices
- Use a fully-qualified URL (https) when embedding in production.
- Keep activity JSON (the `?src=` target) in a stable location in your content repo so teachers can edit question content without touching engine code.
- If using GitHub Pages, prefer adding built/minified copies of the engine under a `docs/` folder and point `?src=` at `/docs/applets/configs/golden.json`.

Offline packaging for LMS / iSpring
- If you must create a self-contained package, you can export a small site bundle (copy `activity/*.html`, `engine/*.js`, `applets/configs/*.json`, and `activity/styles.css`) to a folder and host that folder inside your LMS or local webserver. iSpring's Web Object can point to an internal LMS URL.

Notes about cross-origin and embedding
- Ensure your hosting allows embedding (no `X-Frame-Options: DENY`). GitHub Pages and S3 typically allow embedding.
- If your server sets restrictive CSP or frame headers, configure it to allow embedding into your LMS or PowerPoint host.

If you'd like, I can:
- Add a small `build` script that copies a minimal set of files into `dist/` for easy hosting, or
- Create a `docs/` build for GitHub Pages and add a README with deployment instructions.

Which would you like next?"}