/*! theme v1.0.0 — one colour + font system for every project.
 *  No dependencies. Include after theme.css:
 *    <link rel="stylesheet" href="https://danialmor.github.io/theme/v1/theme.css">
 *    <script src="https://danialmor.github.io/theme/v1/theme.js"></script>
 *    <script>Theme.init({ light: 'ice', dark: 'aurora' })</script>
 *  A theme is ~15 colours + 2 fonts; everything else is derived and published as CSS
 *  variables (--t-*). Pin the major version (v1) so later versions never break a project. */
(function (root) {
  'use strict';
  var VERSION = '1.0.0', KEY = 'theme.v1';

  /* ── colour maths ─────────────────────────────────────────────────── */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function parse(c) {
    c = String(c).trim(); var m;
    if ((m = /^#([0-9a-f]{3})$/i.exec(c))) return m[1].split('').map(function (x) { return parseInt(x + x, 16); }).concat(1);
    if ((m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(c))) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16), m[2] ? parseInt(m[2], 16) / 255 : 1];
    if ((m = /^rgba?\(([^)]+)\)$/i.exec(c))) { var p = m[1].split(/[,\s/]+/).filter(Boolean).map(parseFloat); return [p[0], p[1], p[2], p[3] == null ? 1 : p[3]]; }
    return null;
  }
  function hex(r, g, b) { return '#' + [r, g, b].map(function (v) { return Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0'); }).join(''); }
  function mix(a, b, t) { var x = parse(a), y = parse(b); return hex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t); }   // t=0 → a, t=1 → b
  function alpha(c, a) { var x = parse(c); return 'rgba(' + Math.round(x[0]) + ',' + Math.round(x[1]) + ',' + Math.round(x[2]) + ',' + a + ')'; }
  function lum(c) { var x = parse(c).slice(0, 3).map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * x[0] + .7152 * x[1] + .0722 * x[2]; }
  function onColor(c) { return lum(c) > .5 ? '#1a1a22' : '#ffffff'; }

  /* ── themes ───────────────────────────────────────────────────────── */
  var HUES = ['rose', 'violet', 'peach', 'sky', 'mint', 'sun'];
  var HUE_BASE = { rose: '#ff6fae', violet: '#8b6cff', peach: '#ff8f6b', sky: '#4aa8ff', mint: '#27c99a', sun: '#ffc531' };
  function T(id, name, mode, o) { var d = { id: id, name: name, mode: mode, hues: Object.assign({}, HUE_BASE), font: { display: 'Cabinet Grotesk', text: 'General Sans' }, builtin: true }; return Object.assign(d, o); }
  var THEMES = [
    T('ice', 'Ice', 'light', { bg: '#f3f6ff', bg2: '#e4eaff', surface: '#ffffff', surface2: '#f8f9ff', ink: '#1f2347', accent: '#7a4df5', accent2: '#ff5fa8', mesh: ['#ff9fd1', '#a99dff', '#9ad6ff'] }),
    T('candy', 'Candy', 'light', { bg: '#fff3fa', bg2: '#ffe0f1', surface: '#ffffff', surface2: '#fff9fd', ink: '#3b1f4f', accent: '#e03e97', accent2: '#8f5cf5', mesh: ['#ff9ccf', '#c9a5ff', '#ffc9a8'] }),
    T('aurora', 'Aurora', 'dark', { bg: '#0a0f2e', bg2: '#121850', surface: '#161c4a', surface2: '#1d2459', ink: '#eef0ff', accent: '#8f74ff', accent2: '#ff6fb8', mesh: ['#7c5cff', '#3d6dff', '#ff5fb0'] }),
    T('midnight', 'Midnight plum', 'dark', { bg: '#17111f', bg2: '#251a33', surface: '#241a30', surface2: '#2d2139', ink: '#f6eff8', accent: '#b78cff', accent2: '#ff8fb5', mesh: ['#8c5cff', '#ff6fa8', '#4f7cff'] }),
    T('cacao', 'Cacao', 'light', { bg: '#fbf3e8', bg2: '#f3e4cf', surface: '#fffaf2', surface2: '#fffdf8', ink: '#3a2418', accent: '#e8693a', accent2: '#ffb084', mesh: ['#ffa05f', '#ffc496', '#8fbea0'] }),
    T('lagoon', 'Lagoon', 'light', { bg: '#f2f8f6', bg2: '#dcefeb', surface: '#fdfefd', surface2: '#f4f9f8', ink: '#13302d', accent: '#1a7a6e', accent2: '#4cc3b1', mesh: ['#6fd6c6', '#b8e8df', '#ffd6b0'] })
  ];

  /* ── fonts (Fontshare / Google, loaded on demand) ─────────────────── */
  var FS = 'fs', GF = 'gf';
  var FONTS = [
    ['General Sans', 'sans', FS, 'general-sans@400,500,600'], ['Cabinet Grotesk', 'display', FS, 'cabinet-grotesk@500,700,800'], ['Switzer', 'sans', FS, 'switzer@400,500,600'], ['Satoshi', 'sans', FS, 'satoshi@400,500,700'],
    ['Gambetta', 'serif', FS, 'gambetta@400,500'], ['Erode', 'serif', FS, 'erode@500,600'], ['Zodiak', 'serif', FS, 'zodiak@400,700'], ['Sentient', 'serif', FS, 'sentient@400,500'], ['Supreme', 'sans', FS, 'supreme@400,500,700'],
    ['Red Hat Display', 'display', FS, 'red-hat-display@500,700,900'], ['Clash Grotesk', 'display', FS, 'clash-grotesk@500,600'], ['Azeret Mono', 'mono', FS, 'azeret-mono@400,500'], ['Tabular', 'mono', FS, 'tabular@400,500'],
    ['Manrope', 'sans', GF, 'Manrope:wght@400;500;600;700'], ['Space Grotesk', 'sans', GF, 'Space+Grotesk:wght@400;500;600;700'], ['Figtree', 'sans', GF, 'Figtree:wght@400;500;600;700'], ['Fraunces', 'serif', GF, 'Fraunces:wght@400;500;600;700'],
    ['Hanken Grotesk', 'sans', GF, 'Hanken+Grotesk:wght@400;500;600;700'], ['Sora', 'sans', GF, 'Sora:wght@400;500;600;700'], ['Onest', 'sans', GF, 'Onest:wght@400;500;600'], ['Inter Tight', 'sans', GF, 'Inter+Tight:wght@400;500;600;700'],
    ['Bricolage Grotesque', 'display', GF, 'Bricolage+Grotesque:wght@400;600;700;800'], ['Big Shoulders', 'display', GF, 'Big+Shoulders:wght@500;700;800'], ['Sofia Sans', 'sans', GF, 'Sofia+Sans:wght@400;500;600;700'], ['Plus Jakarta Sans', 'sans', GF, 'Plus+Jakarta+Sans:wght@400;500;600;700;800'],
    ['DM Sans', 'sans', GF, 'DM+Sans:wght@400;500;600;700'], ['Geologica', 'sans', GF, 'Geologica:wght@400;500;700'], ['Roboto Flex', 'sans', GF, 'Roboto+Flex:wght@400;500;600;700'], ['JetBrains Mono', 'mono', GF, 'JetBrains+Mono:wght@400;500;600'],
    ['Geist Mono', 'mono', GF, 'Geist+Mono:wght@400;500'], ['IBM Plex Mono', 'mono', GF, 'IBM+Plex+Mono:wght@400;500;600'], ['Source Code Pro', 'mono', GF, 'Source+Code+Pro:wght@400;500'], ['Overpass Mono', 'mono', GF, 'Overpass+Mono:wght@400;600'],
    ['Chivo Mono', 'mono', GF, 'Chivo+Mono:wght@400;500'], ['Space Mono', 'mono', GF, 'Space+Mono:wght@400;700'], ['Vazirmatn', 'persian', GF, 'Vazirmatn:wght@400;500;700;800']
  ].map(function (f) { return { name: f[0], kind: f[1], src: f[2], spec: f[3] }; });
  var loaded = {};
  function loadFont(name) {
    var f = FONTS.filter(function (x) { return x.name === name; })[0]; if (!f || loaded[name] || typeof document === 'undefined') return; loaded[name] = 1;
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = f.src === FS ? 'https://api.fontshare.com/v2/css?f%5B%5D=' + f.spec + '&display=swap' : 'https://fonts.googleapis.com/css2?family=' + f.spec + '&display=swap'; document.head.appendChild(l);
  }
  function fontStack(name) {
    var f = FONTS.filter(function (x) { return x.name === name; })[0], fb = f && f.kind === 'serif' ? 'Georgia, serif' : f && f.kind === 'mono' ? 'ui-monospace, Menlo, monospace' : 'system-ui, -apple-system, "Segoe UI", sans-serif';
    return '"' + name + '", "Vazirmatn", ' + fb;
  }

  /* ── tokens ───────────────────────────────────────────────────────── */
  function ramp(base, mode, bg) {
    return mode === 'dark' ? { c: mix(base, bg, .76), f: mix(base, bg, .5), a: mix(base, '#ffffff', .35), s: mix(base, bg, .58) }
      : { c: mix(base, '#ffffff', .68), f: mix(base, '#ffffff', .38), a: mix(base, '#000000', .42), s: mix(base, '#ffffff', .86) };
  }
  function tokens(d) {
    var dark = d.mode === 'dark', ink = d.ink, o = {};
    o['--t-bg'] = d.bg; o['--t-bg2'] = d.bg2; o['--t-surface'] = d.surface; o['--t-surface2'] = d.surface2; o['--t-ink'] = ink;
    o['--t-soft'] = alpha(ink, .8); o['--t-faint'] = alpha(ink, .68); o['--t-line'] = alpha(ink, dark ? .16 : .13); o['--t-line-fine'] = alpha(ink, dark ? .08 : .075); o['--t-line-strong'] = alpha(ink, dark ? .26 : .22);
    o['--t-accent'] = d.accent; o['--t-accent2'] = d.accent2; o['--t-accent-ink'] = dark ? mix(d.accent, '#ffffff', .42) : mix(d.accent, '#000000', .3); o['--t-on-accent'] = onColor(d.accent);
    o['--t-accent-soft'] = alpha(d.accent, .12); o['--t-accent-mid'] = mix(d.accent, d.surface, dark ? .6 : .8);
    o['--t-shadow'] = dark ? 'rgba(0,0,0,.7)' : alpha(mix(d.accent, '#000000', .55), .38); o['--t-shadow-soft'] = dark ? 'rgba(0,0,0,.45)' : alpha(mix(d.accent, '#000000', .55), .2);
    o['--t-rim'] = dark ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.95)';
    o['--t-glass'] = alpha(d.surface, dark ? .8 : .82); o['--t-glass-lat'] = alpha(d.surface2, dark ? .55 : .7); o['--t-group'] = dark ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.88)'; o['--t-field'] = dark ? 'rgba(255,255,255,.08)' : alpha(ink, .06); o['--t-tile'] = dark ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.6)';
    d.mesh.forEach(function (m, i) { o['--t-mesh' + (i + 1)] = alpha(m, dark ? .28 : .34); });
    o['--t-danger'] = dark ? '#ff8d85' : '#c0301f'; o['--t-danger-bg'] = dark ? '#4a1f22' : '#fbdad5'; o['--t-ok'] = dark ? '#6fdba9' : '#1f8a5b';
    HUES.forEach(function (h) { var r = ramp(d.hues[h], d.mode, d.bg); o['--t-' + h + '-c'] = r.c; o['--t-' + h + '-f'] = r.f; o['--t-' + h + '-a'] = r.a; o['--t-' + h + '-s'] = r.s; o['--t-' + h] = d.hues[h]; });
    return o;
  }
  function css(d, sel) { return (sel || ':root') + ' {\n' + Object.keys(tokens(d)).map(function (k) { return '  ' + k + ': ' + tokens(d)[k] + ';'; }).join('\n') + '\n  --f-display: ' + fontStack(d.font.display) + ';\n  --f-text: ' + fontStack(d.font.text) + ';\n}'; }
  function json(d) { return JSON.stringify({ name: d.name, mode: d.mode, bg: d.bg, bg2: d.bg2, surface: d.surface, surface2: d.surface2, ink: d.ink, accent: d.accent, accent2: d.accent2, hues: d.hues, mesh: d.mesh, font: d.font }, null, 2); }

  /* ── runtime ──────────────────────────────────────────────────────── */
  var cfg = { light: 'ice', dark: 'aurora', mode: 'auto', fontDisplay: '', fontText: '', custom: [] }, forced = null, subs = [], current = null;
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function store() { try { localStorage.setItem(KEY, JSON.stringify({ light: cfg.light, dark: cfg.dark, mode: cfg.mode, fontDisplay: cfg.fontDisplay, fontText: cfg.fontText, custom: cfg.custom })); } catch (e) { /* private mode */ } }
  function all() { return THEMES.concat(cfg.custom); }
  function get(id) { return all().filter(function (t) { return t.id === id; })[0]; }
  function prefersDark() { return !!(root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches); }
  function isDark() { return forced != null ? forced : cfg.mode === 'dark' || (cfg.mode === 'auto' && prefersDark()); }
  function pick() { return get(isDark() ? cfg.dark : cfg.light) || get(isDark() ? 'aurora' : 'ice'); }
  function apply() { return paint(pick()); }
  function paint(d) {
    var t = tokens(d), el = document.documentElement, st = el.style;
    Object.keys(t).forEach(function (k) { st.setProperty(k, t[k]); });
    var fd = cfg.fontDisplay || d.font.display, ft = cfg.fontText || d.font.text; loadFont(fd); loadFont(ft); loadFont('Vazirmatn');
    st.setProperty('--f-display', fontStack(fd)); st.setProperty('--f-text', fontStack(ft));
    el.setAttribute('data-theme-id', d.id); el.setAttribute('data-theme-mode', d.mode); st.colorScheme = d.mode;
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', d.bg);
    current = d; subs.forEach(function (f) { try { f(d); } catch (e) { /* subscriber error */ } });
    try { document.dispatchEvent(new CustomEvent('themechange', { detail: d })); } catch (e) { /* old browser */ }
    return d;
  }
  var Theme = {
    version: VERSION, themes: THEMES, fonts: FONTS, hues: HUES, hueBase: HUE_BASE, color: { parse: parse, hex: hex, mix: mix, alpha: alpha, lum: lum, onColor: onColor }, ramp: ramp,
    tokens: tokens, css: css, json: json, fontStack: fontStack, loadFont: loadFont,
    list: all, get: get, current: function () { return current || pick(); }, config: function () { return Object.assign({}, cfg); },
    init: function (opts) {                      // defaults < your options < what the visitor chose (stored) < ?theme=id in the address
      var st = load(); cfg = Object.assign(cfg, opts || {}, st); cfg.custom = (st.custom || (opts && opts.custom) || []).map(function (c) { return Object.assign({ builtin: false }, c); });
      var q = (root.location && /[?&]theme=([\w-]+)/.exec(root.location.search)); if (q && get(q[1])) { var d = get(q[1]); cfg[d.mode === 'dark' ? 'dark' : 'light'] = d.id; store(); }
      if (root.matchMedia) { var mq = root.matchMedia('(prefers-color-scheme: dark)'); (mq.addEventListener ? mq.addEventListener('change', function () { if (cfg.mode === 'auto' && forced == null) apply(); }) : null); }
      return apply();
    },
    use: function (id) { var d = get(id); if (!d) return null; cfg[d.mode === 'dark' ? 'dark' : 'light'] = id; if (cfg.mode !== 'auto') cfg.mode = d.mode; else if (d.mode === 'dark' !== prefersDark()) cfg.mode = d.mode; store(); return apply(); },
    mode: function (m) { if (m) { cfg.mode = m; forced = null; store(); apply(); } return cfg.mode; },
    setDark: function (b) { forced = b == null ? null : !!b; return apply(); },          // for apps that have their own light/dark switch
    fonts_set: function (display, text) { cfg.fontDisplay = display || ''; cfg.fontText = text || ''; store(); return apply(); },
    register: function (def) { var id = def.id || 'my-' + Math.random().toString(36).slice(2, 8); var d = Object.assign({ id: id, builtin: false, hues: Object.assign({}, HUE_BASE), mesh: [def.accent, def.accent2 || def.accent, def.accent], bg2: def.bg, surface2: def.surface, accent2: def.accent, font: { display: 'Cabinet Grotesk', text: 'General Sans' } }, def); d.id = id; cfg.custom = cfg.custom.filter(function (c) { return c.id !== id; }).concat([d]); store(); return d; },
    remove: function (id) { cfg.custom = cfg.custom.filter(function (c) { return c.id !== id; }); if (cfg.light === id) cfg.light = 'ice'; if (cfg.dark === id) cfg.dark = 'aurora'; store(); apply(); },
    preview: function (def) { var d = Object.assign({ id: '__preview', hues: Object.assign({}, HUE_BASE), mesh: [def.accent, def.accent, def.accent], font: { display: 'Cabinet Grotesk', text: 'General Sans' } }, def); return paint(d); },   // show a theme without saving it
    endPreview: function () { return apply(); },
    onChange: function (f) { subs.push(f); return function () { subs = subs.filter(function (x) { return x !== f; }); }; },
    picker: function () {                        // a ready-made <select> you can drop anywhere
      var s = document.createElement('select'); s.setAttribute('aria-label', 'Theme');
      function fill() { s.innerHTML = ''; all().forEach(function (t) { var o = document.createElement('option'); o.value = t.id; o.textContent = t.name + ' · ' + t.mode; o.selected = t.id === Theme.current().id; s.appendChild(o); }); }
      fill(); s.addEventListener('change', function () { Theme.use(s.value); }); Theme.onChange(function () { s.value = Theme.current().id; }); return s;
    }
  };
  root.Theme = Theme;
  if (typeof module !== 'undefined' && module.exports) module.exports = Theme;
})(typeof window !== 'undefined' ? window : globalThis);
