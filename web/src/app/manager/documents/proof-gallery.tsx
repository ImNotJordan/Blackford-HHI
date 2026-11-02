"use client";

import { useState } from "react";
import {
  ProofImageCard,
  ProofLightbox,
} from "@/components/verification";
import type { ProofAsset } from "@/lib/verification";

export function DocumentsProofGallery({ proofs }: { proofs: ProofAsset[] }) {
  const [active, setActive] = useState<ProofAsset | null>(null);
  return (
    <div className="mb-4">
      <h2 className="mb-2 font-display text-lg text-ink">Recent image proofs</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {proofs.map((p) => (
          <ProofImageCard key={p.id} proof={p} onOpen={setActive} />
        ))}
      </div>
      <ProofLightbox proof={active} onClose={() => setActive(null)} />
    </div>
  );
}
