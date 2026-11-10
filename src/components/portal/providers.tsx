"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect } from "react";
import { EnrollmentProvider, useEnrollment } from "@/lib/enrollment-store";
import en from "@/messages/en";
import es from "@/messages/es";

const catalogs = { en, es };
const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function IntlBridge({ children }: { children: React.ReactNode }) {
  const { state } = useEnrollment();

  useEffect(() => {
    document.documentElement.lang = state.locale;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [state.locale]);

  return (
    <NextIntlClientProvider
      locale={state.locale}
      messages={catalogs[state.locale]}
      // Scenario dates are built in local time, so format them in the runtime's own zone.
      timeZone={localTimeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
}

export function PortalProviders({ children }: { children: React.ReactNode }) {
  return (
    <EnrollmentProvider>
      <IntlBridge>{children}</IntlBridge>
    </EnrollmentProvider>
  );
}
