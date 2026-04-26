"use client";

import { useState, useEffect } from "react";
import { BiasLevel } from "@/types";
import ArcLogo from "./ArcLogo";

interface AIResponseCardProps {
  answer: string;
  confidence: string;
  bias: string;
  timestamp: Date;
}

function getBiasConfig(bias: string): {
  bg: string;
  text: string;
  icon: string;
  label: string;
  ringColor: string;
} {
  const b = (bias || "").toLowerCase() as BiasLevel;
  if (b === "low")
    return {
      bg: "rgba(78,222,163,0.10)",
      text: "#4edea3",
      icon: "check_circle",
      label: "Low Risk",
      ringColor: "#4edea3",
    };
  if (b === "medium")
    return {
      bg: "rgba(255,193,7,0.10)",
      text: "#ffc107",
      icon: "warning_amber",
      label: "Medium Risk",
      ringColor: "#ffc107",
    };
  return {
    bg: "rgba(255,180,171,0.10)",
    text: "#ffb4ab",
    icon: "error",
    label: "High Risk",
    ringColor: "#ff6b6b",
  };
}

function ConfidenceRing({ confidence }: { confidence: string }) {
  const [animated, setAnimated] = useState(false);
  const num = parseInt(confidence.replace("%", "")) || 80;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (num / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  const color = num >= 80 ? "#4edea3" : num >= 60 ? "#ffc107" : "#ffb4ab";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 48, height: 48 }}>
      <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx="24" cy="24" r={radius}
          fill="none"
          stroke="rgba(66,71,84,0.3)"
          strokeWidth="3"
        />
        {/* Progress */}
        <circle
          cx="24" cy="24" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? dashoffset : circumference}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
            filter: `drop-shadow(0 0 4px ${color}80)`,
          }}
        />
      </svg>
      <span
        className="absolute text-[10px] font-bold font-headline"
        style={{ color, lineHeight: 1 }}
      >
        {num}%
      </span>
    </div>
  );
}

export default function AIResponseCard({
  answer,
  confidence,
  bias,
  timestamp,
}: AIResponseCardProps) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const biasConfig = getBiasConfig(bias);
  const ts = timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div
      className="flex flex-col items-start gap-3 msg-enter"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      {/* AI label row */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "#252a38", boxShadow: "0 0 12px rgba(173,198,255,0.08)" }}
        >
          <ArcLogo size={18} />
        </div>
        <span
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: "#8c909f" }}
        >
          ARC — Verified
        </span>
      </div>

      {/* Main card */}
      <div
        className="glass-panel rounded-3xl w-full relative overflow-hidden card-hover-glow group"
        style={{
          background: "rgba(22,27,41,0.5)",
          border: "1px solid rgba(140,144,159,0.08)",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
        }}
      >
        {/* Light leak decoration (top-right) */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: "rgba(173,198,255,0.05)",
            filter: "blur(48px)",
          }}
        />

        {/* Overview header row */}
        <div
          className="flex items-center justify-between px-7 py-4"
          style={{ borderBottom: "1px solid rgba(66,71,84,0.12)" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, color: "#4edea3" }}
            >
              visibility
            </span>
            <span className="font-headline font-semibold text-sm text-on-surface">
              Overview
            </span>
          </div>
          <span className="text-xs" style={{ color: "#64748b" }}>
            {ts}
          </span>
        </div>

        {/* Answer body */}
        <div className="px-7 py-5 relative space-y-3">
          {answer
            .split(/\n\n+/)
            .map((para, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed font-body"
                style={{ color: "rgba(222,226,245,0.88)" }}
              >
                {para.replace(/^\*+\s?/, "").trim()}
              </p>
            ))}
        </div>

        {/* Metrics cards row */}
        <div
          className="flex flex-wrap gap-3 px-7 py-4"
          style={{ borderTop: "1px solid rgba(66,71,84,0.12)" }}
        >
          {/* Confidence chip with ring */}
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
            style={{
              background: "rgba(173,198,255,0.07)",
              border: "1px solid rgba(173,198,255,0.12)",
            }}
          >
            <ConfidenceRing confidence={confidence} />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "#64748b" }}>
                Confidence Score
              </p>
              <p className="text-sm font-bold font-headline text-primary leading-tight mt-0.5">
                {confidence}
              </p>
            </div>
          </div>

          {/* Bias chip */}
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
            style={{
              background: biasConfig.bg,
              border: `1px solid ${biasConfig.text}18`,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 22, color: biasConfig.text }}
            >
              {biasConfig.icon}
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "#64748b" }}>
                Bias Risk
              </p>
              <p
                className="text-sm font-bold font-headline leading-tight mt-0.5"
                style={{ color: biasConfig.text }}
              >
                {biasConfig.label}
              </p>
            </div>
          </div>

          {/* 3-Agent chip */}
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
            style={{
              background: "rgba(78,222,163,0.06)",
              border: "1px solid rgba(78,222,163,0.12)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 22, color: "#4edea3" }}
            >
              hub
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "#64748b" }}>
                Pipeline
              </p>
              <p className="text-sm font-bold font-headline text-tertiary leading-tight mt-0.5">
                3-Agent Verified
              </p>
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div
          className="flex items-center justify-between px-7 py-3"
          style={{ borderTop: "1px solid rgba(66,71,84,0.08)" }}
        >
          <div className="flex gap-0.5">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-white/5 hover:text-primary active:scale-95"
              style={{ color: "#8c909f" }}
              title="Copy answer"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                {copied ? "check" : "content_copy"}
              </span>
            </button>
            <button
              className="p-2 rounded-lg transition-all duration-200 hover:bg-white/5 hover:text-primary active:scale-95"
              style={{ color: "#8c909f" }}
              title="Regenerate"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                refresh
              </span>
            </button>
            <button
              className="p-2 rounded-lg transition-all duration-200 hover:bg-white/5 hover:text-primary active:scale-95"
              style={{ color: "#8c909f" }}
              title="Share"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                ios_share
              </span>
            </button>
            <button
              className="p-2 rounded-lg transition-all duration-200 hover:bg-white/5 hover:text-primary active:scale-95"
              style={{ color: "#8c909f" }}
              title="Thumbs up"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                thumb_up
              </span>
            </button>
          </div>
          <span className="text-[10px] tracking-wide" style={{ color: "#424754" }}>
            Accuracy verified via ARC v3
          </span>
        </div>
      </div>
    </div>
  );
}
