/**
 * The client-roster qualifier that must accompany every logo wall on the site.
 *
 * The logos are brands worked with over a decade — in-house and through the
 * studio — NOT a current client roster, and not direct studio engagements.
 * Showing them unqualified overstates the studio's client list.
 *
 * Extracted into one component precisely so the homepage and /about wordings
 * cannot drift apart: they were maintained separately, and the homepage
 * simply never got the qualifier. Any new logo wall must render this too.
 */
export const CLIENT_ROSTER_NOTE =
  "Brands worked with over ten years — in-house and through the studio. Not a current client roster.";

export default function ClientRosterNote({
  className,
}: {
  /** Lets each surface keep its own caption styling; copy stays shared. */
  className?: string;
}) {
  return <p className={className}>{CLIENT_ROSTER_NOTE}</p>;
}
