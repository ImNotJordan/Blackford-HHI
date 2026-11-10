import { notFound } from "next/navigation";
import { LinkStateScreen } from "./screen";
import { LINK_STATES, type LinkState } from "./states";

const titles: Record<LinkState, string> = {
  expired: "Link expired",
  "welcome-back": "Welcome back",
  enrolled: "Already enrolled",
  closed: "Enrollment closed",
  "signed-out": "Signed out",
  "not-mine": "Not my link",
};

export function generateStaticParams() {
  return LINK_STATES.map((state) => ({ state }));
}

export const dynamicParams = false;

function isLinkState(value: string): value is LinkState {
  return (LINK_STATES as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps<"/portal/link/[state]">) {
  const { state } = await params;
  return { title: isLinkState(state) ? titles[state] : "Not found" };
}

export default async function Page({ params }: PageProps<"/portal/link/[state]">) {
  const { state } = await params;
  if (!isLinkState(state)) notFound();
  return <LinkStateScreen state={state} />;
}
