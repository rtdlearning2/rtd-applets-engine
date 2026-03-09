# Applet Authoring Guide

How to create a new transformation applet from a math education image.

---

## 1. Config File Location & Naming

Place configs in:
```
applets/configs/applet-{N}-{description}.json
```
Examples: `applet-5-reflect-x.json`, `applet-6-reflect-y-curve.json`

---

## 2. Top-Level Structure

All applets use the `pages` array format:

```json
{
  "schemaVersion": "1",
  "title": "Human-readable title",
  "pages": [
    {
      "type": "applet",
      "showProgress": false,
      "showTitle": false,
      "showFooter": false,
      ...applet fields...
    }
  ]
}
```

`showProgress`, `showTitle`, `showFooter` must all be `false` — the applet renders its own heading and toolbar.

---

## 3. Applet Page Fields

### `grid`
Coordinate bounds of the graph. Match the axes shown in the image.
```json
"grid": { "xmin": -6, "xmax": 6, "ymin": -6, "ymax": 6 }
```
- Use symmetric ranges (e.g. -9 to 9) when the reflected curve needs room on both sides.
- For y-axis reflections: the domain of the original curve is `[0, N]`, so the grid x-range needs to cover `[-N, N]`.

### `interaction`
```json
"interaction": { "mode": "placePoints", "snapStep": 1, "hitRadiusPx": 20 }
```
Always `placePoints` for transformation applets.

### `original`

**Piecewise-linear (connect-the-dots):**
```json
"original": {
  "points": [[-5, -3], [-1, -1], [0, -1], [3, 2], [6, -4]],
  "connectLines": true
}
```

**Continuous curve + key points:**
```json
"original": {
  "curve": { "fn": "sqrt(x) - 2", "domain": [0, 9] },
  "points": [[0, -2], [1, -1], [4, 0], [9, 1]]
}
```
`fn` uses: `sqrt()`, `abs()`, `sin()`, `cos()`, `tan()`, `log()`, `ln()`, `^` (power).
`points` are the labelled key points shown on the original graph.

### `transform`
```json
"transform": { "type": "reflect_x" }               // y → -y  (vertical, mirrors over x-axis)
"transform": { "type": "reflect_y" }               // x → -x  (horizontal, mirrors over y-axis)
"transform": { "type": "scale", "sx": 2, "sy": 1 } // (x,y)→(2x,y) horizontal stretch by 2
"transform": { "type": "scale", "sx": 1, "sy": 2 } // (x,y)→(x,2y) vertical stretch by 2
"transform": { "type": "translate", "dx": 3, "dy": -2 }
"transform": { "type": "rotate", "angle": 90, "pivot": [0, 0] }
"transform": { "type": "dilate", "k": 2, "pivot": [0, 0] }
```

**Expected points are auto-computed** from `original.points` + `transform` by the activity module. You do not write them manually.

For a new transform type not listed above, see **Section 9 — Activity Modules**.

### `activity`
Always the same for transformation applets:
```json
"activity": {
  "type": "transformations",
  "activityModule": "../activities/transformations.js",
  "config": { "tolerance": 0, "requireExactCount": true }
}
```

### `feedback`
```json
"feedback": { "showExpectedPointsOnFail": false }
```

---

## 4. The `applet` Object

```json
"applet": {
  "heading": "Reflection in the x-axis",
  "progressLabel": "Exploration 3 of 8",
  "graphLabels": {
    "original": "y = f(x)",
    "transformed": "y = g(x)"
  },
  "steps": [ ...3 steps... ]
}
```

`progressLabel` comes from the image (e.g. "Exploration 4 of 8").
`graphLabels.transformed` changes per applet (g(x), h(x), etc.) — read from the image.

---

## 5. Step Types

Applets typically have 3–4 steps. The renderer supports any number. Common patterns:
- **Transformation:** Q1 `graph-plot` → Q2 `drag-drop-sentences` (direction) → Q3 `drag-drop-mapping` (mapping rule) → Q4 `drag-drop-sentences` (invariant point)
- **Quadratic-shift / function exploration:** Q1 `table-input` → Q2 `drag-drop-sentences` (domain/range) → Q3 `graph-plot` (interactive, plots shifted curve)

