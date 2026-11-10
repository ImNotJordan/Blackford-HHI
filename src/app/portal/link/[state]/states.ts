export const LINK_STATES = ["expired", "welcome-back", "enrolled", "closed", "signed-out", "not-mine"] as const;
export type LinkState = (typeof LINK_STATES)[number];
