import type { Messages } from "./messages/en";

declare module "next-intl" {
  interface AppConfig {
    Locale: "en" | "es";
    Messages: Messages;
  }
}