See **Section 10** for the quadratic-shift pattern details and **Section 11** for a complete worked example.

### Step type: `graph-plot`

```json
{
  "id": "q1",
  "type": "graph-plot",
  "questionLabel": "Question 1 (of 3)",
  "instructions": "...HTML from image...",
  "successMessage": "CORRECT - Your graph is bang on!",
  "explanation": "<p>...HTML explanation shown after correct submit...</p>",
  "nextLabel": "Continue to Part 2 \u2192"
}
```

`instructions` and `explanation` come directly from the image text. Use `<strong>`, `<i>`, `<b>`, `<p>` HTML tags.

### Step 2: `drag-drop-mapping`

Maps `(x, y)` → `(NEW X, NEW Y)` using token banks.

```json
{
  "id": "q2",
  "type": "drag-drop-mapping",
  "questionLabel": "Question 2",
  "instructions": "...HTML...",
  "slots": [
    { "id": "x", "label": "NEW X" },
    { "id": "y", "label": "NEW Y" }
  ],
  "tokenBanks": [
    {
      "label": "X-values", "group": "x",
      "tokens": [
        { "value": "x",      "group": "x" },
        { "value": "\u2212x", "group": "x" }
      ]
    },
    {
      "label": "Y-values", "group": "y",
      "tokens": [
        { "value": "y",      "group": "y" },
        { "value": "\u2212y", "group": "y" }
      ]
    }
  ],
  "correctAnswer": { "x": "x", "y": "\u2212y" },
  "hint": "Check how the y-values change.",
  "successText": "...",
  "nextLabel": "Continue to Part 3 \u2192"
}
```

**Correct answers by transform type:**
| Transform    | `x`      | `y`      |
|-------------|----------|----------|
| `reflect_x` | `"x"`    | `"\u2212y"` |
| `reflect_y` | `"\u2212x"` | `"y"` |
| `scale` sx=2 | `"2x"` | `"y"` |
| `translate` dy=3 | `"x"` | `"y + 3"` |

Use `\u2212` for the minus sign (−), never a hyphen `-`.

### Step 3: `drag-drop-sentences`

Two flavours depending on what Q3 asks:

#### A) Invariant point(s) question

```json
{
  "id": "q3",
  "type": "drag-drop-sentences",
  "questionLabel": "Question 3",
  "instructions": "<strong>Drag &amp; drop</strong> to complete each statement.",
  "sentences": [
    {
      "prefix": "The point on both graphs is",
      "slots": [ { "id": "p1", "group": "point" } ],
      "suffix": "."
    },
    {
      "prefix": "It has the same",
      "slots": [
        { "id": "coordType", "group": "coordType" },
        { "separator": ", which is" },
        { "id": "value", "group": "value" }
      ],
      "suffix": "."
    }
  ],
  "tokenBanks": [
    {
      "label": "Points:", "group": "point",
      "source": "computed:invariant-points",
      "distractors": [[-2, -2], [3, 3]]
    },
    {
      "label": "Type:", "group": "coordType",
      "tokens": [
        { "value": "x-coordinate", "group": "coordType" },
        { "value": "y-coordinate", "group": "coordType" }
      ]
    },
    {
      "label": "Value:", "group": "value",
      "tokens": [
        { "value": "0",        "group": "value" },
        { "value": "\u22122",  "group": "value" },
        { "value": "3",        "group": "value" }
      ]
    }
  ],
  "correctAnswer": {
    "p1": "computed:invariant-point",
    "coordType": "x-coordinate",
    "value": "0"
  },
  "successText": "...",
  "nextLabel": "Finish Exploration \u2192"
}
```

Use `"p1"` and `"p2"` slots when there are 2 invariant points (reflect_x with 2 x-intercepts); use only `"p1"` when there is 1 (reflect_y, y-intercept only).

#### B) Equation question (curve applets only)

