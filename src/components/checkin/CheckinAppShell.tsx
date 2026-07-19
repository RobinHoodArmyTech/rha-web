import type { RobinJwtPayload } from "@/lib/robinAuth";
import CheckinNavbar from "./CheckinNavbar";

/**
 * Server shell for the check-in site. Receives the Robin session (or null) from
 * the layout and hands it to the navbar, which renders login vs. profile/logout.
 * Login is a redirect to Google (no modal), so no client state lives here.
 */
export default function CheckinAppShell({
  robin,
  children,
}: {
  robin: RobinJwtPayload | null;
  children: React.ReactNode;
}) {
  return (
    <>
      <CheckinNavbar robin={robin} />
      {children}
    </>
  );
}
