# Manual Testing Checklist

- [ ] **Load**: App loads with no console errors.
- [ ] **Render**: Grid and original graph (blue) are visible.
- [ ] **Interact**: Clicking adds red points; "Undo" removes the last one.
- [ ] **Submit**: Validates correctness and shows feedback.
- [ ] **Reset**: Clears student points and feedback.

## Golden Test Scenario

**Config**: `https://raw.githubusercontent.com/rtdlearning2/applets-math30-1/main/configs/unit-1-transformations/reflections/reflect_x_001.json`

1.  **Launch**: Open `index.html?src=...` with the config above.
2.  **Verify**: Title is "Reflect y = f(x) in the x-axis".
3.  **Action**: For every blue point $(x, y)$, click the corresponding $(x, -y)$.
4.  **Submit**: Press **Submit**.
    *   *Result*: "Correct!" message appears. Green line overlays red points.
5.  **Reset**: Press **Reset**.
    *   *Result*: Points and messages clear.

## Snap Step

- [ ] **snapStep = 0.5**: Use any config and set `interaction.snapStep` to `0.5`. Click near `.2` or `.7` world coordinates and confirm the plotted point lands on the nearest `0.5` multiple (e.g., `0.0`, `0.5`, `1.0`).
