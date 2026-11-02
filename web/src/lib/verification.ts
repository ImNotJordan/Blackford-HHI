/** Mock verification cases — SOW Module F (life events) + paper proof / staff approval. */

export type ProofKind = "image" | "pdf" | "scan";

export type ProofAsset = {
  id: string;
  label: string;
  kind: ProofKind;
  /** Inline mock “scan” — SVG data URI so proofs render without external assets */
  src: string;
  uploadedAt: string;
  fileName: string;
};

export type VerificationStatus =
  | "awaiting_proof"
  | "ready_for_review"
  | "needs_more_info"
  | "approved"
  | "returned";

export type VerificationCase = {
  id: string;
  type: "life_event" | "paper_signature" | "service_proof" | "census_exception";
  title: string;
  subject: string;
  group: string;
  eventDate: string;
  reportedAt: string;
  window: string;
  status: VerificationStatus;
  owner: string;
  notes: string;
  checklist: { id: string; label: string; required: boolean; done: boolean }[];
  proofs: ProofAsset[];
  href: string;
};

function mockDocSvg(opts: {
  title: string;
  subtitle: string;
  stamp: string;
  accent?: string;
}) {
  const accent = opts.accent ?? "#A8820F";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="820" viewBox="0 0 640 820">
  <rect width="640" height="820" fill="#F5F3EE"/>
  <rect x="28" y="28" width="584" height="764" fill="#FFFFFF" stroke="#DDD8CC" stroke-width="2"/>
  <rect x="28" y="28" width="584" height="72" fill="${accent}"/>
  <text x="320" y="72" text-anchor="middle" fill="#F5F3EE" font-family="Georgia, serif" font-size="28">${opts.title}</text>
  <text x="56" y="140" fill="#16130F" font-family="system-ui,sans-serif" font-size="16" font-weight="600">${opts.subtitle}</text>
  <line x1="56" y1="160" x2="584" y2="160" stroke="#DDD8CC"/>
  <text x="56" y="200" fill="#4A453E" font-family="ui-monospace,monospace" font-size="13">STATE OF FLORIDA · VITAL RECORDS</text>
  <text x="56" y="240" fill="#16130F" font-family="system-ui,sans-serif" font-size="14">Full legal name · Aisha Patel</text>
  <text x="56" y="270" fill="#16130F" font-family="system-ui,sans-serif" font-size="14">Event date · February 28, 2027</text>
  <text x="56" y="300" fill="#16130F" font-family="system-ui,sans-serif" font-size="14">County · Duval</text>
  <rect x="56" y="340" width="528" height="280" fill="#F7EBC5" stroke="#E8D9A0"/>
  <text x="320" y="480" text-anchor="middle" fill="#7A5C00" font-family="Georgia, serif" font-size="22">MOCK IMAGE PROOF</text>
  <text x="320" y="515" text-anchor="middle" fill="#4A453E" font-family="system-ui,sans-serif" font-size="13">For staff manual verification demo</text>
  <circle cx="500" cy="680" r="54" fill="none" stroke="#C8191E" stroke-width="3"/>
  <text x="500" y="686" text-anchor="middle" fill="#C8191E" font-family="system-ui,sans-serif" font-size="11" font-weight="700">${opts.stamp}</text>
  <text x="56" y="760" fill="#8C877D" font-family="ui-monospace,monospace" font-size="11">Blackford MVP · mock scan · not a real document</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const proofAssets = {
  birthCert: {
    id: "pf-birth",
    label: "Birth certificate",
    kind: "image" as const,
    src: mockDocSvg({
      title: "Certificate of Live Birth",
      subtitle: "Certified copy · mock",
      stamp: "CERTIFIED",
    }),
    uploadedAt: "Mar 1, 2027 · 4:22 PM",
    fileName: "birth-certificate-scan.jpg",
  },
  marriageLic: {
    id: "pf-marriage",
    label: "Marriage license",
    kind: "image" as const,
    src: mockDocSvg({
      title: "Marriage License",
      subtitle: "Clerk of court · mock",
      stamp: "FILED",
      accent: "#16130F",
    }),
    uploadedAt: "Feb 12, 2027 · 11:08 AM",
    fileName: "marriage-license.jpg",
  },
  addressProof: {
    id: "pf-address",
    label: "Utility bill",
    kind: "scan" as const,
    src: mockDocSvg({
      title: "Proof of Address",
      subtitle: "Utility statement · mock",
      stamp: "COPY",
      accent: "#7A5C00",
    }),
    uploadedAt: "Feb 28, 2027 · 9:01 AM",
    fileName: "utility-bill-feb.pdf",
  },
  idCard: {
    id: "pf-id",
    label: "Photo ID",
    kind: "image" as const,
    src: mockDocSvg({
      title: "Driver License",
      subtitle: "Florida · mock front",
      stamp: "VALID",
      accent: "#C8191E",
    }),
    uploadedAt: "Mar 2, 2027 · 2:40 PM",
    fileName: "fl-dl-front.jpg",
  },
  paperSign: {
    id: "pf-paper",
    label: "Paper election form",
    kind: "scan" as const,
    src: mockDocSvg({
      title: "Election Form",
      subtitle: "Wet-ink signature · mock",
      stamp: "SIGNED",
      accent: "#16130F",
    }),
    uploadedAt: "Mar 3, 2027 · 8:15 AM",
    fileName: "election-paper-scan.pdf",
  },
};

export const verificationCases: VerificationCase[] = [
  {
    id: "vr-101",
    type: "life_event",
    title: "Birth / adoption",
    subject: "Aisha Patel",
    group: "Harbor Light Manufacturing",
    eventDate: "2027-02-28",
    reportedAt: "Mar 1, 2027",
    window: "Inside 30 days",
    status: "ready_for_review",
    owner: "Maya Chen",
    notes: "Newborn Omar Patel Jr. · add as dependent after approval.",
    checklist: [
      { id: "v1", label: "Document is legible", required: true, done: true },
      { id: "v2", label: "Names match employee record", required: true, done: true },
      { id: "v3", label: "Event date within 30-day window", required: true, done: true },
      { id: "v4", label: "Certified / official copy", required: true, done: false },
      { id: "v5", label: "No signs of alteration", required: true, done: false },
    ],
    proofs: [proofAssets.birthCert, proofAssets.idCard],
    href: "/manager/verifications/vr-101",
  },
  {
    id: "vr-102",
    type: "life_event",
    title: "Address change",
    subject: "Marcus Lee",
    group: "Harbor Light Manufacturing",
    eventDate: "2027-02-20",
    reportedAt: "Feb 28, 2027",
    window: "Inside 30 days",
    status: "awaiting_proof",
    owner: "Maya Chen",
    notes: "Employee submitted request without a clear address document.",
    checklist: [
      { id: "v1", label: "Document is legible", required: true, done: false },
      { id: "v2", label: "Address matches form", required: true, done: false },
      { id: "v3", label: "Dated within 60 days", required: true, done: false },
    ],
    proofs: [],
    href: "/manager/verifications/vr-102",
  },
  {
    id: "vr-103",
    type: "life_event",
    title: "Marriage",
    subject: "Priya Shah",
    group: "Palm Coast Logistics",
    eventDate: "2027-01-05",
    reportedAt: "Feb 12, 2027",
    window: "Outside window",
    status: "needs_more_info",
    owner: "Maya Chen",
    notes: "Reported after 30 days — exception path. License looks complete.",
    checklist: [
      { id: "v1", label: "Document is legible", required: true, done: true },
      { id: "v2", label: "Names match employee record", required: true, done: true },
      { id: "v3", label: "Exception reason documented", required: true, done: false },
      { id: "v4", label: "Carrier allows late QLE", required: false, done: false },
    ],
    proofs: [proofAssets.marriageLic],
    href: "/manager/verifications/vr-103",
  },
  {
    id: "vr-104",
    type: "paper_signature",
    title: "Paper election upload",
    subject: "Elena Brooks",
    group: "Rivers & Reed LLP",
    eventDate: "2027-03-01",
    reportedAt: "Mar 3, 2027",
    window: "OE open",
    status: "ready_for_review",
    owner: "Maya Chen",
    notes: "Wet-ink fallback (Module E). Confirm signature and elections match portal.",
    checklist: [
      { id: "v1", label: "All pages present", required: true, done: true },
      { id: "v2", label: "Signature present & dated", required: true, done: true },
      { id: "v3", label: "Elections match census class", required: true, done: false },
    ],
    proofs: [proofAssets.paperSign],
    href: "/manager/verifications/vr-104",
  },
  {
    id: "vr-105",
    type: "service_proof",
    title: "ID card · address proof",
    subject: "James Ortega",
    group: "Individual / Medicare",
    eventDate: "2027-03-02",
    reportedAt: "Mar 2, 2027",
    window: "Service SLA · 2 days",
    status: "ready_for_review",
    owner: "Sam Ortiz",
    notes: "Client uploaded DL and utility bill for ID card reissue.",
    checklist: [
      { id: "v1", label: "Photo ID matches record", required: true, done: true },
      { id: "v2", label: "Mailing address confirmed", required: true, done: false },
    ],
    proofs: [proofAssets.idCard, proofAssets.addressProof],
    href: "/manager/verifications/vr-105",
  },
];

export function getVerificationCase(id: string) {
  return verificationCases.find((c) => c.id === id) ?? verificationCases[0];
}

export const verificationStatusLabel: Record<VerificationStatus, string> = {
  awaiting_proof: "Awaiting proof",
  ready_for_review: "Ready for review",
  needs_more_info: "Needs more info",
  approved: "Approved",
  returned: "Returned",
};