```json
{
  "id": "q3",
  "type": "drag-drop-sentences",
  "questionLabel": "Question 3",
  "instructions": "State the equation, in terms of x, of <strong>y = g(x)</strong>.",
  "sentences": [
    {
      "prefix": "y = g(x) =",
      "slots": [ { "id": "equation", "group": "equation" } ],
      "suffix": ""
    }
  ],
  "tokenBanks": [
    {
      "label": "Choose the equation:", "group": "equation",
      "tokens": [
        { "value": "sqrt_x_m2",     "group": "equation", "html": "&#x221A;x \u2212 2" },
        { "value": "neg_sqrt_x_m2", "group": "equation", "html": "\u2212&#x221A;x \u2212 2" },
        { "value": "sqrt_negx_m2",  "group": "equation", "html": "&#x221A;(\u2212x) \u2212 2" },
        { "value": "sqrt_x_p2",     "group": "equation", "html": "&#x221A;x + 2" }
      ]
    }
  ],
  "correctAnswer": { "equation": "sqrt_negx_m2" },
  "successText": "...",
  "nextLabel": "Finish Exploration \u2192"
}
```

Token `value` fields are arbitrary slugs (use descriptive names). Use `html` for rendered display when the token contains special symbols (√, −, fractions).
Use `&#x221A;` for √ and `\u2212` for −.

#### C) Set-notation question (domain/range)

Use `html` fields to render set notation. Token `value` fields are slugs for correct-answer matching.

```json
{
  "id": "q2",
  "type": "drag-drop-sentences",
  "questionLabel": "Question 2",
  "instructions": "State the <strong>domain</strong> and <strong>range</strong> of <strong>y = x²</strong>.",
  "sentences": [
    { "prefix": "Domain:", "slots": [{ "id": "domain", "group": "set" }], "suffix": "" },
    { "prefix": "Range:",  "slots": [{ "id": "range",  "group": "set" }], "suffix": "" }
  ],
  "tokenBanks": [
    {
      "label": "Sets:", "group": "set",
      "tokens": [
        { "value": "x_all_reals", "group": "set", "html": "{x \u2208 \u211d}" },
        { "value": "y_geq_0",     "group": "set", "html": "{y | y \u2265 0, y \u2208 \u211d}" },
        { "value": "y_geq_3",     "group": "set", "html": "{y | y \u2265 3, y \u2208 \u211d}" },
        { "value": "y_all_reals", "group": "set", "html": "{y \u2208 \u211d}" }
      ]
    }
  ],
  "correctAnswer": { "domain": "x_all_reals", "range": "y_geq_0" },
  "successText": "...",
  "nextLabel": "Continue to Part 3 \u2192"
}
```

**Unicode for set notation:**
| Symbol | JSON escape | Example |
|--------|------------|---------|
| `∈`    | `\u2208`   | `{x \u2208 \u211d}` → {x ∈ ℝ} |
| `ℝ`    | `\u211d`   | |
| `≥`    | `\u2265`   | `y \u2265 0` → y ≥ 0 |
| `≠`    | `\u2260`   | `x \u2260 0` → x ≠ 0 (domain/range of rational functions) |
| `−`    | `\u2212`   | `\u22123` → −3 |

### Step type: `table-input`

Used when students fill in a table of y-values for a given function. Points are plotted on the graph one-by-one as each cell is correctly validated. The blue connecting curve does **not** appear automatically — it only appears when the student clicks the **Graph** button (enabled once all cells are correct).

```json
{
  "id": "q1",
  "type": "table-input",
  "questionLabel": "Question 1 (of 3)",
  "instructions": "<strong>Complete</strong> the <strong>table of values</strong> on the right, and <strong>plot</strong> the points to <strong>sketch</strong> the graph.",
  "table": {
    "xLabel": "x",
    "yLabel": "y = x\u00b2",
    "fn": "x^2",
    "rows": [-3, -2, -1, 0, 1, 2, 3]
  },
  "preFilledRows": { "-3": 9, "-2": 4 },
  "plotAsEntered": true,
  "graphButtonLabel": "Graph",
  "successMessage": "CORRECT \u2014 Table complete and graph plotted!",
  "explanation": "<p>Optional HTML shown below success message after submit.</p>",
  "nextLabel": "Continue to Part 2 \u2192"
}
```

