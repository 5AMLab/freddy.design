"use client";
import { useEffect, type RefObject } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { PRELOADER_DONE_EVENT } from "@/components/motion/Preloader";

const BLEED = 28; // px of slack around the h1 so ripples never clip

const VERT = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform vec2 uMouse;
uniform float uStrength;
uniform float uTime;
uniform float uAspect;
varying vec2 vUv;
void main() {
  vec2 dir = (vUv - uMouse) * vec2(uAspect, 1.0);
  float dist = length(dir);
  float ripple = sin(dist * 22.0 - uTime * 5.0) * exp(-dist * 4.5) * uStrength;
  vec2 offset = dist > 0.0001 ? normalize(dir) * ripple * 0.035 : vec2(0.0);
  offset /= vec2(uAspect, 1.0);
  gl_FragColor = texture2D(tMap, vUv + offset);
}
`;

// Signature moment (MOTION.md): the hero headline liquefies subtly under
// the cursor and settles the instant it stops moving. The live h1 stays in
// the DOM (visually hidden) for accessibility and SEO; a WebGL canvas
// drawn from its exact computed metrics takes its place. Skipped entirely
// on touch, reduced motion, or missing WebGL.
export default function HeroDistortion({
  heroRef,
}: {
  heroRef: RefObject<HTMLElement>;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const hero = heroRef.current;
    const h1 = hero?.querySelector<HTMLElement>(".hero-v2-h1");
    if (!hero || !h1) return;

    let cancelled = false;
    let raf = 0;
    let renderer: Renderer | undefined;
    let observer: ResizeObserver | undefined;
    const listeners: Array<() => void> = [];

    const init = () => {
      if (cancelled) return;

      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: false,
        dpr: Math.min(window.devicePixelRatio, 2),
      });
      const gl = renderer.gl;
      if (!gl) return;

      const glCanvas = gl.canvas as HTMLCanvasElement;
      glCanvas.style.position = "absolute";
      glCanvas.style.left = `${-BLEED}px`;
      glCanvas.style.top = `${-BLEED}px`;
      glCanvas.style.pointerEvents = "none";
      h1.style.position = "relative";
      h1.appendChild(glCanvas);

      // Paint the headline into a 2D canvas, matching each DOM line's
      // computed font, colour and baseline so the swap is invisible.
      const source = document.createElement("canvas");
      const sctx = source.getContext("2d")!;
      const texture = new Texture(gl, { generateMipmaps: false });

      const lines = Array.from(h1.querySelectorAll<HTMLElement>(".line"));

      const drawTexture = () => {
        const rect = h1.getBoundingClientRect();
        const w = Math.ceil(rect.width) + BLEED * 2;
        const h = Math.ceil(rect.height) + BLEED * 2;
        const dpr = Math.min(window.devicePixelRatio, 2);
        source.width = w * dpr;
        source.height = h * dpr;
        sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sctx.clearRect(0, 0, w, h);

        lines.forEach((line) => {
          const target = line.querySelector<HTMLElement>("em") ?? line;
          const cs = getComputedStyle(target);
          const lr = line.getBoundingClientRect();
          const fontSize = parseFloat(cs.fontSize);
          sctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px Canela, serif`;
          sctx.fillStyle = cs.color;
          if ("letterSpacing" in sctx) {
            (sctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
              cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
          }
          const text = line.textContent ?? "";
          const m = sctx.measureText(text);
          const ascent = m.fontBoundingBoxAscent ?? fontSize * 0.8;
          const descent = m.fontBoundingBoxDescent ?? fontSize * 0.2;
          // CSS line box: baseline sits at half-leading + ascent
          const baseline =
            lr.top - rect.top + BLEED + (lr.height - (ascent + descent)) / 2 + ascent;
          sctx.fillText(text, lr.left - rect.left + BLEED, baseline);
        });

        texture.image = source;
        texture.needsUpdate = true;
        renderer!.setSize(w, h);
        return { w, h };
      };

      const { w, h } = drawTexture();

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          tMap: { value: texture },
          uMouse: { value: [0.5, 0.5] },
          uStrength: { value: 0 },
          uTime: { value: 0 },
          uAspect: { value: w / h },
        },
        transparent: true,
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      // hand over: DOM lines invisible, canvas takes their place
      lines.forEach((l) => (l.style.opacity = "0"));
      listeners.push(() => lines.forEach((l) => (l.style.opacity = "")));

      let strength = 0;
      let lastX = 0;
      let lastY = 0;
      const onMove = (e: MouseEvent) => {
        const r = glCanvas.getBoundingClientRect();
        program.uniforms.uMouse.value = [
          (e.clientX - r.left) / r.width,
          1 - (e.clientY - r.top) / r.height,
        ];
        const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        lastX = e.clientX;
        lastY = e.clientY;
        strength = Math.min(strength + speed * 0.012, 1);
      };
      hero.addEventListener("mousemove", onMove, { passive: true });
      listeners.push(() => hero.removeEventListener("mousemove", onMove));

      observer = new ResizeObserver(() => {
        const size = drawTexture();
        program.uniforms.uAspect.value = size.w / size.h;
      });
      observer.observe(h1);

      const start = performance.now();
      const loop = (now: number) => {
        strength *= 0.94; // settle the instant the cursor rests
        program.uniforms.uStrength.value = strength;
        program.uniforms.uTime.value = (now - start) / 1000;
        renderer!.render({ scene: mesh });
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    // wait for the entrance choreography to finish before taking over
    const arm = () => {
      document.fonts.ready.then(() => {
        if (!cancelled) setTimeout(init, 2700);
      });
    };
    if (document.documentElement.dataset.preloaderDone) arm();
    else window.addEventListener(PRELOADER_DONE_EVENT, arm, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener(PRELOADER_DONE_EVENT, arm);
      cancelAnimationFrame(raf);
      observer?.disconnect();
      listeners.forEach((fn) => fn());
      const glCanvas = renderer?.gl?.canvas as HTMLCanvasElement | undefined;
      glCanvas?.remove();
    };
  }, [heroRef]);

  return null;
}
