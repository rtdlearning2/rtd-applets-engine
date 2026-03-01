# Applet Brief (What To Provide An External AI/Coder)

Use this to describe a new applet so it can be implemented quickly and consistently.

Project Context
- The app runs inside iSpring Web Objects (iframe) and uses embed mode.
- Layout/scroll behavior is standardized by Contained Responsive Slide Mode.

Provide These Inputs
1) Learning goal and grade/level
- What skill should the student demonstrate?

2) Interaction type and flow
- Example: graph plot, drag/drop fill, multiple choice, transformation builder
- Is it single-step or multi-step?

3) Data and correct answers
- Graph domain/range, points/series, rules, correct options
- Tolerances (if any)

4) Copy and labels
- Titles, prompts, instruction text, button labels

5) Visual constraints
- Any must-keep colors, fonts, or spacing
- Any custom icons or images (with file paths)

6) Accessibility notes
- Keyboard focus needs, ARIA labels, required tab order

7) Scoring/validation
- What is considered correct? Any partial credit?

If You Have A Config, Provide:
- The JSON config (or tell which existing config to clone)
- Any new schema fields you want added

Minimum Example Brief
- Goal: Students identify x-intercepts after reflection.
- Type: 3-step flow (plot, rule drag/drop, shared points drag/drop).
- Data: Original points and expected points list.
- Copy: Provide final instruction text and labels.
- Validation: exact match, no tolerance.

Notes
- Embed-mode layout is already baked in. Do not propose alternate scroll regions.
- Use the config template in [engine/config/template-embed.json](../engine/config/template-embed.json) as a starting point.
