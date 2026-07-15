// The footer's big ghost wordmark. A flat, static fill — one colour, no
// gradient, no animation.
//
// This used to run a requestAnimationFrame loop that clipped a per-character
// "sunset" gradient (cream → gold → orange, descending) to the text, gated on
// an IntersectionObserver so the per-frame background-clip:text repaint only
// ran while the footer was actually being revealed. All of that is gone: the
// mark is now painted entirely in CSS (.kloaq-footer-watermark-char), which is
// why this needs no client hooks and no "use client" directive.
//
// Kept as its own component rather than inlined into KloaqFooter so the split
// of "footer chrome" vs. "the wordmark" stays where the rest of the code
// expects it.
const WORD = "freddi";

export default function KloaqFooterWordmark() {
  return (
    <div className="kloaq-footer-watermark" aria-hidden="true">
      {WORD.split("").map((ch, i) => (
        <span key={i} className="kloaq-footer-watermark-char">
          {ch}
        </span>
      ))}
    </div>
  );
}
