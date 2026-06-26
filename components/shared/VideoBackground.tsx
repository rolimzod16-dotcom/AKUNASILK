"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type VideoBackgroundProps = {
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
};

export default function VideoBackground({
  src,
  poster,
  className,
  overlayClassName,
  children,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => undefined);
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-silk-indigo/70 via-silk-indigo/40 to-silk-cream/95",
          overlayClassName
        )}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}