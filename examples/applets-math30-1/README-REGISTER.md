# Registering content activities (example)

This document shows how the engine will import a content-provided registration module at runtime.

Behavior implemented in the engine:
- `activity/app.js` attempts to dynamically import `/examples/applets-math30-1/register-transformations.mjs` before calling `createAppState`.
- If the file exists, it should import the module which calls `registerActivity(...)` on the engine's registry.

Example files in this repo:
- `examples/applets-math30-1/activities/transformations.js` - content-side transformations activity.
- `examples/applets-math30-1/register-transformations.mjs` - registers the activity with the engine.

How to test locally:
1. Start the dev server at the repository root:

```powershell
npm install
npm run dev
```

2. Open the transform example (the golden config) in your browser:

http://localhost:5173/activity/index.html?src=/engine/config/golden.json

You should see the activity load as before. The engine will try to import the registration file and use the content-provided `transformations` activity if present.

If you'd like the content repo to register additional validators, you can call the engine's `registerValidator` function from a similar registration module.
