'use client';
/* Inline-SVG charts ported from legacy drawLine (LineChart) and drawReportBars / adChart (HBarChart). */
import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { niceStep, sum } from '@/lib/format';
import type { HBarChartProps, LineChartProps } from './types';

/** Width of an element, tracked with a ResizeObserver. */
function useWidth(ref: RefObject<HTMLElement | null>, fallback: number) {
  const [w, setW] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const cw = Math.floor(entries[0]?.contentRect.width || 0);
      if (cw > 0) setW(cw);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

const tipKey = (c: string) => (c === 'var(--ink)' ? 'var(--ivory)' : c);
const fx = (n: number) => +n.toFixed(1);

/* =========================================================
   Line chart â€” hover crosshair + tooltip, â†/â†’/Home/End readout, end dots, end labels when they fit
   ========================================================= */
export function LineChart({ labels, series, ariaLabel, summary }: LineChartProps) {
  const sumId = useId();
  const holderRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const width = useWidth(holderRef, 600);
  const [idx, setIdx] = useState(-1);
  const [kbd, setKbd] = useState(false);

  const W = Math.max(280, width);
  const H = W < 520 ? 220 : 260;
  const m = { t: 16, r: 40, b: 30, l: 36 };
  const n = labels.length;
  const maxV = Math.max(0, ...series.flatMap(s => s.values));
  const step = niceStep(maxV / 4);
  const max = Math.max(step, Math.ceil((maxV * 1.08) / step) * step);
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const x = (i: number) => m.l + (n <= 1 ? iw / 2 : (i * iw) / (n - 1));
  const y = (v: number) => m.t + ih - (v / max) * ih;

  const ticks: number[] = [];
  for (let v = 0; v <= max + 0.001; v += step) ticks.push(+v.toFixed(4));
  const every = W < 520 ? Math.max(1, Math.ceil(n / 4)) : n > 8 ? 2 : 1;
  const ends = n ? series.map(s => ({ y: y(s.values[n - 1] ?? 0), v: s.values[n - 1] ?? 0, color: s.color })) : [];
  const sortedY = ends.map(e => e.y).sort((a, b) => a - b);
  const labelsFit = ends.length > 0 && sortedY.every((v, i) => i === 0 || v - sortedY[i - 1] >= 14);

  const show = (i: number) => setIdx(Math.max(0, Math.min(n - 1, i)));
  const hide = () => { setIdx(-1); setKbd(false); };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || !n) return;
    const r = svg.getBoundingClientRect();
    const px = (e.clientX - r.left) * (W / r.width);
    setKbd(false);
    show(n === 1 ? 0 : Math.round((px - m.l) / (iw / (n - 1))));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!n) return;
    let i: number | null = null;
    if (e.key === 'ArrowRight') i = idx < 0 ? n - 1 : idx + 1;
    else if (e.key === 'ArrowLeft') i = idx < 0 ? n - 1 : idx - 1;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = n - 1;
    if (i == null) return;
    e.preventDefault();
    setKbd(true);
    show(i);
  };

  const tw = 180;
  let tipLeft = idx >= 0 ? x(idx) + 14 : 0;
  if (tipLeft + tw > W) tipLeft = x(idx) - tw - 14;

  return (
    <>
      <div className="chart-wrap" tabIndex={0} role="group" aria-roledescription="chart"
        aria-label={`${ariaLabel}. Use the left and right arrow keys to read each value.`} aria-describedby={sumId}
        onKeyDown={onKey} onFocus={() => { setKbd(true); show(n - 1); }} onBlur={hide}>
        <div className="chart-svg" ref={holderRef}>
          {n ? (
            <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" onPointerMove={onMove} onPointerLeave={() => setIdx(-1)}>
              {ticks.map(v => (
                <g key={v}>
                  <line x1={m.l} x2={W - m.r} y1={fx(y(v))} y2={fx(y(v))} style={{ stroke: 'var(--hairline)' }} strokeWidth={1} />
                  <text x={m.l - 8} y={fx(y(v) + 4)} textAnchor="end" fontSize={11}>{v}</text>
                </g>
              ))}
              {labels.map((l, i) => ((n - 1 - i) % every === 0 ? <text key={i} x={fx(x(i))} y={H - 8} textAnchor="middle" fontSize={11}>{l}</text> : null))}
              {series.map((s, k) => {
                const d = 'M' + s.values.map((v, i) => `${fx(x(i))},${fx(y(v))}`).join('L');
                return (
                  <g key={k}>
                    {s.area ? <path d={`${d}L${fx(x(n - 1))},${fx(y(0))}L${fx(x(0))},${fx(y(0))}Z`} style={{ fill: s.color, fillOpacity: 0.12 }} /> : null}
                    <path d={d} fill="none" style={{ stroke: s.color }} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  </g>
                );
              })}
              {ends.map((e, k) => <circle key={k} cx={fx(x(n - 1))} cy={fx(e.y)} r={4.5} style={{ fill: e.color, stroke: 'var(--white)' }} strokeWidth={2} />)}
              {labelsFit ? ends.map((e, k) => <text key={k} x={fx(x(n - 1) + 10)} y={fx(e.y + 4)} fontSize={12} fontWeight={600}>{e.v}</text>) : null}
              {idx >= 0 ? (
                <g>
                  <line x1={fx(x(idx))} x2={fx(x(idx))} y1={m.t} y2={m.t + ih} style={{ stroke: 'var(--ink)' }} strokeOpacity={0.3} strokeWidth={1} />
                  {series.map((s, k) => <circle key={k} cx={fx(x(idx))} cy={fx(y(s.values[idx] ?? 0))} r={5} style={{ fill: s.color, stroke: 'var(--white)' }} strokeWidth={2} />)}
                </g>
              ) : null}
              <rect x={m.l - 10} y={0} width={iw + 20} height={H} style={{ fill: 'transparent' }} />
            </svg>
          ) : null}
        </div>
        <div className={idx >= 0 ? 'chart-tip show' : 'chart-tip'} aria-hidden="true" style={{ left: Math.max(0, tipLeft), top: m.t }}>
          {idx >= 0 ? (
            <>
              <b>{labels[idx]}</b>
              {series.map((s, k) => (
                <div className="row" key={k}><span><i className="key-line" style={{ background: tipKey(s.color) }} />{s.name}</span><strong>{s.values[idx]}</strong></div>
              ))}
            </>
          ) : null}
        </div>
      </div>
      <div className="legend">
        {series.map((s, k) => <span key={k}><i className="key-line" style={{ background: s.color }} />{s.name}</span>)}
      </div>
      <p className="sr-only" id={sumId}>{summary}</p>
      <p className="sr-only" aria-live="polite">{kbd && idx >= 0 ? `${labels[idx]}: ${series.map(s => `${s.name} ${s.values[idx]}`).join(', ')}` : ''}</p>
      <p className="chart-hint">Hover or use arrow keys for each value.</p>
    </>
  );
}

