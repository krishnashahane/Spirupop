"use client";

import { useEffect, useRef } from "react";

/**
 * Autoplaying, muted, looping background video that reliably starts on mobile.
 * iOS blocks autoplay when the muted DOM property isn't set (React quirk) and
 * fully blocks it under Low Power Mode until a user gesture — so we force the
 * property via ref and retry play() on the first touch/scroll/visibility change.
 */
export default function AutoVideo({
  src,
  className,
  poster,
}: {
  src: string;
  className?: string;
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.muted = true; // ensure the DOM property (not just attribute) is set
    const play = () => el.play().catch(() => {});
    play();

    const onGesture = () => play();
    const onVisible = () => document.visibilityState === "visible" && play();

    window.addEventListener("touchstart", onGesture, { passive: true, once: true });
    window.addEventListener("scroll", onGesture, { passive: true, once: true });
    document.addEventListener("visibilitychange", onVisible);
    el.addEventListener("canplay", play);

    return () => {
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("scroll", onGesture);
      document.removeEventListener("visibilitychange", onVisible);
      el.removeEventListener("canplay", play);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  );
}
