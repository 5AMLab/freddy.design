// Shared-element page transition state.
//
// The hero cloud (source) and a case-study page (destination) live in
// different route trees, so the "flight" — a project's preview image
// expanding into the case hero — can't be owned by either component. This
// tiny module is the hand-off point: the source records what's flying and
// from where, a page-level overlay (SharedElementOverlay, mounted once in the
// root layout so it survives the route change) reads it and animates, and the
// destination signals when its real hero is in place so the overlay can
// cross-fade out onto it.
//
// Deliberately framework-light: a module-level value + a subscriber set, not
// context or state — the overlay must react to a change fired from a click
// handler mid-navigation, before React would re-render anything.

export interface TransitionRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PendingTransition {
  /** Image the flight paints — the project's lead image (same src both ends). */
  src: string;
  /** Where the flight starts, in viewport coords (the source thumb's rect). */
  from: TransitionRect;
  /** Destination slug, for correlation / debugging. */
  slug: string;
  /** Perf-clock start, so the overlay can enforce its own failsafe timeout. */
  startedAt: number;
}

type Listener = (t: PendingTransition | null) => void;

let pending: PendingTransition | null = null;
const listeners = new Set<Listener>();

/** Begin a shared-element flight. Called from the source click handler right
 *  before navigation. Overwrites any in-flight transition (last click wins). */
export function startTransition(t: Omit<PendingTransition, "startedAt">) {
  pending = { ...t, startedAt: performance.now() };
  listeners.forEach((l) => l(pending));
}

/** Clear the transition (overlay done, or nothing flying). */
export function clearTransition() {
  if (!pending) return;
  pending = null;
  listeners.forEach((l) => l(null));
}

/** Current in-flight transition, if any — read once on overlay mount to catch
 *  a flight started on the previous page (full state is in-memory, so this
 *  only survives client-side navigation, which is exactly our case). */
export function getTransition(): PendingTransition | null {
  return pending;
}

export function subscribeTransition(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
