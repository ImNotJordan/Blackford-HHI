/* Hyacinth Legal Support · Global dropdown + date component system (select, combobox, multi-select, menus, date, range, date-time, month) */
'use strict';
/* =========================================================
   GLOBAL DROPDOWN + DATE SYSTEM
   One registry (DD), one floating surface (#dd-pop) that becomes a
   bottom sheet at ≤768px, one tooltip (#dd-tip). Used by the website,
   the client portal and admin.
   ========================================================= */
const TZS = { CT: { id: 'America/Chicago', name: 'Central Time' }, ET: { id: 'America/New_York', name: 'Eastern Time' }, MT: { id: 'America/Denver', name: 'Mountain Time' }, PT: { id: 'America/Los_Angeles', name: 'Pacific Time' } };
const tzKey = () => (state.settings && TZS[state.settings.tz]) ? state.settings.tz : 'CT';
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/* ---------- Formatting rules (used everywhere) ---------- */
const fmtD = d => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
const fmtTimeTz = d => `${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZS[tzKey()].id })} ${tzKey()}`;
const fmtDT = d => d ? `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: TZS[tzKey()].id })} · ${fmtTimeTz(d)}` : '';
function fmtRange(a, b) {
  if (!a) return '';
  b = b || a;
  if (sameDay(a, b)) return fmtD(a);
  const sy = a.getFullYear() === b.getFullYear();
  return `${a.toLocaleDateString('en-US', sy ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' })} – ${fmtD(b)}`;
}
const monthLabel = v => v ? new Date(v.y, v.m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
function relText(d) {
  const m = Math.round((Date.now() - d) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (m < 60 * 24 && sameDay(d, new Date())) return `${Math.round(m / 60)}h ago`;
  const days = Math.round((TODAY - startOf(d)) / DAY);
  if (days <= 0) return `${Math.max(1, Math.round(m / 60))}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return fmtD(d);
}
const relTime = d => `<time datetime="${d.toISOString()}" data-tip="${esc(fmtDT(d))}"><span aria-hidden="true">${relText(d)}</span><span class="sr-only">${esc(fmtDT(d))}</span></time>`;
function dueChip(d, done) {
  if (done) return `<span class="due-chip due-done">${icon('check', 14)}Done</span>`;
  const n = diffDays(d);
  if (n < 0) return `<span class="due-chip due-over">${icon('alert', 14)}Overdue · ${-n} ${n === -1 ? 'day' : 'days'}</span>`;
  if (n === 0) return `<span class="due-chip due-today">${icon('clock', 14)}Due today</span>`;
  if (n <= 3) return `<span class="due-chip due-soon">${icon('clock', 14)}Due in ${n} ${n === 1 ? 'day' : 'days'}</span>`;
  return `<span class="due-chip due-later">Due in ${n} days</span>`;
}

/* ---------- Time zone helpers ---------- */
function tzParts(d, tz) {
  const o = {};
  new Intl.DateTimeFormat('en-US', { timeZone: TZS[tz].id, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(d).forEach(p => { if (p.type !== 'literal') o[p.type] = +p.value; });
  o.hour = o.hour % 24;
  return o;
}
function wallToDate(y, m, d, h, mi, tz) {
  const guess = Date.UTC(y, m, d, h, mi);
  const p = tzParts(new Date(guess), tz);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return new Date(guess - (asUTC - guess));
}

/* ---------- Typed-date parsing: returns null (empty) or undefined (invalid) ---------- */
function parseDateText(s) {
  s = String(s || '').replace(/[,·]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  let y, m, d, x;
  if ((x = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) { y = +x[1]; m = +x[2] - 1; d = +x[3]; }
  else if ((x = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/))) { m = +x[1] - 1; d = +x[2]; y = +x[3]; if (y < 100) y += 2000; }
  else if ((x = s.match(/^([A-Za-z]{3,9})\.? (\d{1,2}) (\d{4})$/))) { m = MONTHS.indexOf(x[1].slice(0, 3).toLowerCase()); d = +x[2]; y = +x[3]; }
  else if ((x = s.match(/^(\d{1,2}) ([A-Za-z]{3,9})\.? (\d{4})$/))) { d = +x[1]; m = MONTHS.indexOf(x[2].slice(0, 3).toLowerCase()); y = +x[3]; }
  else return undefined;
  if (m < 0 || m > 11) return undefined;
  const dt = new Date(y, m, d);
  if (dt.getMonth() !== m || dt.getDate() !== d) return undefined;
  return dt;
}
function parseDateTimeText(s, tz) {
  s = String(s || '').replace(/\b(CT|ET|MT|PT|CST|CDT|EST|EDT|MST|MDT|PST|PDT)\b/gi, '').trim();
  if (!s) return null;
  const tm = s.match(/(\d{1,2}):(\d{2})\s*([ap]\.?\s?m\.?)?/i);
  let datePart = s, h = 9, mi = 0;
  if (tm) {
    datePart = (s.slice(0, tm.index) + ' ' + s.slice(tm.index + tm[0].length)).replace(/\bat\b|@/gi, ' ');
    h = +tm[1]; mi = +tm[2];
    if (tm[3]) { const pm = /p/i.test(tm[3]); if (h > 12) return undefined; if (h === 12) h = pm ? 12 : 0; else if (pm) h += 12; }
    if (h > 23 || mi > 59) return undefined;
  }
  const d = parseDateText(datePart);
  if (!d) return d === null ? undefined : undefined;
  return wallToDate(d.getFullYear(), d.getMonth(), d.getDate(), h, mi, tz);
}

/* ---------- Registry & triggers ---------- */
const DD = new Map();
let ddo = null;
const mobileQ = () => window.matchMedia('(max-width: 768px)').matches;
const CHEV = () => `<span class="dd-chev" aria-hidden="true">${icon('chevron-down', 16)}</span>`;
const STATUS_ICON = { 'on-track': 'clock', 'at-risk': 'alert', review: 'eye', blocked: 'block', complete: 'check' };
const STATUS_OPTS = () => Object.entries(STATUS).map(([k, v]) => ({ value: k, label: v, icon: STATUS_ICON[k] }));
const DATE_KINDS = ['date', 'datetime', 'range', 'month'];

function dd(id, cfg) {
  cfg.id = id;
  cfg.kind = cfg.kind || 'select';
  const prev = DD.get(id);
  if (prev && prev._loaded) cfg._loaded = true;
  DD.set(id, cfg);
  return ddMarkup(cfg);
}
const ddVal = id => { const c = DD.get(id); return c ? c.value : undefined; };
function ddMarkup(c) {
  const id = c.id, k = c.kind;
  const cls = ['dd', `dd-k-${k}`, c.size === 'sm' ? 'dd-sm' : '', c.error ? 'is-error' : '', c.disabled ? 'is-disabled' : '', c.demo || '', c.inline ? 'dd-inline' : ''].join(' ').replace(/\s+/g, ' ');
  const name = c.labelId ? `aria-labelledby="${c.labelId}"` : `aria-label="${esc(c.ariaLabel || c.title || 'Choose')}"`;
  const desc = [c.error ? `${id}-err` : '', c.hintId || ''].filter(Boolean).join(' ');
  const common = `id="${id}" ${name} aria-expanded="false" ${desc ? `aria-describedby="${desc}"` : ''} ${c.error ? 'aria-invalid="true"' : ''} ${c.disabled ? 'disabled' : ''}`;
  const err = c.error ? `<p class="dd-err" id="${id}-err">${icon('alert', 16)}<span>${esc(c.error)}</span></p>` : '';
  let inner;
  if (k === 'select' || k === 'combo') {
    const o = c.options.find(x => !x.sep && x.value === c.value);
    inner = `<button type="button" class="dd-trigger" ${common} role="combobox" aria-haspopup="listbox" aria-controls="dd-list" data-dd-open="${id}">${o && o.icon ? icon(o.icon, 16) : (c.icon ? icon(c.icon, 16) : '')}<span class="dd-value ${o ? '' : 'is-ph'}">${esc(o ? (c.prefix ? c.prefix + o.label : o.label) : (c.placeholder || 'Select'))}</span>${CHEV()}</button>`;
  } else if (k === 'status') {
    const s = c.value;
    inner = `<button type="button" class="dd-trigger dd-badge st-${s}" ${common} role="combobox" aria-haspopup="listbox" aria-controls="dd-list" data-dd-open="${id}">${icon(STATUS_ICON[s] || 'clock', 14)}<span class="dd-value">${esc(STATUS[s] || s)}</span>${c.disabled ? '' : CHEV()}</button>`;
  } else if (k === 'multi') {
    const vals = c.value || [], max = c.maxChips ?? 2;
    const lab = v => { const o = c.options.find(x => x.value === v); return o ? o : { label: v }; };
    const chips = vals.slice(0, max).map(v => `<span class="dd-chip">${esc(lab(v).short || lab(v).label)}<button type="button" class="dd-chip-x" data-dd-remove="${id}" data-v="${esc(v)}" aria-label="Remove ${esc(lab(v).label)}" ${c.disabled ? 'disabled' : ''}>${icon('x', 12)}</button></span>`).join('');
    const more = vals.length > max ? `<span class="dd-more" data-tip="${esc(vals.slice(max).map(v => lab(v).label).join(', '))}">+${vals.length - max}</span>` : '';
    inner = `<div class="dd-trigger dd-multi" data-dd-open="${id}">${chips}${more}<button type="button" class="dd-mbtn" ${common} role="combobox" aria-haspopup="listbox" aria-controls="dd-list"><span class="dd-value ${vals.length ? 'sr-only' : 'is-ph'}">${vals.length ? `${vals.length} selected: ${esc(vals.map(v => lab(v).label).join(', '))}` : esc(c.placeholder || 'Any')}</span>${CHEV()}</button></div>`;
  } else if (k === 'date' || k === 'datetime') {
    const txt = c._text != null ? c._text : (c.value ? (k === 'date' ? fmtD(c.value) : fmtDT(c.value)) : '');
    inner = `<div class="dd-trigger dd-inputwrap">${icon('calendar', 18)}<input type="text" class="dd-input" ${common} role="combobox" aria-haspopup="dialog" aria-controls="dd-pop" autocomplete="off" spellcheck="false" value="${esc(txt)}" placeholder="${esc(c.placeholder || (k === 'date' ? 'Nov 2, 2026' : 'Nov 2, 2026 · 3:30 PM'))}" data-dd-input="${id}"><button type="button" class="dd-calbtn" data-dd-open="${id}" data-focus-grid="1" tabindex="-1" aria-label="Open calendar" ${c.disabled ? 'disabled' : ''}>${CHEV()}</button></div>`;
  } else {
    const txt = k === 'range' ? (c.value ? fmtRange(c.value.start, c.value.end) : '') : monthLabel(c.value);
    inner = `<button type="button" class="dd-trigger" ${common} aria-haspopup="dialog" aria-controls="dd-pop" data-dd-open="${id}" data-focus-grid="1">${icon('calendar', 18)}<span class="dd-value ${txt ? '' : 'is-ph'}">${esc(txt || c.placeholder || 'Any date')}</span>${CHEV()}</button>`;
  }
  return `<div class="${cls}" data-dd="${id}">${inner}${err}</div>`;
}
function ddRefresh(id) {
  const c = DD.get(id), el = document.querySelector(`[data-dd="${id}"]`);
  if (!c || !el) return;
  const old = document.getElementById(id);
  const had = document.activeElement && el.contains(document.activeElement);
  const wasFocusEl = ddo && ddo.id === id && ddo.focusEl === old;
  el.outerHTML = ddMarkup(c);
  const t = document.getElementById(id);
  if (had && t) t.focus({ preventScroll: true });
  if (ddo && ddo.id === id && t) {
    ddo.trigger = t; ddo.anchor = t.closest('.dd') || t;
    ddo.anchor.classList.add('is-open'); t.setAttribute('aria-expanded', 'true');
    if (wasFocusEl) ddo.focusEl = t;
  }
}
function ddSet(id, v) { const c = DD.get(id); if (!c) return; c.value = v; c._text = null; c.error = null; ddRefresh(id); }
function ddError(id, msg) { const c = DD.get(id); if (!c) return; c.error = msg || null; ddRefresh(id); }

/* ---------- Open / close / place ---------- */
function ddOpen(id, opts = {}) {
  const c = DD.get(id);
  if (!c || c.disabled) return;
  if (ddo && ddo.id === id) { ddClose(true); return; }
  ddClose(false);
  closePop(false);
  const trigger = document.getElementById(id);
  if (!trigger) return;
  const anchor = trigger.closest('.dd') || trigger;
  const sheet = mobileQ();
  ddo = { id, c, trigger, anchor, sheet, q: c.initialQuery || '', active: -1, typed: '', typedAt: 0, list: [], focusEl: trigger };
  anchor.classList.add('is-open');
  trigger.setAttribute('aria-expanded', 'true');
  const pop = $('#dd-pop');
  pop.className = `dd-pop dd-pop-${c.kind}${sheet ? ' is-sheet' : ''}`;
  pop.removeAttribute('role'); pop.removeAttribute('aria-modal'); pop.removeAttribute('aria-label');
  pop.style.cssText = '';
  pop.hidden = false;
  if (sheet) { const s = $('#dd-scrim'); s.hidden = false; void s.offsetWidth; s.classList.add('is-open'); document.body.classList.add('no-scroll'); }
  if (DATE_KINDS.includes(c.kind)) dpStart(opts); else listStart();
  ddPlace();
  void pop.offsetWidth;
  pop.classList.add('is-open');
}
function ddClose(focusTrigger) {
  if (!ddo) return;
  const o = ddo;
  ddo = null;
  const pop = $('#dd-pop');
  pop.classList.remove('is-open'); pop.hidden = true; pop.innerHTML = ''; pop.style.cssText = '';
  const s = $('#dd-scrim'); s.classList.remove('is-open'); s.hidden = true;
  if (o.sheet && !layers.some(l => !l.allowScroll)) document.body.classList.remove('no-scroll');
  hideTip();
  const t = document.getElementById(o.id) || o.trigger;
  if (t) {
    t.setAttribute('aria-expanded', 'false');
    t.removeAttribute('aria-activedescendant');
    const a = t.closest('.dd'); if (a) a.classList.remove('is-open');
    if (focusTrigger && document.contains(t)) t.focus({ preventScroll: true });
  }
}
function ddPlace() {
  const o = ddo; if (!o) return;
  const pop = $('#dd-pop');
  if (o.sheet) return;
  const refEl = o.anchor.querySelector('.dd-trigger') || o.trigger;
  const r = refEl.getBoundingClientRect();
  pop.style.minWidth = Math.max(r.width, o.c.kind === 'menu' ? 220 : 0) + 'px';
  const pw = pop.offsetWidth, ph = pop.offsetHeight;
  let left = o.c.kind === 'menu' ? r.right - pw : r.left;
  left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
  let top = r.bottom + 6, above = false;
  if (top + ph > window.innerHeight - 8 && r.top - ph - 6 > 8) { top = r.top - ph - 6; above = true; }
  pop.style.left = left + 'px';
  pop.style.top = Math.max(8, top) + 'px';
  pop.classList.toggle('is-above', above);
}
const sheetHead = title => `<div class="dd-sheet-head" data-dd-drag><span class="dd-handle" aria-hidden="true"></span><div class="dd-sheet-title"><b>${esc(title)}</b><button type="button" class="icon-btn" data-dd-close aria-label="Close">${icon('x', 18)}</button></div></div>`;

/* ---------- List variants: select, combo, multi, status, menu ---------- */
function listStart() {
  const o = ddo, c = o.c, pop = $('#dd-pop');
  const isMenu = c.kind === 'menu';
  o.searchable = !isMenu && (c.kind === 'combo' || c.searchable || (o.sheet && c.options.length > 7));
  const title = c.title || c.ariaLabel || 'Choose';
  if (o.sheet) { pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-modal', 'true'); pop.setAttribute('aria-label', title); }
  pop.innerHTML = `${o.sheet ? sheetHead(title) : ''}
    ${o.searchable ? `<div class="dd-search">${icon('search', 16)}<input type="text" id="dd-q" class="dd-q" role="combobox" aria-expanded="true" aria-controls="dd-list" aria-autocomplete="list" autocomplete="off" aria-label="Search ${esc(title)}" placeholder="Search ${esc(title.toLowerCase())}" value="${esc(o.q)}"></div>` : ''}
    ${c.kind === 'multi' ? '<div class="dd-tools"><button type="button" class="text-btn" data-dd-all>Select all</button><button type="button" class="text-btn" data-dd-none>Clear</button></div>' : ''}
    <ul class="dd-list" id="dd-list" role="${isMenu ? 'menu' : 'listbox'}" ${c.kind === 'multi' ? 'aria-multiselectable="true"' : ''} aria-label="${esc(title)}" tabindex="-1"></ul>
    ${o.sheet && c.kind === 'multi' ? '<div class="dd-foot"><button type="button" class="btn btn-dark btn-block" data-dd-done>Done</button></div>' : ''}`;
  o.focusEl = o.searchable ? $('#dd-q') : (o.sheet || isMenu) ? $('#dd-list') : o.trigger;
  if (c.loadMs && (!c._loaded || c.alwaysLoad)) {
    o.loading = true; renderOpts();
    setTimeout(() => { if (ddo !== o) return; o.loading = false; c._loaded = true; renderOpts(); ddPlace(); }, reduced() ? 300 : c.loadMs);
  } else renderOpts();
  if (o.focusEl !== document.activeElement) o.focusEl.focus({ preventScroll: true });
  if (o.searchable && o.q) { const q = $('#dd-q'); q.setSelectionRange(q.value.length, q.value.length); }
}
function hl(label, q) {
  const i = label.toLowerCase().indexOf(q);
  if (i < 0 || !q) return esc(label);
  return `${esc(label.slice(0, i))}<mark>${esc(label.slice(i, i + q.length))}</mark>${esc(label.slice(i + q.length))}`;
}
function renderOpts() {
  const o = ddo; if (!o) return;
  const c = o.c, ul = $('#dd-list');
  if (o.loading) {
    ul.setAttribute('aria-busy', 'true');
    ul.innerHTML = [70, 52, 64].map(w => `<li class="dd-sk" role="presentation"><span class="sk" style="height:12px;width:${w}%"></span></li>`).join('') + '<li class="sr-only" role="presentation">Loading options</li>';
    return;
  }
  ul.removeAttribute('aria-busy');
  const q = o.q.trim().toLowerCase();
  const shown = c.options.filter(x => x.sep ? !q : (!q || `${x.label} ${x.sub || ''}`.toLowerCase().includes(q)));
  o.list = shown.filter(x => !x.sep);
  if (!o.list.length) {
    ul.innerHTML = `<li class="dd-empty" role="presentation"><span>No matches for “${esc(o.q)}”</span><button type="button" class="text-btn" data-dd-clearq>Clear search</button></li>`;
    setActive(-1);
    return;
  }
  let html = '', lastGroup = null, i = 0;
  shown.forEach(x => {
    if (x.sep) { html += '<li class="dd-sep" role="separator"></li>'; return; }
    if (x.group && x.group !== lastGroup) { html += `<li class="dd-group" role="presentation">${esc(x.group)}</li>`; lastGroup = x.group; }
    const sel = c.kind === 'multi' ? (c.value || []).includes(x.value) : c.value === x.value;
    const label = hl(x.label, q);
    const dis = x.disabled ? 'aria-disabled="true"' : '';
    if (c.kind === 'menu') {
      html += `<li role="menuitem" id="dd-o-${i}" class="dd-opt ${x.danger ? 'is-danger' : ''}" data-i="${i}" ${dis}>${icon(x.icon || 'arrow-right', 16)}<span class="dd-ol">${label}</span></li>`;
    } else if (c.kind === 'status') {
      html += `<li role="option" id="dd-o-${i}" class="dd-opt ${sel ? 'is-sel' : ''}" data-i="${i}" aria-selected="${sel}" ${dis}><span class="badge st-${x.value}">${icon(STATUS_ICON[x.value], 12)}${label}</span><span class="dd-check" aria-hidden="true">${sel ? icon('check', 16) : ''}</span></li>`;
    } else {
      html += `<li role="option" id="dd-o-${i}" class="dd-opt ${sel ? 'is-sel' : ''}" data-i="${i}" aria-selected="${sel}" ${dis}>${c.kind === 'multi' ? `<span class="dd-box" aria-hidden="true">${sel ? icon('check', 12) : ''}</span>` : ''}${x.icon ? icon(x.icon, 16) : ''}<span class="dd-ol"><span>${label}</span>${x.sub ? `<span class="dd-sub">${esc(x.sub)}</span>` : ''}</span>${c.kind !== 'multi' ? `<span class="dd-check" aria-hidden="true">${sel ? icon('check', 16) : ''}</span>` : ''}</li>`;
    }
    i++;
  });
  ul.innerHTML = html;
  if (o.active < 0 || o.active >= o.list.length) {
    const si = c.kind === 'multi' || c.kind === 'menu' ? -1 : o.list.findIndex(x => x.value === c.value);
    o.active = si >= 0 ? si : o.list.findIndex(x => !x.disabled);
  }
  setActive(o.active);
}
function setActive(i, scroll = true) {
  const o = ddo; if (!o) return;
  o.active = i;
  $$('#dd-list .dd-opt').forEach(li => li.classList.toggle('is-active', +li.dataset.i === i));
  const el = document.getElementById('dd-o-' + i), f = o.focusEl;
  if (!f) return;
  if (el) { f.setAttribute('aria-activedescendant', el.id); if (scroll) el.scrollIntoView({ block: 'nearest' }); }
  else f.removeAttribute('aria-activedescendant');
}
function moveActive(step) {
  const o = ddo, n = o.list.length; if (!n) return;
  let i = o.active;
  for (let k = 0; k < n; k++) { i = (i + step + n) % n; if (!o.list[i].disabled) break; }
  setActive(i);
}
function ddChoose(i) {
  const o = ddo; if (!o) return;
  const c = o.c = DD.get(o.id) || o.c;
  const x = o.list[i];
  if (!x || x.disabled) return;
  if (c.kind === 'menu') { ddClose(true); if (x.fn) x.fn(); return; }
  if (c.kind === 'multi') {
    const set = new Set(c.value || []);
    if (set.has(x.value)) set.delete(x.value); else set.add(x.value);
    c.value = c.options.filter(y => !y.sep && set.has(y.value)).map(y => y.value);
    c.error = null;
    ddRefresh(o.id); renderOpts(); setActive(i, false); ddPlace();
    if (c.onChange) c.onChange(c.value, c);
    return;
  }
  const prev = c.value;
  c.value = x.value; c.error = null;
  ddClose(true); ddRefresh(o.id);
  if (prev !== x.value && c.onChange) c.onChange(x.value, c, prev);
}
function ddMulti(all) {
  const o = ddo, c = o.c = DD.get(o.id) || o.c;
  c.value = all ? c.options.filter(x => !x.sep && !x.disabled).map(x => x.value) : [];
  ddRefresh(o.id); renderOpts(); ddPlace();
  if (c.onChange) c.onChange(c.value, c);
}
function listKey(e) {
  const o = ddo, inSearch = e.target.id === 'dd-q';
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); moveActive(1); return;
    case 'ArrowUp': e.preventDefault(); moveActive(-1); return;
    case 'Home': if (!inSearch) { e.preventDefault(); setActive(o.list.findIndex(x => !x.disabled)); } return;
    case 'End': if (!inSearch) { e.preventDefault(); let j = o.list.length - 1; while (j > 0 && o.list[j].disabled) j--; setActive(j); } return;
    case 'Enter': e.preventDefault(); e.stopPropagation(); if (o.active >= 0) ddChoose(o.active); return;
    case ' ': if (!inSearch) { e.preventDefault(); e.stopPropagation(); if (o.active >= 0) ddChoose(o.active); } return;
    case 'Escape': e.preventDefault(); e.stopPropagation(); ddClose(true); return;
    case 'Tab': ddClose(true); return;
    default:
      if (!inSearch && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const now = Date.now();
        o.typed = (now - o.typedAt < 650 ? o.typed : '') + e.key.toLowerCase();
        o.typedAt = now;
        const n = o.list.length, start = o.typed.length === 1 ? o.active + 1 : o.active;
        for (let k = 0; k < n; k++) { const j = (start + k + n) % n; if (!o.list[j].disabled && o.list[j].label.toLowerCase().startsWith(o.typed)) { setActive(j); break; } }
      }
  }
}

/* Action menus (row ⋯, profile, snooze) share the same surface. */
function openMenu(trigger, items, title) {
  if (!trigger.id) trigger.id = 'mt-' + Math.random().toString(36).slice(2, 8);
  const id = trigger.id;
  if (ddo && ddo.id === id) { ddClose(true); return; }
  DD.set(id, { id, kind: 'menu', title: title || trigger.getAttribute('aria-label') || 'Actions', options: items.map(it => it.sep ? { sep: true } : { value: it.label, label: it.label, icon: it.icon, danger: it.danger, disabled: it.disabled, fn: it.fn }) });
  ddOpen(id);
}

/* ---------- Date family: date, datetime, range, month ---------- */
const RANGE_PRESETS = [
  { k: 'today', label: 'Today', f: () => [TODAY, TODAY] },
  { k: 'yesterday', label: 'Yesterday', f: () => [addDays(-1), addDays(-1)] },
  { k: '7', label: 'Last 7 days', f: () => [addDays(-6), TODAY] },
  { k: '30', label: 'Last 30 days', f: () => [addDays(-29), TODAY] },
  { k: 'month', label: 'This month', f: () => [new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0)] },
  { k: 'lastmonth', label: 'Last month', f: () => [new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 1), new Date(TODAY.getFullYear(), TODAY.getMonth(), 0)] },
  { k: 'quarter', label: 'This quarter', f: () => { const q = Math.floor(TODAY.getMonth() / 3) * 3; return [new Date(TODAY.getFullYear(), q, 1), new Date(TODAY.getFullYear(), q + 3, 0)]; } },
  { k: 'custom', label: 'Custom', f: null }
];
const addMonths = (d, n) => { const t = new Date(d.getFullYear(), d.getMonth() + n, 1); const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate(); t.setDate(Math.min(d.getDate(), last)); return t; };
function dpDisabled(c, d) {
  if (c.min && startOf(d) < startOf(c.min)) return c.minReason || `Choose ${fmtD(c.min)} or later.`;
  if (c.max && startOf(d) > startOf(c.max)) return c.maxReason || `Choose ${fmtD(c.max)} or earlier.`;
  if (c.isDisabled) return c.isDisabled(d) || false;
  return false;
}
function dpStart(opts) {
  const o = ddo, c = o.c;
  o.view = c.kind === 'month' ? 'months' : 'days';
  const base = c.kind === 'range' ? (c.value && c.value.start) : c.kind === 'month' ? (c.value ? new Date(c.value.y, c.value.m, 1) : TODAY) : c.value;
  o.cursor = startOf(base || TODAY);
  if (c.min && o.cursor < startOf(c.min)) o.cursor = startOf(c.min);
  o.tmp = c.kind === 'range' ? (c.value ? { start: c.value.start, end: c.value.end } : { start: null, end: null }) : c.kind === 'datetime' ? (c.value ? new Date(c.value) : null) : null;
  o.preset = c.kind === 'range' && c.value ? (c.value.preset || 'custom') : null;
  o.hover = null;
  o.focusGrid = !!opts.focusGrid || o.sheet || c.kind === 'range' || c.kind === 'month';
  o.focusEl = o.trigger;
  dpRender(o.focusGrid);
}
function dpSel(c, o, d) {
  if (c.kind === 'date') return c.value && sameDay(c.value, d);
  if (c.kind === 'datetime') { if (!o.tmp) return false; const p = tzParts(o.tmp, tzKey()); return p.year === d.getFullYear() && p.month - 1 === d.getMonth() && p.day === d.getDate(); }
  return false;
}
function dpDaysHTML() {
  const o = ddo, c = o.c, cur = o.cursor;
  const first = new Date(cur.getFullYear(), cur.getMonth(), 1), gs = weekStart(first);
  const r = o.tmp && c.kind === 'range' ? o.tmp : null;
  let rows = '';
  for (let w = 0; w < 6; w++) {
    let cells = '';
    for (let k = 0; k < 7; k++) {
      const d = addDays(w * 7 + k, gs);
      const out = d.getMonth() !== cur.getMonth(), dis = dpDisabled(c, d);
      const m = c.markers ? c.markers(d) : null;
      const cnt = m ? m.risk + m.normal : 0;
      const sel = dpSel(c, o, d);
      const isStart = r && r.start && sameDay(d, r.start), isEnd = r && r.end && sameDay(d, r.end);
      const inR = r && r.start && r.end && d > r.start && d < r.end;
      const cls = ['dp-day', out ? 'is-out' : '', dis ? 'is-dis' : '', sameDay(d, TODAY) ? 'is-today' : '', sel ? 'is-sel' : '', isStart ? 'is-start' : '', isEnd ? 'is-end' : '', inR ? 'in-range' : ''].join(' ');
      const label = `${fmtLong(d)}, ${d.getFullYear()}${sameDay(d, TODAY) ? ', today' : ''}${cnt ? `, ${cnt} ${cnt === 1 ? 'deadline' : 'deadlines'}${m.risk ? `, ${m.risk} at risk` : ''}` : ''}${dis ? ', unavailable' : ''}${sel || isStart || isEnd ? ', selected' : ''}`;
      const tip = dis ? dis : cnt ? `${cnt} ${cnt === 1 ? 'deadline' : 'deadlines'}: ${m.titles.slice(0, 3).join('; ')}${m.titles.length > 3 ? '…' : ''}` : '';
      cells += `<span role="gridcell" aria-selected="${!!(sel || isStart || isEnd)}"><button type="button" class="${cls.replace(/\s+/g, ' ')}" data-dpd="${iso(d)}" tabindex="${sameDay(d, cur) ? 0 : -1}" aria-label="${esc(label)}" ${dis ? 'aria-disabled="true"' : ''} ${tip ? `data-tip="${esc(tip)}"` : ''}>${d.getDate()}${cnt ? `<span class="dp-dots" aria-hidden="true">${m.risk ? '<i class="dot-r"></i>' : ''}${m.normal ? '<i class="dot-g"></i>' : ''}</span>` : ''}</button></span>`;
    }
    rows += `<div role="row" class="dp-row">${cells}</div>`;
  }
  return `<div role="grid" class="dp-grid" aria-labelledby="dp-title"><div role="row" class="dp-row dp-dow">${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(n => `<span role="columnheader" aria-label="${n}">${n.slice(0, 2)}</span>`).join('')}</div>${rows}</div>`;
}
function dpMonthsHTML() {
  const o = ddo, c = o.c, y = o.cursor.getFullYear();
  return `<div class="dp-months" role="group" aria-label="Months in ${y}">${Array.from({ length: 12 }, (_, m) => {
    const allowed = c.monthAllowed ? c.monthAllowed(y, m) : true;
    const sel = c.kind === 'month' ? (c.value && c.value.y === y && c.value.m === m) : (o.cursor.getMonth() === m && c.kind !== 'month' && false);
    const isCur = y === TODAY.getFullYear() && m === TODAY.getMonth();
    const nm = new Date(y, m, 1).toLocaleDateString('en-US', { month: 'short' });
    return `<button type="button" class="dp-mo ${sel ? 'is-sel' : ''} ${isCur ? 'is-today' : ''}" data-dpm="${m}" tabindex="${o.cursor.getMonth() === m ? 0 : -1}" aria-label="${new Date(y, m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}${allowed ? '' : ', unavailable'}${sel ? ', selected' : ''}" ${allowed ? '' : `aria-disabled="true" data-tip="${esc(c.monthReason || 'Not available')}"`} aria-pressed="${!!sel}">${nm}</button>`;
  }).join('')}</div>`;
}
function dpYearsHTML() {
  const o = ddo, y0 = o.cursor.getFullYear() - (o.cursor.getFullYear() % 12);
  return `<div class="dp-months" role="group" aria-label="Years">${Array.from({ length: 12 }, (_, i) => { const y = y0 + i; return `<button type="button" class="dp-mo ${y === TODAY.getFullYear() ? 'is-today' : ''} ${y === o.cursor.getFullYear() ? 'is-sel' : ''}" data-dpy="${y}" tabindex="${y === o.cursor.getFullYear() ? 0 : -1}" aria-pressed="${y === o.cursor.getFullYear()}">${y}</button>`; }).join('')}</div>`;
}
function dpTimeHTML() {
  const o = ddo, tz = tzKey();
  const p = o.tmp ? tzParts(o.tmp, tz) : null;
  let items = '';
  for (let mins = 0; mins < 1440; mins += 15) {
    const h = Math.floor(mins / 60), mi = mins % 60;
    const lab = `${((h + 11) % 12) + 1}:${String(mi).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
    const on = p && p.hour === h && p.minute === mi;
    items += `<li><button type="button" class="dp-slot" data-dpt="${h}:${mi}" aria-pressed="${!!on}" tabindex="${on || (!p && mins === 540) ? 0 : -1}">${lab}</button></li>`;
  }
  return `<div class="dp-time"><p class="dp-tz" id="dp-tz">Time · ${TZS[tz].name} (${tz})</p><ul class="dp-times" aria-labelledby="dp-tz">${items}</ul></div>`;
}
function dpRender(focus) {
  const o = ddo; if (!o) return;
  const c = o.c, pop = $('#dd-pop');
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-label', c.title || (c.kind === 'range' ? 'Choose a date range' : c.kind === 'month' ? 'Choose a month' : 'Choose a date'));
  if (o.sheet) pop.setAttribute('aria-modal', 'true');
  const hadFocus = pop.contains(document.activeElement);
  const y = o.cursor.getFullYear();
  const title = o.view === 'days' ? o.cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : o.view === 'months' ? String(y) : `${y - (y % 12)} – ${y - (y % 12) + 11}`;
  const unit = o.view === 'days' ? 'month' : o.view === 'months' ? 'year' : '12 years';
  const titleBtn = o.view === 'years' ? `<span class="dp-title" id="dp-title" aria-live="polite">${title}</span>` : `<button type="button" class="dp-title" id="dp-title" data-dp-up aria-live="polite" aria-label="${title}. Choose ${o.view === 'days' ? 'month and year' : 'year'}">${title}${icon('chevron-down', 14)}</button>`;
  const presets = c.kind === 'range' ? `<div class="dp-presets" role="group" aria-label="Quick ranges">${RANGE_PRESETS.map(p => `<button type="button" class="dp-preset ${o.preset === p.k ? 'is-on' : ''}" data-dp-preset="${p.k}" aria-pressed="${o.preset === p.k}">${p.label}</button>`).join('')}</div>` : '';
  const legend = c.markers && o.view === 'days' ? '<p class="dp-legend"><span><i class="dot-r"></i>At-risk deadline</span><span><i class="dot-g"></i>Deadline</span></p>' : '';
  const r = o.tmp && c.kind === 'range' ? o.tmp : null;
  const status = c.kind === 'range' ? `<p class="dp-status" aria-live="polite">${r && r.start ? (r.end ? fmtRange(r.start, r.end) : `${fmtD(r.start)} – choose an end date`) : 'Choose a start date'}</p>` : c.kind === 'datetime' ? `<p class="dp-status" aria-live="polite">${o.tmp ? fmtDT(o.tmp) : 'Choose a day, then a time'}</p>` : '';
  const left = c.kind === 'month' ? `<button type="button" class="btn btn-quiet btn-sm" data-dp-today>This month</button>` : `<button type="button" class="btn btn-quiet btn-sm" data-dp-today>Today</button>${c.required ? '' : '<button type="button" class="btn btn-quiet btn-sm" data-dp-clear>Clear</button>'}`;
  const right = c.kind === 'range' ? '<button type="button" class="btn btn-ghost btn-sm" data-dp-cancel>Cancel</button><button type="button" class="btn btn-primary btn-sm" data-dp-apply>Apply</button>' : c.kind === 'datetime' ? `<button type="button" class="btn btn-dark btn-sm" data-dp-apply ${o.tmp ? '' : 'disabled'}>Done</button>` : '';
  pop.innerHTML = `${o.sheet ? sheetHead(c.title || 'Choose a date') : ''}<div class="dp-body">${presets}<div class="dp-main">
    <div class="dp-head"><button type="button" class="icon-btn dp-nav" data-dp-step="-1" aria-label="Previous ${unit}">${icon('chevron-left', 18)}</button>${titleBtn}<button type="button" class="icon-btn dp-nav" data-dp-step="1" aria-label="Next ${unit}">${icon('chevron-right', 18)}</button></div>
    ${o.view === 'days' ? dpDaysHTML() : o.view === 'months' ? dpMonthsHTML() : dpYearsHTML()}${legend}${status}</div>${c.kind === 'datetime' && o.view === 'days' ? dpTimeHTML() : ''}</div>
    <div class="dp-foot"><span class="grp">${left}</span><span class="grp">${right}</span></div>`;
  if (c.kind === 'datetime') { const s = $('.dp-slot[tabindex="0"]', pop); if (s) { const list = s.closest('.dp-times'); if (o.sheet) list.scrollLeft = s.offsetLeft - list.clientWidth / 2 + s.offsetWidth / 2; else list.scrollTop = s.offsetTop - list.clientHeight / 2; } }
  if (focus || hadFocus) { const f = $('.dp-day[tabindex="0"], .dp-mo[tabindex="0"]', pop); if (f) f.focus({ preventScroll: true }); }
  ddPlace();
}
function dpPreview() {
  const o = ddo; if (!o || o.c.kind !== 'range') return;
  const r = o.tmp, h = o.hover;
  $$('#dd-pop .dp-day').forEach(b => {
    const d = parseISO(b.dataset.dpd);
    b.classList.toggle('in-preview', !!(r.start && !r.end && h && ((d > r.start && d <= h) || (d < r.start && d >= h))));
  });
}
function dpPick(d) {
  const o = ddo, c = o.c;
  const why = dpDisabled(c, d);
  if (why) { const b = $(`.dp-day[data-dpd="${iso(d)}"]`); if (b) showTip(b, why); return; }
  o.cursor = d;
  if (c.kind === 'date') { dpCommit(d); return; }
  if (c.kind === 'datetime') {
    const tz = tzKey(), p = o.tmp ? tzParts(o.tmp, tz) : { hour: 9, minute: 0 };
    o.tmp = wallToDate(d.getFullYear(), d.getMonth(), d.getDate(), p.hour, p.minute, tz);
    dpRender(true); return;
  }
  if (c.kind === 'range') {
    const r = o.tmp; o.preset = 'custom';
    if (!r.start || r.end) { r.start = d; r.end = null; }
    else if (d < r.start) { r.end = r.start; r.start = d; }
    else r.end = d;
    o.hover = null;
    dpRender(true);
  }
}
function dpCommit(v) {
  const o = ddo, c = o.c = DD.get(o.id) || o.c;
  const prev = c.value;
  c.value = v; c._text = null; c.error = null;
  ddClose(true); ddRefresh(c.id);
  if (c.onChange) c.onChange(v, c, prev);
}
function dpKey(e) {
  const o = ddo, c = o.c, t = e.target, pop = $('#dd-pop');
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); ddClose(true); return; }
  if (!pop.contains(t)) {
    if (t.classList.contains('dd-input')) {
      if (e.key === 'ArrowDown') { e.preventDefault(); const f = $('.dp-day[tabindex="0"]', pop); if (f) f.focus(); }
      else if (e.key === 'Tab') ddClose(false);
      else if (e.key === 'Enter') { ddClose(false); }
    } else if (e.key === 'Tab') ddClose(false);
    return;
  }
  if (e.key === 'Tab') {
    const f = focusables([pop]);
    if (!f.length) return;
    if (e.shiftKey && t === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && t === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    e.stopPropagation();
    return;
  }
  if (t.classList.contains('dp-day')) {
    const d = parseISO(t.dataset.dpd);
    let n = null;
    switch (e.key) {
      case 'ArrowLeft': n = addDays(-1, d); break;
      case 'ArrowRight': n = addDays(1, d); break;
      case 'ArrowUp': n = addDays(-7, d); break;
      case 'ArrowDown': n = addDays(7, d); break;
      case 'Home': n = weekStart(d); break;
      case 'End': n = addDays(6, weekStart(d)); break;
      case 'PageUp': n = addMonths(d, e.shiftKey ? -12 : -1); break;
      case 'PageDown': n = addMonths(d, e.shiftKey ? 12 : 1); break;
      case 'Enter': case ' ': e.preventDefault(); e.stopPropagation(); dpPick(d); return;
      default: return;
    }
    e.preventDefault(); e.stopPropagation();
    const monthChanged = n.getMonth() !== o.cursor.getMonth() || n.getFullYear() !== o.cursor.getFullYear();
    o.cursor = n;
    if (c.kind === 'range' && o.tmp.start && !o.tmp.end) o.hover = n;
    if (monthChanged) dpRender(true);
    else {
      $$('#dd-pop .dp-day').forEach(b => b.setAttribute('tabindex', b.dataset.dpd === iso(n) ? '0' : '-1'));
      const b = $(`#dd-pop .dp-day[data-dpd="${iso(n)}"]`); if (b) b.focus();
      dpPreview();
    }
    return;
  }
  if (t.classList.contains('dp-mo')) {
    const all = $$('#dd-pop .dp-mo'), i = all.indexOf(t);
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[e.key];
    if (step) { e.preventDefault(); e.stopPropagation(); const j = Math.max(0, Math.min(all.length - 1, i + step)); all.forEach(b => b.setAttribute('tabindex', '-1')); all[j].setAttribute('tabindex', '0'); all[j].focus(); }
    return;
  }
  if (t.classList.contains('dp-slot') && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault(); e.stopPropagation();
    const all = $$('#dd-pop .dp-slot'), j = Math.max(0, Math.min(all.length - 1, all.indexOf(t) + (e.key === 'ArrowDown' ? 1 : -1)));
    all[j].focus(); all[j].scrollIntoView({ block: 'nearest' });
  }
}
function dpClick(t) {
  const o = ddo, c = o.c;
  const b = t.closest('button'); if (!b) return;
  if (b.dataset.dpd) { dpPick(parseISO(b.dataset.dpd)); return; }
  if (b.dataset.dpStep) {
    const s = +b.dataset.dpStep;
    o.cursor = o.view === 'days' ? addMonths(o.cursor, s) : o.view === 'months' ? addMonths(o.cursor, 12 * s) : addMonths(o.cursor, 144 * s);
    dpRender(false); return;
  }
  if (b.hasAttribute('data-dp-up')) { o.view = o.view === 'days' ? 'months' : 'years'; dpRender(true); return; }
  if (b.dataset.dpm != null) {
    if (b.getAttribute('aria-disabled') === 'true') { showTip(b, b.dataset.tip || 'Not available'); return; }
    const m = +b.dataset.dpm;
    if (c.kind === 'month') { dpCommit({ y: o.cursor.getFullYear(), m }); return; }
    o.cursor = new Date(o.cursor.getFullYear(), m, Math.min(o.cursor.getDate(), 28)); o.view = 'days'; dpRender(true); return;
  }
  if (b.dataset.dpy) { o.cursor = new Date(+b.dataset.dpy, o.cursor.getMonth(), 1); o.view = 'months'; dpRender(true); return; }
  if (b.dataset.dpt) {
    const [h, mi] = b.dataset.dpt.split(':').map(Number), base = o.tmp ? tzParts(o.tmp, tzKey()) : { year: o.cursor.getFullYear(), month: o.cursor.getMonth() + 1, day: o.cursor.getDate() };
    if (!o.tmp && dpDisabled(c, o.cursor)) { showTip(b, dpDisabled(c, o.cursor)); return; }
    o.tmp = wallToDate(base.year, base.month - 1, base.day, h, mi, tzKey());
    dpRender(false); const nb = $(`#dd-pop .dp-slot[data-dpt="${h}:${mi}"]`); if (nb) nb.focus({ preventScroll: true });
    return;
  }
  if (b.dataset.dpPreset) {
    const p = RANGE_PRESETS.find(x => x.k === b.dataset.dpPreset);
    o.preset = p.k;
    if (p.f) { const [s, e] = p.f(); o.tmp = { start: s, end: e }; o.cursor = startOf(e); dpRender(false); const nb = $(`#dd-pop [data-dp-preset="${p.k}"]`); if (nb) nb.focus(); }
    else { o.tmp = { start: null, end: null }; dpRender(true); }
    return;
  }
  if (b.hasAttribute('data-dp-today')) {
    if (c.kind === 'month') { const ok = !c.monthAllowed || c.monthAllowed(TODAY.getFullYear(), TODAY.getMonth()); if (ok) dpCommit({ y: TODAY.getFullYear(), m: TODAY.getMonth() }); else showTip(b, c.monthReason || 'Not available'); return; }
    if (c.kind === 'range') { o.tmp = { start: TODAY, end: TODAY }; o.preset = 'today'; o.cursor = TODAY; dpRender(false); return; }
    o.cursor = TODAY; o.view = 'days';
    if (c.kind === 'date') { const why = dpDisabled(c, TODAY); if (why) { showTip(b, why); return; } dpCommit(TODAY); return; }
    dpPick(TODAY); return;
  }
  if (b.hasAttribute('data-dp-clear')) { if (c.kind === 'range') { o.tmp = { start: null, end: null }; o.preset = null; dpRender(false); return; } dpCommit(null); return; }
  if (b.hasAttribute('data-dp-cancel')) { ddClose(true); return; }
  if (b.hasAttribute('data-dp-apply')) {
    if (c.kind === 'range') { const r = o.tmp; dpCommit(r.start ? { start: r.start, end: r.end || r.start, preset: o.preset } : null); return; }
    if (c.kind === 'datetime' && o.tmp) dpCommit(new Date(o.tmp));
  }
}
function ddCommitTyped(id) {
  const c = DD.get(id), inp = document.getElementById(id);
  if (!c || !inp || !['date', 'datetime'].includes(c.kind)) return true;
  const txt = inp.value;
  const cur = c.value ? (c.kind === 'date' ? fmtD(c.value) : fmtDT(c.value)) : '';
  if (txt === cur && !c.error) return true;
  const v = c.kind === 'date' ? parseDateText(txt) : parseDateTimeText(txt, tzKey());
  if (v === undefined) { c._text = txt; c.error = c.kind === 'date' ? 'Enter a date like Nov 2, 2026, 11/02/2026 or 2026-11-02.' : 'Enter a date and time like Nov 2, 2026 3:30 PM.'; ddRefresh(id); return false; }
  if (v === null && c.required) { c._text = ''; c.error = c.requiredMsg || 'Choose a date.'; ddRefresh(id); return false; }
  const why = v ? dpDisabled(c, v) : false;
  if (why) { c._text = txt; c.error = why; ddRefresh(id); return false; }
  const prev = c.value;
  const changed = !(prev && v && prev.getTime() === v.getTime()) && prev !== v;
  c.value = v; c._text = null; c.error = null;
  ddRefresh(id);
  if (changed && c.onChange) c.onChange(v, c, prev);
  return true;
}

/* ---------- Tooltip (hover + focus) ---------- */
function showTip(el, text) {
  const t = $('#dd-tip'); if (!t || !text) return;
  t.textContent = text; t.hidden = false;
  const r = el.getBoundingClientRect(), tw = t.offsetWidth, th = t.offsetHeight;
  t.style.left = Math.max(8, Math.min(window.innerWidth - tw - 8, r.left + r.width / 2 - tw / 2)) + 'px';
  t.style.top = (r.top - th - 8 < 4 ? r.bottom + 8 : r.top - th - 8) + 'px';
}
function hideTip() { const t = $('#dd-tip'); if (t) t.hidden = true; }
document.addEventListener('mouseover', e => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el) showTip(el, el.dataset.tip); else hideTip(); });
document.addEventListener('focusin', e => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el) showTip(el, el.dataset.tip); else hideTip(); });

