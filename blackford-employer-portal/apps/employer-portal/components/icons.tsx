import type { ReactNode, SVGProps } from "react";

/**
 * Outline icon set for the portal (24×24 grid, 1.75 stroke, round caps).
 * Icons inherit `currentColor`, so they follow the semantic color tokens.
 */
function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function BuildingIcon() {
  return (
    <Icon>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8.5 7.5h1M14.5 7.5h1M8.5 11.5h1M14.5 11.5h1" />
      <path d="M10 21v-4h4v4" />
    </Icon>
  );
}

export function DocumentCheckIcon() {
  return (
    <Icon>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="m9 14.5 2 2 4-4" />
    </Icon>
  );
}

export function UploadIcon() {
  return (
    <Icon>
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
      <path d="M12 15V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
    </Icon>
  );
}

export function UsersIcon() {
  return (
    <Icon>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <path d="M18.2 14.3A6.5 6.5 0 0 1 21.5 20" />
    </Icon>
  );
}

export function ChartIcon() {
  return (
    <Icon>
      <path d="M4 20h16" />
      <path d="M7 16v-4" />
      <path d="M12 16V6" />
      <path d="M17 16v-7" />
    </Icon>
  );
}

export function BanknoteIcon() {
  return (
    <Icon>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.75" />
      <path d="M6 10v4M18 10v4" />
    </Icon>
  );
}

export function SignOutIcon() {
  return (
    <Icon width="18" height="18">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </Icon>
  );
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon width="14" height="14" strokeWidth="2.25" {...props}>
      <g className="toggle-chevron-arm">
        <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
      </g>
    </Icon>
  );
}