| Field | Required | Description |
|---|---|---|
| `table.fn` | yes | Formula validated against student input. Supports `x^2`, `sqrt(x)`, `abs(x)`, `sin(x)`, `1/x`, etc. Use `^` for exponentiation. |
| `table.rows` | yes | Array of x-values — one row per value. Include any x where the function is undefined (e.g. `0` for `1/x`) — those rows auto-render as 💣. |
| `table.xLabel` | yes | Column header for x (e.g. `"x"`) |
| `table.yLabel` | yes | Column header for y (e.g. `"y = x²"`) |
| `preFilledRows` | no | Dict of `{ "x": y }` — these rows are pre-populated as correct locked cells, shown as worked examples. Keys must be strings matching values in `table.rows`. |
| `plotAsEntered` | yes | Must be `true` — dots appear on graph as student validates each cell |
| `graphButtonLabel` | no | Label for the submit button in the toolbar (e.g. `"Graph"`). Defaults to `"Submit"` if omitted. |
| `successMessage` | yes | Text shown in the panel after the Graph button is clicked |
| `explanation` | no | HTML shown below the success message in the completed state |
| `nextLabel` | yes | Button label to advance to the next step |

**Behaviour:**
- Each cell is validated on blur (or pressing Enter). Correct cells turn green and lock; incorrect cells turn red and stay editable.
- **Pre-filled rows** (`preFilledRows`) appear already locked and green on load, acting as worked examples for the student.
- **Undefined rows** — if `table.fn` has no value at a given x (e.g. `x=0` for `1/x`), the cell renders as 💣 with no input. These rows are automatically skipped in the "all correct" check.
- Coordinate labels appear next to each plotted dot as it is placed. Labels use clean decimal formatting (e.g. `-0.25` not `-0.3`, `-0.2` not `-0.20`).
- **Reference dots** — any `original.points` whose x-value is **not** in `table.rows` are shown on the graph immediately as static reference dots (with labels). Only the table-row points are hidden until the student enters them.
- The Graph button enables only when every fillable cell is correct.
- Clicking Graph reveals the blue connecting curve and shows the success message. The step then locks.
- The persisted dots and curve are carried forward as the blue reference for subsequent steps.
- On the next `graph-plot` step, the blue curve from `table-input` is shown as the reference that students work from.

---

## 6. Computed Invariant Points

The engine automatically computes invariant points from `original.points` + `transform`:

| Transform    | Invariant points               | Shared coordinate  | Value |
|-------------|--------------------------------|-------------------|-------|
| `reflect_x` | Points where `y = 0` (x-intercepts) | `y-coordinate` | `"0"` |
| `reflect_y` | Points where `x = 0` (y-intercepts) | `x-coordinate` | `"0"` |
| `scale` sx≠1 | Points where `x = 0` (y-axis crossing) | — | — |
| `scale` sy≠1 | Points where `y = 0` (x-axis crossing) | — | — |

**Token bank for invariant points:**
```json
{
  "source": "computed:invariant-points",
  "distractors": [[x1, y1], [x2, y2]]
}
```
`distractors` are plausible wrong answers — pick nearby points from `original.points` that are NOT on the axis of reflection.

**`correctAnswer` for invariant slots:**
```json
"p1": "computed:invariant-point"
```
The engine resolves this to the actual point(s) at runtime.

---

## 7. How to Read an Image and Build the Config

**Step-by-step:**

1. **Read the grid** → set `xmin`, `xmax`, `ymin`, `ymax`
2. **Identify original graph type:**
   - Smooth curve (e.g. √x) → use `original.curve` + `original.points`
   - Connect-the-dots → use `original.points` only
3. **Identify the transform** from the image title/instruction:
   - "reflected in the x-axis" → `reflect_x`
   - "reflected in the y-axis" → `reflect_y`
4. **List original key points** from the labelled dots on the graph
5. **Compute expected points mentally** to verify:
   - `reflect_x`: negate y-coordinate of each point
   - `reflect_y`: negate x-coordinate of each point
