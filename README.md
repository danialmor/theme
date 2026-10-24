# Theme

One colour, font and shape system for every project. Static files on GitHub Pages — nothing to install, works from an iPad browser.

**Live:** https://danialmor.github.io/theme/  (the Theme Lab: pick, edit, copy)

## Use it in any project (one line)
```html
<link rel="stylesheet" href="https://danialmor.github.io/theme/v1/theme.css">
<script src="https://danialmor.github.io/theme/v1/theme.js"></script>
<script>Theme.init({ light: 'ice', dark: 'aurora' })</script>
```
- **CSS only (no JS):** `<html data-theme-id="aurora">` + `theme.css`.
- **In your CSS:** `var(--t-bg)`, `var(--t-surface)`, `var(--t-ink)`, `var(--t-accent)`, `var(--t-violet-c)` … and `var(--f-display)`, `var(--f-text)`.
- **Apps with their own variables:** add an adapter (`v1/adapters/dashboard.css` is the example).
- **Preview a theme on any page:** add `?theme=candy` to the address.
- **App with its own light/dark switch:** call `Theme.setDark(true|false)` from it.

## Versions
`v1` never changes in a breaking way. Breaking changes go to `v2/`; projects move when you decide.

## Folder
```
index.html             Theme Lab (themes, colours, fonts, snippets, editor)
v1/theme.js            engine: themes, fonts, tokens, light/dark, API
v1/theme.css           generated: every built-in theme as CSS variables
v1/base.css            optional starter components (.t-card, .t-btn …)
v1/adapters/           one CSS file per app that has its own variables
tools/build.js         regenerates theme.css:  node tools/build.js
```

## Tokens
Base: `--t-bg --t-bg2 --t-surface --t-surface2 --t-ink --t-soft --t-faint --t-line --t-line-fine --t-line-strong`
Accent: `--t-accent --t-accent2 --t-accent-ink --t-on-accent --t-accent-soft`
Hues (`rose violet peach sky mint sun`): `--t-HUE --t-HUE-s --t-HUE-c --t-HUE-f --t-HUE-a`
Glows & glass: `--t-mesh1..3 --t-glass --t-group --t-field --t-tile --t-rim --t-shadow --t-shadow-soft`
Status: `--t-ok --t-danger --t-danger-bg` · Fonts: `--f-display --f-text`

## Licence note
Everything here is original code (colour maths, tokens, engine, lab). It contains **no Moxen component code** — only the design rules (cream/pastel palettes, springs) that inspired it. Keep Moxen's components inside finished projects, with credit, as their licence requires.
