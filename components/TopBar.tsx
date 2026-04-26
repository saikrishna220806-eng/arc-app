"use client";
import ArcLogo from "./ArcLogo";

interface TopBarProps {
  lastConfidence?: string;
  lastBias?: string;
}

export default function TopBar({ lastConfidence, lastBias }: TopBarProps) {
  const hasScore = !!lastConfidence;
  const confNum = hasScore ? parseInt(lastConfidence!.replace("%", "")) : 87;

  // Simple SVG mini ring for the top bar
  const radius = 10;
  const circ = 2 * Math.PI * radius;
  const dashoffset = hasScore
    ? circ - (confNum / 100) * circ
    : circ - 0.87 * circ;

  const ringColor =
    !hasScore || confNum >= 80
      ? "#4edea3"
      : confNum >= 60
      ? "#ffc107"
      : "#ffb4ab";

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(14,19,32,0.88)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        boxShadow: "0 16px 48px -12px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex justify-between items-center px-6 py-3 w-full">
        {/* Left */}
        <div className="flex items-center gap-6">
          {/* Mobile title */}
          <div className="flex items-center gap-2 md:hidden">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(173,198,255,0.10)", border: "1px solid rgba(173,198,255,0.15)" }}
            >
              <ArcLogo size={18} />
            </div>
            <h1 className="text-sm font-bold tracking-tighter text-primary font-headline">
              ARC
            </h1>
          </div>

          {/* Decision Score pill — desktop */}
          <div
            className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full"
            style={{
              background: "rgba(22,27,41,0.7)",
              border: "1px solid rgba(66,71,84,0.22)",
            }}
          >
            {/* Mini circular ring */}
            <div className="relative flex-shrink-0">
              <svg width="28" height="28" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="14" cy="14" r={radius}
                  fill="none"
                  stroke="rgba(66,71,84,0.3)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="14" cy="14" r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={dashoffset}
                  style={{
                    transition: "stroke-dashoffset 1s ease, stroke 0.4s ease",
                    filter: `drop-shadow(0 0 3px ${ringColor}90)`,
                  }}
                />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "#64748b" }}>
                Decision Score
              </p>
              <p className="text-xs font-bold font-headline text-primary leading-tight">
                {hasScore
                  ? `${lastConfidence} Confidence`
                  : "87% Confidence"}
              </p>
            </div>
          </div>

          {/* Bias tag — desktop, when available */}
          {hasScore && lastBias && (
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-headline"
              style={{
                background:
                  lastBias.toLowerCase() === "low"
                    ? "rgba(78,222,163,0.10)"
                    : lastBias.toLowerCase() === "medium"
                    ? "rgba(255,193,7,0.10)"
                    : "rgba(255,180,171,0.10)",
                color:
                  lastBias.toLowerCase() === "low"
                    ? "#4edea3"
                    : lastBias.toLowerCase() === "medium"
                    ? "#ffc107"
                    : "#ffb4ab",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                {lastBias.toLowerCase() === "low"
                  ? "check_circle"
                  : lastBias.toLowerCase() === "medium"
                  ? "warning_amber"
                  : "error"}
              </span>
              {lastBias} Bias Risk
            </div>
          )}

          {/* Always-visible pipeline label */}
          {!hasScore && (
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-headline"
              style={{
                background: "rgba(78,222,163,0.08)",
                color: "#4edea3",
                border: "1px solid rgba(78,222,163,0.12)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                hub
              </span>
              3-Agent Pipeline Active
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button
            id="topbar-gallery-btn"
            className="p-2 rounded-full transition-all duration-200 hover:bg-white/5 active:scale-95"
            style={{ color: "#64748b" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              gallery_thumbnail
            </span>
          </button>
          <button
            id="topbar-notifications-btn"
            className="p-2 rounded-full transition-all duration-200 hover:bg-white/5 active:scale-95"
            style={{ color: "#64748b" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              notifications
            </span>
          </button>
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ml-1"
            style={{
              background: "linear-gradient(135deg, #adc6ff 0%, #4d8eff 100%)",
              border: "2px solid rgba(173,198,255,0.2)",
              color: "#001a42",
            }}
          >
            FD
          </div>
        </div>
      </div>
    </header>
  );
}
