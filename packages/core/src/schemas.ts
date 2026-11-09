import { z } from "zod";

export const GroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  status: z.enum(["prospect", "active", "renewal", "terminated"]).default("active"),
  effectiveDate: z.string().date().optional(),
});

export type Group = z.infer<typeof GroupSchema>;

export const HouseholdSchema = z.object({
  id: z.string().uuid(),
  groupId: z.string().uuid().optional(),
  primaryName: z.string().min(1),
  memberCount: z.number().int().nonnegative().default(1),
});

export type Household = z.infer<typeof HouseholdSchema>;

export const EmployeeSchema = z.object({
  id: z.string().uuid(),
  groupId: z.string().uuid(),
  householdId: z.string().uuid().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  enrollmentStatus: z
    .enum(["not_started", "in_progress", "enrolled", "waived"])
    .default("not_started"),
});

export type Employee = z.infer<typeof EmployeeSchema>;
