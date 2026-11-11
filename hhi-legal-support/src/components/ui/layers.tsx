'use client';
/* Layers: Modal and Sheet. Ported from legacy openLayer/closeLayer — focus trap, Esc, scrim click,
   focus restore, body.no-scroll (and body.sheet-open while a sheet is open), 230ms exit transition. */
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/icons';
import { focusables, isVisible, lockScroll, reduced, trapTab } from './core';
import type { ModalProps, SheetProps } from './types';

let sheets = 0;

interface LayerProps {
  open: boolean;
  onClose(): void;
  initialFocus?: string;
  sheet?: boolean;
  panelRef: RefObject<HTMLElement | null>;
  children: ReactNode;
}

function Layer({ open, onClose, initialFocus, sheet, panelRef, children }: LayerProps) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useLayoutEffect(() => { closeRef.current = onClose; });

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current, panel = panelRef.current;
    if (!root || !panel) return;
    const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockScroll();
    if (sheet) { sheets++; document.body.classList.add('sheet-open'); }
    void root.offsetWidth;
    const raf = requestAnimationFrame(() => {
      root.classList.add('is-open');
      const target = (initialFocus && panel.querySelector<HTMLElement>(initialFocus)) || focusables(panel)[0] || panel;
      target.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove('is-open');
      unlock();
      if (sheet) { sheets = Math.max(0, sheets - 1); if (!sheets) document.body.classList.remove('sheet-open'); }
      if (prev && document.contains(prev) && isVisible(prev)) prev.focus({ preventScroll: true });
    };
  }, [open, sheet, initialFocus, panelRef]);

  useEffect(() => {
    if (open || !mounted) return;
    const t = setTimeout(() => setMounted(false), reduced() ? 0 : 230);
    return () => clearTimeout(t);
  }, [open, mounted]);

  if (!mounted || typeof document === 'undefined') return null;
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeRef.current(); return; }
    const panel = panelRef.current;
    if (e.key === 'Tab' && panel && panel.contains(e.target as Node)) { trapTab(e, panel); e.stopPropagation(); }
  };
  return createPortal(
    <div className="layer-root" ref={rootRef} style={sheet ? undefined : { zIndex: 110 }} onKeyDown={onKeyDown} aria-hidden={open ? undefined : true}>
      <div className="scrim" onClick={() => { if (open) closeRef.current(); }} />
      {children}
    </div>,
    document.body
  );
}

export function Modal({ open, onClose, title, children, footer, onSubmit, initialFocus }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inner = (
    <>
      <div className="modal-head">
        <h2 className="h3" id={titleId}>{title}</h2>
        <button className="icon-btn" type="button" aria-label="Close dialog" onClick={onClose}><Icon name="x" /></button>
      </div>
      <div className="modal-body">{children}</div>
      {footer ? <div className="modal-foot">{footer}</div> : null}
    </>
  );
  return (
    <Layer open={open} onClose={onClose} initialFocus={initialFocus} panelRef={panelRef}>
      <div className="modal on-light" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef} tabIndex={-1}>
        {onSubmit ? <form noValidate onSubmit={e => { e.preventDefault(); onSubmit(e); }}>{inner}</form> : inner}
      </div>
    </Layer>
  );
}

export function Sheet({ open, onClose, labelledBy, children, initialFocus }: SheetProps) {
  const panelRef = useRef<HTMLElement>(null);
  return (
    <Layer open={open} onClose={onClose} initialFocus={initialFocus} sheet panelRef={panelRef}>
      <aside className="sheet on-light" role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={panelRef} tabIndex={-1}>
        {children}
      </aside>
    </Layer>
  );
}