6. **Read Q1 instructions and explanation** verbatim from the image
7. **Read Q2 instructions** from image; determine correctAnswer from the transform type
8. **Read Q3** — is it about invariant points or about the equation?
   - Invariant points: find which original points lie on the axis of reflection (y=0 for reflect_x, x=0 for reflect_y); pick 2 nearby points as distractors
   - Equation: list the 4 equation choices shown in the image; identify the correct one
9. **Read `progressLabel`** (e.g. "Exploration 4 of 8") and `heading` from image
10. **Set `graphLabels.transformed`** to the function name shown in the image (g(x), h(x), etc.)

---

## 8. Unicode Reference

| Symbol | JSON escape | Use for |
|--------|------------|---------|
| `−`    | `\u2212`   | Minus sign in math tokens |
| `→`    | `\u2192`   | Arrow in nextLabel |
| `√`    | `&#x221A;` (in `html` field) | Square root |
| `&amp;` | literal   | `&` in instructions HTML |

---

## 9. Activity Modules — Extension Point for New Transform Types

All transform-specific logic lives in **activity modules** inside `applets/activities/`. The engine never needs to be edited to add new transform types.

### Existing modules

| File | `activityType` | Purpose |
|---|---|---|
| `transformations.js` | `"transformations"` | Reflections, scale, translate, rotate, dilate |
| `functionPlot.js` | `"functionPlot"` | Student plots points on a given function |
| `intersection.js` | `"intersection"` | Student marks intersection of two functions |
| `extrema.js` | `"extrema"` | Student marks min/max points |
| `quadraticRoots.js` | `"quadraticRoots"` | Student marks roots of a quadratic |
| `rationalPlot.js` | `"rationalPlot"` | Student plots a rational function |

### Activity module contract

Every activity module **must** export:
```js
export const activityType = "myType";           // unique string key
export function createActivityState(config, src) { ... }  // returns { expectedPoints, ... }
export function getInteractionHandlers() { ... }           // return null to use engine defaults
export function validate(state, config) { ... }            // returns { isCorrect, details }
```

These two exports are **optional hooks** — the engine calls them if present:
```js
// Derives the transformed curve formula for rendering.
// Return { fn, domain } or null.
export function deriveCurve(config) { ... }

// Returns invariant point coordinates for "computed:invariant-points" token banks.
// Return array of [x, y] pairs.
export function getInvariantPoints(config) { ... }
```

### Adding a new transform type — zero engine edits

If an applet needs a transform type not already handled (e.g. "shear", "half-turn", etc.):

**Option A — Add to `transformations.js`** (preferred when the transform is a standard geometric operation):

1. Add the new type to `createActivityState` → `computeExpectedPoints` (in `transformEngine.js`)
2. Add the new case to `deriveCurve` in `transformations.js`
3. Add the new case to `getInvariantPoints` in `transformations.js`

**Option B — Create a new activity file** (preferred when the interaction or validation logic is fundamentally different):

```js
// applets/activities/myTransform.js
export const activityType = "myTransform";

export function createActivityState(config) {
  // compute expectedPoints from config.original.points + config.transform
  return { expectedPoints: [...], studentPoints: [] };
}
export function getInteractionHandlers() { return null; }
export function validate(state, config) {
  // compare state.studentPoints to state.activityState.expectedPoints
  return { isCorrect: true/false, details: { message: "..." } };
}

// Optional: tell the renderer how to draw the transformed curve
export function deriveCurve(config) {
  return { fn: "...", domain: [a, b] }; // or null if linear
}

// Optional: tell the engine which points are invariant
export function getInvariantPoints(config) {
  return [[x1, y1], [x2, y2]]; // points that don't move under this transform
}
```

Then reference it from the config:
```json
"activity": {
  "type": "myTransform",
  "activityModule": "../activities/myTransform.js",
  "config": { "tolerance": 0, "requireExactCount": true }
}
```

That is all. No files in `engine/` need to be touched.

---

## 10. The Table → Drag-Drop → Graph Pattern (Quadratic-Shift Style)

