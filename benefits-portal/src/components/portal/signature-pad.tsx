"use client";

import SignaturePad from "signature_pad";
import { useEffect, useRef } from "react";

/** Drawn signature (signature_pad). Reports whether anything has been drawn. */
export function DrawnSignature({
  label,
  clearLabel,
  hint,
  invalid,
  describedBy,
  onChange,
}: {
  label: string;
  clearLabel: string;
  hint: string;
  invalid: boolean;
  describedBy?: string;
  onChange: (hasInk: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pad = new SignaturePad(canvas, { penColor: "#13212E", minWidth: 1, maxWidth: 2.6 });
    padRef.current = pad;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const data = pad.toData();
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();
      pad.fromData(data);
    };
    resize();
    window.addEventListener("resize", resize);
    const end = () => onChangeRef.current(!pad.isEmpty());
    pad.addEventListener("endStroke", end);

    return () => {
      window.removeEventListener("resize", resize);
      pad.removeEventListener("endStroke", end);
      pad.off();
      padRef.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold" id="pad-hint">
        {hint}
      </span>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        aria-describedby={["pad-hint", describedBy].filter(Boolean).join(" ")}
        className={`h-[140px] w-full touch-none rounded-xl bg-surface ${invalid ? "border-2 border-error-line" : "border border-dashed border-field"}`}
      />
      <button
        type="button"
        onClick={() => {
          padRef.current?.clear();
          onChange(false);
        }}
        className="min-h-11 self-end px-2 text-sm font-semibold text-brand hover:text-brand-hover"
      >
        {clearLabel}
      </button>
    </div>
  );
}
