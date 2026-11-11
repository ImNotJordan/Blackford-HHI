export interface AuditEntry {
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Stub: append hash-chained row via @blackford/db (see audit_log table).
 * No-op for now so callers can integrate without failing builds.
 */
export function appendAudit(entry: AuditEntry): void {
  void entry;
  // Intentionally no-op until worker/db pipeline is connected.
}