Use this pattern when students must:
1. Build a table of values for a base function (e.g. y = x²)
2. Identify domain/range via drag-drop
3. Plot a transformed version of the curve interactively

**Step flow:** `table-input` → `drag-drop-sentences` → `graph-plot`

**Key wiring rules:**
- `original.curve.fn` and `table.fn` must match (both `"x^2"` for y = x²).
- `original.points` lists the 7 key points used for step 1's table rows.
- `transform` describes the shift (e.g. `{ "type": "translate", "dx": 0, "dy": 3 }`); the engine auto-computes expected points for step 3 from this.
- `grid` must accommodate both the original curve and the transformed curve (e.g. ymax ≥ 9 + shift amount).
- `applet.graphLabels.original` / `.transformed` appear as axis labels on the graph.
- Step 3 is a standard interactive `graph-plot` — no `autoReveal`. Students click to place dots; the green curve appears on correct submission.

**Graph state across steps:**
| Step | What's shown on graph |
|------|----------------------|
| `table-input` | Blue dots appear one-by-one as student fills table; blue curve appears only after clicking the Graph button |
| `drag-drop-sentences` | Blue curve from step 1 (reference) |
| `graph-plot` | Blue curve (from step 1) + student's green dots; green curve on correct submit |

---

## 11. Complete Reference Example — Quadratic Shift (applet-10)

`applets/configs/applet-10-quadratic-shift.json`

```json
{
  "schemaVersion": "1",
  "title": "The Quadratic Function \u2013 The Graph of y = x\u00b2",
  "pages": [
    {
      "type": "applet",
      "showProgress": false,
      "showTitle": false,
      "showFooter": false,
      "grid": { "xmin": -5, "xmax": 5, "ymin": -2, "ymax": 14 },
      "interaction": { "mode": "placePoints", "snapStep": 1, "hitRadiusPx": 20 },
      "original": {
        "curve": { "fn": "x^2", "domain": [-4, 4] },
        "points": [[-3,9],[-2,4],[-1,1],[0,0],[1,1],[2,4],[3,9]]
      },
      "transform": { "type": "translate", "dx": 0, "dy": 3 },
      "activity": {
        "type": "transformations",
        "activityModule": "../activities/transformations.js",
        "config": { "tolerance": 0, "requireExactCount": true }
      },
      "feedback": { "showExpectedPointsOnFail": false },
      "applet": {
        "heading": "The Quadratic Function",
        "graphLabels": {
          "original": "y = x\u00b2",
          "transformed": "y = x\u00b2 + 3"
        },
        "steps": [
          {
            "id": "q1",
            "type": "table-input",
            "questionLabel": "Question 1 (of 3)",
            "instructions": "<strong>Complete</strong> the <strong>table of values</strong> on the right, and <strong>plot</strong> the points to <strong>sketch</strong> the graph.",
            "table": {
              "xLabel": "x",
              "yLabel": "y = x\u00b2",
              "fn": "x^2",
              "rows": [-3, -2, -1, 0, 1, 2, 3]
            },
            "plotAsEntered": true,
            "graphButtonLabel": "Graph",
            "successMessage": "CORRECT \u2014 Table complete and graph plotted!",
            "nextLabel": "Continue to Part 2 \u2192"
          },
          {
            "id": "q2",
            "type": "drag-drop-sentences",
            "questionLabel": "Question 2 (of 3)",
            "instructions": "State the <strong>domain</strong> and <strong>range</strong> of <strong>y = x\u00b2</strong>.",
            "sentences": [
              { "prefix": "Domain:", "slots": [{ "id": "domain", "group": "set" }], "suffix": "" },
              { "prefix": "Range:",  "slots": [{ "id": "range",  "group": "set" }], "suffix": "" }
            ],
            "tokenBanks": [
              {
                "label": "Sets:", "group": "set",
                "tokens": [
                  { "value": "x_all_reals", "group": "set", "html": "{x \u2208 \u211d}" },
                  { "value": "y_geq_0",     "group": "set", "html": "{y | y \u2265 0, y \u2208 \u211d}" },
                  { "value": "y_geq_3",     "group": "set", "html": "{y | y \u2265 3, y \u2208 \u211d}" },
                  { "value": "y_all_reals", "group": "set", "html": "{y \u2208 \u211d}" }
                ]
              }
            ],
            "correctAnswer": { "domain": "x_all_reals", "range": "y_geq_0" },
            "successText": "The domain is all real numbers because any x-value can be squared. The range is y \u2265 0 because squaring never gives a negative result.",
            "nextLabel": "Continue to Part 3 \u2192"
          },
          {
            "id": "q3",
            "type": "graph-plot",
            "questionLabel": "Question 3 (of 3)",
            "instructions": "On the same grid, <strong>sketch the graph</strong> of <strong>y = x\u00b2 + 3</strong>. Add 3 to all y-coordinates.",
            "successMessage": "CORRECT \u2014 Your graph is bang on!",
            "explanation": "<p>Each point (x, y) on y = x\u00b2 maps to (x, y + 3) on y = x\u00b2 + 3 \u2014 the y-coordinate increases by 3 while the x-coordinate stays the same.</p><p>This shifts the graph <b>vertically upward</b> by 3 units.</p>",
            "nextLabel": "Finish Exploration \u2192"
          }
        ]
      }
    }
  ]
}
```

