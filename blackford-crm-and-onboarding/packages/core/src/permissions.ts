export type PermissionAction = "read" | "write" | "delete" | "admin";

export type PermissionResource =
  | "group"
  | "household"
  | "employee"
  | "enrollment"
  | "audit_log";

export interface PlatformUser {
  id: string;
  role: "staff" | "employer_hr" | "system";
}

/**
 * Stub: enforce RBAC once auth and policy tables exist.
 * @throws Error until implemented
 */
export function assertPermission(
  user: PlatformUser,
  action: PermissionAction,
  resource: PermissionResource,
): void {
  void user;
  void action;
  void resource;
  throw new Error(
    "assertPermission is not implemented — wire to policy service and audit on deny",
  );
}
