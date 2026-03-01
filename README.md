# rtd-applets-engine
For hosing interactive applets we'll make for iSpring courses

## Config Schema Versions

- App configs may specify `schemaVersion`. If omitted, version "0" is assumed.
- Schema "0" matches the legacy layout used by current configs (original points, grid, transform, etc.).
- Schema "1" groups data into `view`, `ui`, `interaction`, `series`, and `activity` blocks; the migration layer normalizes this into the structure the app expects, so existing configs do not need edits.

Legacy configs are validated at load time (required grid/view, interaction, and original points or series).

## Page Templates (pages[])

For multi-page applets, configs can include a `pages` array. When `pages` is present, the engine renders the new template flow instead of the legacy renderer.

Minimal example:

```json
{
  "schemaVersion": 1,
  "title": "Template Example",
  "pages": [
    {
      "id": "p1",
      "type": "graph-plot",
      "title": "Graphing Task",
      "prompt": "Plot the transformed function and submit your graph."
    },
    {
      "id": "p2",
      "type": "drag-drop-fill",
      "title": "Fill in the Rule",
      "prompt": "Drag tokens into the blanks.",
      "tokens": ["x", "-x", "y", "-y"],
      "blanks": ["newX", "newY"],
      "correctAnswers": { "newX": "x", "newY": "-y" }
    }
  ]
}
```

### Page-mode toggle

If a config does not include `pages`, you can still force page mode by setting:

```json
{
  "pageMode": "template"
}
```

or

```json
{
  "ui": { "pageMode": "template" }
}
```

### Legacy override

When testing templates, you can force legacy rendering with either URL flag:

- `?legacy=1`
- `?mode=legacy`

## Layout Presets (PPT/iSpring)

Use layout presets to standardize sizing and safe areas for slides:

```json
{
  "ui": {
    "layout": {
      "preset": "ppt1080p",
      "overflowPolicy": "scroll"
    }
  }
}
```

Supported presets:

- `ppt1080p` (1280x720)
- `ppt720p` (960x540)
- `ppt4x3` (1024x768)

Overflow policies:

- `scroll` (default)
- `clamp` (hide overflow)
- `collapse` (collapse long sections with a Show more toggle)