**To adapt this for a different function (e.g. y = x² − 2):**
1. Change `transform.dy` to `-2`
2. Change `table.fn` and `original.curve.fn` to `"x^2"` (base stays the same)
3. Change `yLabel` to `"y = x²"` and `graphLabels.transformed` to `"y = x² − 2"` (`\u2212 2`)
4. Adjust `grid.ymin` to accommodate negative shift (e.g. `ymin: -5`)
5. Update all `instructions`, `successMessage`, and `explanation` text accordingly

---

## 12. Quick Checklist

**All applets:**
- [ ] `schemaVersion: "1"` at top level
- [ ] `pages[0].type === "applet"`, `showProgress/Title/Footer: false`
- [ ] `grid` covers both original domain and transformed domain
- [ ] `original.curve` present for smooth curves; `original.points` always present
- [ ] `transform.type` matches the transformation shown in image
- [ ] `activity.activityModule` points to an existing file in `applets/activities/`
- [ ] `applet.progressLabel` matches "Exploration N of M" from image (if shown)
- [ ] `applet.graphLabels.transformed` matches function label in image
- [ ] Step count 3–4 — renderer supports any number
- [ ] All `nextLabel` arrows use `\u2192`
- [ ] New transform type? → add to activity module only, no engine edits needed

**Transformation pattern:**
- [ ] Q2 `correctAnswer` uses `\u2212` (not `-`) for minus sign
- [ ] Q3 invariant `distractors` are NOT on the axis of reflection
- [ ] Q3 equation tokens have unique `value` slugs and `html` for display

**Quadratic-shift / table-input pattern:**
- [ ] `table.fn` matches `original.curve.fn` (both use `^` for exponentiation)
- [ ] `table.rows` lists the x-values students must fill in (subset of `original.points`)
- [ ] `original.points` contains ALL key points — both table rows and non-table reference points
- [ ] Non-table `original.points` x-values are NOT in `table.rows` — they show as static reference dots immediately
- [ ] `grid.ymax` ≥ max(original y) + shift amount to keep dots in view
- [ ] `plotAsEntered: true` is set on the `table-input` step
- [ ] `graphButtonLabel: "Graph"` is set on the `table-input` step (toolbar shows "Graph" instead of "Submit")
- [ ] If the image shows pre-filled example rows, add `preFilledRows: { "x1": y1, "x2": y2 }` — keys must be strings
- [ ] If `table.fn` is undefined at any x (e.g. `1/x` at `x=0`), include that x in `table.rows` — it auto-renders as 💣
- [ ] Step 3 is `"type": "graph-plot"` — interactive, no `autoReveal`
- [ ] `explanation` field added to step 3 if image shows a written explanation

**Drag-drop set-notation:**
- [ ] Token `html` field uses `\u2208` (∈), `\u211d` (ℝ), `\u2265` (≥)
- [ ] Token `value` is a short slug used only for `correctAnswer` matching
