// The footer's big ghost wordmark — the studio logotype's outline variant
// (hollow letterforms, no fill), so the footer's dark field shows through it
// exactly as the old per-character CSS stroke treatment did.
//
// This used to spell "Kavea" out as individual <span> characters styled with
// -webkit-text-stroke (see git history). That was a stand-in for not having
// an actual logo file; now that one exists (public/studio-logo/kavea-outline.svg)
// it replaces the lettering wholesale instead of trying to fake a logo out of
// type.
//
// Kept as its own component rather than inlined into KloaqFooter so the split
// of "footer chrome" vs. "the wordmark" stays where the rest of the code
// expects it.
export default function KloaqFooterWordmark() {
  return (
    <div className="kloaq-footer-watermark" aria-hidden="true">
      <img src="/studio-logo/kavea-outline.svg" alt="" className="kloaq-footer-watermark-img" />
    </div>
  );
}
