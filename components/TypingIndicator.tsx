"use client";
import ArcLogo from "./ArcLogo";

export default function TypingIndicator() {
  return (
    <div className="flex flex-col items-start gap-3 msg-enter">
      {/* AI label */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "#252a38", boxShadow: "0 0 12px rgba(173,198,255,0.06)" }}
        >
          <ArcLogo size={18} />
        </div>
        <span
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: "#8c909f" }}
        >
          ARC
        </span>
      </div>

      {/* Typing card */}
      <div
        className="glass-panel rounded-2xl px-5 py-4"
        style={{
          background: "rgba(22,27,41,0.45)",
          border: "1px solid rgba(140,144,159,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Animated dots */}
          <div className="flex gap-1.5 items-center">
            <span
              className="typing-dot animate-dot1"
              style={{ background: "rgba(173,198,255,0.35)" }}
            />
            <span
              className="typing-dot animate-dot2"
              style={{ background: "rgba(173,198,255,0.6)" }}
            />
            <span
              className="typing-dot animate-dot3"
              style={{ background: "#adc6ff" }}
            />
          </div>

          {/* Status text */}
          <div className="flex flex-col gap-0.5">
            <span
              className="text-xs font-semibold tracking-wide uppercase font-headline"
              style={{ color: "#adc6ff" }}
            >
              Synthesizing Insights...
            </span>
            <span className="text-[11px]" style={{ color: "#424754" }}>
              Running 3-Agent fairness pipeline
            </span>
          </div>

          {/* Pipeline mini indicator */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            {["psychology", "policy", "gavel"].map((icon, i) => (
              <div
                key={icon}
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{
                  background: `rgba(173,198,255,${0.05 + i * 0.03})`,
                  border: "1px solid rgba(173,198,255,0.12)",
                  animationDelay: `${i * 0.4}s`,
                  opacity: 0.7,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 12, color: "#adc6ff" }}
                >
                  {icon}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