/* =========================================================
   Horizontal bar chart â€” label column (above bars when narrow), 16px bars with 4px rounded end,
   2px gap between stacked segments, value at the tip, hover tooltip
   ========================================================= */
function barPath(x0: number, y0: number, w: number, h: number) {
  const rr = Math.min(4, w / 2, h / 2);
  return `M${fx(x0)},${fx(y0)}h${fx(w - rr)}a${rr},${rr} 0 0 1 ${rr},${rr}v${fx(h - 2 * rr)}a${rr},${rr} 0 0 1 -${rr},${rr}h-${fx(w - rr)}z`;
}

export function HBarChart({ rows, ariaLabel, summary }: HBarChartProps) {
  const sumId = useId();
  const holderRef = useRef<HTMLDivElement>(null);
  const width = useWidth(holderRef, 560);
  const [idx, setIdx] = useState(-1);
  const [kbd, setKbd] = useState(false);

  const W = Math.max(260, width);
  const narrow = W < 560;
  const barH = 16, rowH = narrow ? 52 : 38;
  const totals = rows.map(r => sum(r.segments.map(s => Math.max(0, s.value))));
  const valTexts = rows.map((r, i) => r.valueText ?? String(totals[i]));
  const longest = Math.max(1, ...valTexts.map(t => t.length));
  const m = { l: narrow ? 0 : 210, r: Math.max(36, Math.ceil(longest * 7.5) + 14), t: 4 };
  const iw = Math.max(40, W - m.l - m.r);
  const maxV = Math.max(1, ...totals);
  const step = niceStep(maxV / 4) || 1;
  const max = Math.ceil(maxV / step) * step;
  const H = m.t + rowH * rows.length + 22;
  const ticks: number[] = [];
  for (let v = 0; v <= max + 0.001; v += step) ticks.push(+v.toFixed(4));

  const legendItems: { name: string; color: string }[] = [];
  rows.forEach(r => r.segments.forEach(s => { if (!legendItems.some(l => l.name === s.name)) legendItems.push({ name: s.name, color: s.color }); }));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = rows.length;
    if (!n) return;
    let i: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') i = Math.min(n - 1, idx + 1);
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') i = Math.max(0, idx < 0 ? 0 : idx - 1);
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = n - 1;
    if (i == null) return;
    e.preventDefault();
    setKbd(true);
    setIdx(i);
  };

  let tip: ReactNode = null, tipLeft = 0, tipTop = 0;
  const cur = idx >= 0 ? rows[idx] : null;
  if (cur) {
    const items = cur.tip ?? cur.segments.map(s => ({ label: s.name, value: s.value as ReactNode }));
    tip = <><b>{cur.label}</b>{items.map((t, k) => <div className="row" key={k}><span>{t.label}</span><strong>{t.value}</strong></div>)}</>;
    tipLeft = Math.max(0, Math.min(W - 190, m.l + (totals[idx] / max) * iw + 12));
    tipTop = m.t + idx * rowH - 4;
  }

  return (
    <>
      <div className="chart-wrap" tabIndex={0} role="group" aria-roledescription="chart"
        aria-label={`${ariaLabel}. Use the arrow keys to read each row.`} aria-describedby={sumId}
        onKeyDown={onKey} onFocus={() => { setKbd(true); setIdx(i => (i < 0 ? 0 : i)); }} onBlur={() => { setIdx(-1); setKbd(false); }}>
        <div className="chart-svg" ref={holderRef}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" onPointerLeave={() => setIdx(-1)}>
            {ticks.map(v => {
              const gx = fx(m.l + (v / max) * iw);
              return (
                <g key={v}>
                  <line x1={gx} x2={gx} y1={m.t} y2={H - 22} style={{ stroke: 'var(--hairline)' }} strokeWidth={1} />
                  <text x={gx} y={H - 6} textAnchor="middle" fontSize={11}>{v}</text>
                </g>
              );
            })}
            {rows.map((r, i) => {
              const top = m.t + i * rowH;
              const by = narrow ? top + 24 : top + (rowH - barH) / 2;
              const segs = r.segments.map(s => ({ ...s, w: (Math.max(0, s.value) / max) * iw })).filter(s => s.w > 0);
              let x0 = m.l;
              const bars = segs.map((s, k) => {
                const last = k === segs.length - 1;
                const w = last ? Math.max(2, s.w) : Math.max(0, s.w - 2);
                const el = last
                  ? <path key={k} d={barPath(x0, by, w, barH)} style={{ fill: s.color }} />
                  : <rect key={k} x={fx(x0)} y={fx(by)} width={fx(w)} height={barH} style={{ fill: s.color }} />;
                x0 += s.w;
                return el;
              });
              const tw = segs.length ? (totals[i] / max) * iw : 0;
              return (
                <g key={i}>
                  {narrow
                    ? <text x={0} y={top + 16} fontSize={12}>{r.label}</text>
                    : <text x={m.l - 12} y={fx(by + 12)} textAnchor="end" fontSize={12}>{r.label}</text>}
                  {bars}
                  <text x={fx(m.l + Math.max(2, tw) + 8)} y={fx(by + 12)} fontSize={12} fontWeight={600}>{valTexts[i]}</text>
                  <rect x={0} y={top} width={W} height={rowH} style={{ fill: 'transparent' }} onPointerEnter={() => { setKbd(false); setIdx(i); }} />
                </g>
              );
            })}
          </svg>
        </div>
        <div className={cur ? 'chart-tip show' : 'chart-tip'} aria-hidden="true" style={{ left: tipLeft, top: tipTop }}>{tip}</div>
      </div>
      {legendItems.length > 1 ? (
        <div className="legend">{legendItems.map(l => <span key={l.name}><i className="key-sq" style={{ background: l.color }} />{l.name}</span>)}</div>
      ) : null}
      <p className="sr-only" id={sumId}>{summary}</p>
      <p className="sr-only" aria-live="polite">{kbd && cur ? `${cur.label}: ${cur.segments.map(s => `${s.name} ${s.value}`).join(', ')}` : ''}</p>
    </>
  );
}
