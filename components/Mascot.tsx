"use client";

import { useEffect, useRef } from "react";
import { MascotState } from "@/types";

interface MascotProps {
  state: MascotState;
}

export default function Mascot({ state }: MascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStateRef = useRef<MascotState>("idle");

  // Swap animation class whenever state changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el || prevStateRef.current === state) return;

    el.classList.remove("mascot-float", "mascot-bounce", "mascot-pop");
    void el.offsetWidth; // restart animation
    if (state === "thinking")   el.classList.add("mascot-bounce");
    else if (state === "responding") el.classList.add("mascot-pop");
    else                        el.classList.add("mascot-float");

    prevStateRef.current = state;
  }, [state]);

  // Set initial float
  useEffect(() => {
    containerRef.current?.classList.add("mascot-float");
  }, []);

  const c = {
    idle:       { border: "rgba(173,198,255,0.35)", glow: "rgba(173,198,255,0.14)", dot: "#adc6ff", dotShadow: "0 0 10px rgba(173,198,255,0.7)" },
    thinking:   { border: "rgba(255,193,7,0.60)",   glow: "rgba(255,193,7,0.22)",   dot: "#ffc107", dotShadow: "0 0 12px rgba(255,193,7,0.9)"   },
    responding: { border: "rgba(78,222,163,0.60)",  glow: "rgba(78,222,163,0.22)",  dot: "#4edea3", dotShadow: "0 0 12px rgba(78,222,163,0.9)"  },
  }[state];

  const tooltip =
    state === "thinking"    ? "⚡ Analyzing fairness..."
    : state === "responding" ? "✓ Answer ready!"
    : "ARC";

  return (
    <div
      className="fixed z-50 group select-none bottom-32 right-3 w-16 h-16 md:bottom-6 md:right-6 md:w-[114px] md:h-[114px]"
    >
      {/* ──────── Ambient radial glow ──────── */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${c.glow} 0%, transparent 72%)`,
          transform: "scale(1.4)",
          transition: "background 0.5s ease",
        }}
      />

      {/* ──────── Spinning arc ring (SVG) ──────── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 114 114"
        style={{
          animation: `spin ${state === "thinking" ? "1.8" : "8"}s linear infinite`,
          transition: "none",
        }}
      >
        <defs>
          <linearGradient id={`arc-${state}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={c.dot} stopOpacity="0"   />
            <stop offset="55%"  stopColor={c.dot} stopOpacity="0.9" />
            <stop offset="100%" stopColor={c.dot} stopOpacity="0"   />
          </linearGradient>
        </defs>
        <circle cx="57" cy="57" r="54" fill="none"
          stroke={`url(#arc-${state})`} strokeWidth="2.5"
          strokeDasharray="95 245" strokeLinecap="round"
        />
      </svg>

      {/* ──────── Ping ring when thinking ──────── */}
      {state === "thinking" && (
        <div
          className="absolute inset-[-4px] rounded-full border-2 pointer-events-none animate-ping"
          style={{ borderColor: "rgba(255,193,7,0.4)", animationDuration: "1.1s" }}
        />
      )}

      {/* ──────── Status dot ──────── */}
      <div
        className="absolute top-1.5 right-1.5 z-20 w-3.5 h-3.5 rounded-full"
        style={{
          backgroundColor: c.dot,
          border: "2.5px solid #0e1320",
          boxShadow: c.dotShadow,
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        }}
      />

      {/* ──────── Mascot circle ──────── */}
      <div
        ref={containerRef}
        className="w-full h-full rounded-full overflow-hidden cursor-pointer group-hover:scale-105"
        style={{
          border: `2.5px solid ${c.border}`,
          boxShadow: `0 0 36px ${c.glow}, 0 12px 40px rgba(0,0,0,0.6)`,
          transition: "border-color 0.35s ease, box-shadow 0.35s ease, transform 0.3s ease",
        }}
      >
        {/*
          Layer 1: Wolf image (always shown as base layer)
          Layer 2: Video on top (transparent until loaded; hides itself if error)
          This way the wolf image is ALWAYS visible.
        */}
        <div className="relative w-full h-full">
          {/* Base: wolf image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot/wolf.png"
            alt="FairDecision AI Wolf"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter:
                state === "thinking"
                  ? "brightness(1.12) saturate(1.25) hue-rotate(10deg)"
                  : state === "responding"
                  ? "brightness(1.18) saturate(1.35)"
                  : "brightness(1.0) saturate(1.0)",
              transform: state === "responding" ? "scale(1.06)" : "scale(1.0)",
              transition: "filter 0.5s ease, transform 0.4s ease",
            }}
          />

          {/* Overlay tint per state */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                state === "thinking"
                  ? "linear-gradient(180deg, rgba(255,193,7,0.06) 0%, transparent 60%)"
                  : state === "responding"
                  ? "linear-gradient(180deg, rgba(78,222,163,0.08) 0%, transparent 60%)"
                  : "transparent",
              transition: "background 0.5s ease",
            }}
          />

          {/* Eye glow pulse (the wolf's cyan eyes sit at ~38% from top) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 38% 18% at 50% 37%, rgba(78,222,163,0.22) 0%, transparent 100%)",
              animation: "eyeGlow 2.8s ease-in-out infinite",
            }}
          />

          {/* Video layer on top — plays when wolf.mp4 is present */}
          <video
            src="/mascot/wolf.mp4"
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 1 }}
            onError={(e) => { (e.currentTarget as HTMLVideoElement).style.opacity = "0"; }}
          />
        </div>
      </div>

      {/* ──────── Keyframes ──────── */}
      <style>{`
        @keyframes spin     { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes eyeGlow  { 0%,100% { opacity:0.35; } 50% { opacity:1; } }
      `}</style>

      {/* ──────── Tooltip ──────── */}
      <div
        className="absolute bottom-full right-0 mb-3 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap
                   opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200"
        style={{
          background: "rgba(22,27,41,0.97)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(66,71,84,0.45)",
          color: "#dee2f5",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        {tooltip}
        <div
          className="absolute top-full right-4"
          style={{
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid rgba(22,27,41,0.97)",
          }}
        />
      </div>
    </div>
  );
}
