# applets-math30-1 (example)

This folder shows a minimal layout for a content repo that consumes `applets-engine` from the parent repository for local development.

Options to consume the engine:

1) Local file dependency (fast)

- In this example `package.json` uses:

  "applets-engine": "file:../../"

- From this folder run:

```powershell
npm install
npm run dev
```

Then open a local activity page that references a config JSON provided by the engine (or copy configs here):

http://localhost:5173/activity/index.html?src=/engine/config/golden.json

2) npm link (alternate)

```powershell
# in engine repo (root)
npm link
# in this example folder
npm link applets-engine
npm install
npm run dev
```

Notes:
- In a real separate repo, prefer publishing `applets-engine` to a private registry or using a monorepo/workspace.
- This example is intentionally minimal and demonstrates the dependency wiring only.