/* ---------- Event wiring (capture phase runs before page handlers) ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  const pop = $('#dd-pop');
  if (ddo && pop.contains(t)) {
    e.stopPropagation();
    if (t.closest('[data-dd-close]') || t.closest('[data-dd-done]')) { ddClose(true); return; }
    if (DATE_KINDS.includes(ddo.c.kind)) { dpClick(t); return; }
    if (t.closest('[data-dd-all]')) { ddMulti(true); return; }
    if (t.closest('[data-dd-none]')) { ddMulti(false); return; }
    if (t.closest('[data-dd-clearq]')) { ddo.q = ''; const q = $('#dd-q'); if (q) { q.value = ''; q.focus(); } renderOpts(); ddPlace(); return; }
    const li = t.closest('.dd-opt'); if (li) ddChoose(+li.dataset.i);
    return;
  }
  if (t.closest && t.closest('#dd-scrim')) { e.stopPropagation(); ddClose(true); return; }
  const rm = t.closest && t.closest('[data-dd-remove]');
  if (rm) {
    e.stopPropagation(); e.preventDefault();
    const c = DD.get(rm.dataset.ddRemove); if (!c || c.disabled) return;
    const label = rm.getAttribute('aria-label');
    c.value = (c.value || []).filter(v => v !== rm.dataset.v);
    ddRefresh(c.id);
    const nt = document.getElementById(c.id); if (nt) nt.focus({ preventScroll: true });
    if (c.onChange) c.onChange(c.value, c);
    announce(`${label.replace('Remove ', '')} removed`);
    return;
  }
  const inp = t.closest && t.closest('[data-dd-input]');
  if (inp) { if (!mobileQ() && !(ddo && ddo.id === inp.id)) ddOpen(inp.id, { focusGrid: false }); return; }
  const op = t.closest && t.closest('[data-dd-open]');
  if (op) {
    e.stopPropagation(); e.preventDefault();
    const c = DD.get(op.dataset.ddOpen);
    if (c && c.disabled) return;
    ddOpen(op.dataset.ddOpen, { focusGrid: !!op.dataset.focusGrid });
    return;
  }
  if (ddo && !ddo.anchor.contains(t)) ddClose(false);
}, true);
document.addEventListener('keydown', e => {
  if (!ddo) {
    const t = e.target;
    if (!t.matches) return;
    if (t.matches('.dd-trigger[role="combobox"], .dd-mbtn') && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); ddOpen(t.id); }
    else if (t.matches('.dd-trigger[aria-haspopup="dialog"]') && e.key === 'ArrowDown') { e.preventDefault(); ddOpen(t.id, { focusGrid: true }); }
    else if (t.matches('.dd-input') && e.key === 'ArrowDown') { e.preventDefault(); ddOpen(t.id, { focusGrid: true }); }
    else if (t.matches('.dd-input') && e.key === 'Enter') ddCommitTyped(t.id);
    return;
  }
  if (DATE_KINDS.includes(ddo.c.kind)) { if (e.key === 'Enter' && e.target.classList.contains('dd-input')) ddCommitTyped(e.target.id); dpKey(e); }
  else listKey(e);
}, true);
document.addEventListener('input', e => {
  if (ddo && e.target.id === 'dd-q') { ddo.q = e.target.value; ddo.active = -1; renderOpts(); ddPlace(); }
  if (e.target.classList && e.target.classList.contains('dd-input') && ddo && ddo.id === e.target.id && ddo.c.kind === 'date') {
    const v = parseDateText(e.target.value);
    if (v && !(ddo.cursor && sameDay(v, ddo.cursor))) { ddo.cursor = v; dpRender(false); }
  }
});
document.addEventListener('focusout', e => {
  const t = e.target;
  if (!t.classList || !t.classList.contains('dd-input')) return;
  const rel = e.relatedTarget;
  if (rel && (t.closest('.dd').contains(rel) || $('#dd-pop').contains(rel))) return;
  setTimeout(() => { if (!(ddo && ddo.id === t.id && $('#dd-pop').contains(document.activeElement))) { if (ddo && ddo.id === t.id && !$('#dd-pop').contains(document.activeElement)) ddClose(false); ddCommitTyped(t.id); } }, 0);
});
document.addEventListener('mousemove', e => {
  if (!ddo) return;
  const li = e.target.closest && e.target.closest('#dd-pop .dd-opt');
  if (li && +li.dataset.i !== ddo.active) setActive(+li.dataset.i, false);
  const day = e.target.closest && e.target.closest('#dd-pop .dp-day');
  if (day && ddo.c.kind === 'range' && ddo.tmp && ddo.tmp.start && !ddo.tmp.end) { const d = parseISO(day.dataset.dpd); if (!ddo.hover || !sameDay(d, ddo.hover)) { ddo.hover = d; dpPreview(); } }
});
window.addEventListener('scroll', e => {
  if (!ddo || ddo.sheet) return;
  if ($('#dd-pop').contains(e.target)) return;
  const r = ddo.anchor.getBoundingClientRect();
  if (!document.contains(ddo.anchor) || r.bottom < 0 || r.top > window.innerHeight) ddClose(false); else ddPlace();
}, true);
window.addEventListener('resize', () => { if (ddo && ddo.sheet !== mobileQ()) ddClose(false); else if (ddo) ddPlace(); });
(() => {
  let y0 = null, dy = 0;
  document.addEventListener('pointerdown', e => { if (ddo && ddo.sheet && e.target.closest('[data-dd-drag]') && !e.target.closest('button')) { y0 = e.clientY; dy = 0; $('#dd-pop').style.transition = 'none'; } });
  document.addEventListener('pointermove', e => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); $('#dd-pop').style.transform = `translateY(${dy}px)`; });
  document.addEventListener('pointerup', () => { if (y0 == null) return; const p = $('#dd-pop'); p.style.transition = ''; p.style.transform = ''; y0 = null; if (dy > 90) ddClose(true); });
})();
