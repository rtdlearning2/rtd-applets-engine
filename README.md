# rtd-applets-engine
For hosing interactive applets we'll make for iSpring courses

## Config Schema Versions

- App configs may specify `schemaVersion`. If omitted, version `"0"` is assumed.
- Schema `"0"` matches the legacy layout used by current configs (original points, grid, transform, etc.).
- Schema `"1"` groups data into `view`, `ui`, `interaction`, `series`, and `activity` blocks; the migration layer normalizes this into the structure the app expects, so existing configs do not need edits.
