# freddy.design — Motion Brief

## Personality

**Slow. Heavy. Editorial.** Motion should feel like a luxury magazine being paged
through, not an app responding. Nothing bounces, nothing springs, nothing rushes.
Elements *settle* into place with weight. If an animation would feel at home in a
SaaS product, it's wrong here.

Reference feeling: a Canela headline should arrive the way a serif lands on a
printed page — masked line reveals, long decelerating eases, generous stagger.

## Principles

1. **Choreography over decoration.** Every section enters in a deliberate order:
   eyebrow label → headline lines → body → CTA / media. Never everything at once.
2. **Masks, not fades.** Headlines reveal line-by-line from behind a mask
   (translateY 110% → 0). Images scale down from 1.1 inside an overflow-hidden
   frame. Plain opacity fades are reserved for small supporting elements only.
3. **One signature moment per view.** The hero entrance is the showpiece. Below
   the fold, motion supports reading rhythm — it never competes with the work.
4. **The scroll is the timeline.** Scroll-linked effects (parallax, marquee
   velocity) drift subtly. If the user stops scrolling, everything rests.
5. **Restraint reads as luxury.** When in doubt, remove the animation.

## Tokens

| Token | Value | Use |
|---|---|---|
| `ease-out-luxe` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-ish out) | All entrances |
| `dur-reveal` | 1.1s | Headline line reveals |
| `dur-fade` | 0.9s | Supporting element fades |
| `dur-micro` | 0.3s | Hovers, links, buttons |
| `stagger-line` | 0.12s | Between headline lines |
| `stagger-item` | 0.1s | Between list/grid items |
| `distance` | 24px rise | Fade-up entrance offset |
| Scroll trigger | element top hits 88% viewport | Reveal start point |
| Lenis lerp | 0.1 | Global smooth scroll weight |

## Vocabulary

- **`line reveal`** — headline lines rise from behind a mask. Hero (on load),
  section H2s (on scroll).
- **`fade-up`** — opacity 0→1 + 24px rise, staggered per batch. Labels, body
  copy, cards, list rows.
- **`mask-scale`** — image at scale 1.1 inside clipped frame eases to 1.0 on
  entry; slow residual parallax while scrolling. Portfolio media. *(Phase 3)*
- **`drift`** — scroll-linked parallax at ≤8% of scroll delta. Hero stats block,
  CTA watermark. *(Phase 2)*

## Rules

- Entrances play **once**; nothing re-animates when scrolling back up.
- Hovers respond in ≤300ms; entrances may be slow, feedback may not.
- Max two properties animate per element (transform + opacity). No filters,
  no layout properties.
- `prefers-reduced-motion: reduce` → no smooth scroll, no entrances; content
  is simply visible. Hover feedback may remain (opacity only).
- 60fps floor: transform/opacity only, `will-change` applied by GSAP, never
  hand-set in CSS.
