"use client";
import ArcLogo from "./ArcLogo";

interface SidebarProps {
  onNewChat: () => void;
}

const NAV_ITEMS = [
  { icon: "add", label: "New Chat", isAction: true },
  { icon: "history", label: "History" },
  { icon: "bookmark", label: "Saved" },
  { icon: "analytics", label: "Insights" },
];

const BOTTOM_ITEMS = [
  { icon: "settings", label: "Settings" },
  { icon: "help_outline", label: "Help" },
];

export default function Sidebar({ onNewChat }: SidebarProps) {
  return (
    <aside
      className="hidden md:flex flex-col h-screen flex-shrink-0 p-4 gap-1 z-40"
      style={{
        width: 272,
        background: "#0e1320",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* ─── Logo ─── */}
      <div className="flex items-center gap-3 mb-7 px-2 pt-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(173,198,255,0.10)",
            border: "1px solid rgba(173,198,255,0.15)",
          }}
        >
          <ArcLogo size={26} />
        </div>
        <div>
          <h2 className="text-base font-bold text-primary font-headline tracking-tighter leading-tight">
            ARC
          </h2>
          <p className="text-[11px] mt-0.5 font-medium" style={{ color: "#424754" }}>
            V2.4 Ethereal
          </p>
        </div>
      </div>

      {/* ─── Nav ─── */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) =>
          item.isAction ? (
            <button
              key={item.label}
              onClick={onNewChat}
              id="new-chat-btn"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
              style={{
                background: "rgba(173,198,255,0.10)",
                color: "#adc6ff",
                border: "1px solid rgba(173,198,255,0.14)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(173,198,255,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(173,198,255,0.10)";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ) : (
            <button
              key={item.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-white/[0.04] active:scale-[0.98]"
              style={{ color: "#64748b" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#dee2f5";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        )}
      </nav>

      {/* ─── Bottom ─── */}
      <div className="mt-auto flex flex-col gap-1">
        {/* Fairness badge */}
        <div
          className="mb-3 p-3.5 rounded-2xl"
          style={{
            background: "rgba(78,222,163,0.06)",
            border: "1px solid rgba(78,222,163,0.10)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 15, color: "#4edea3" }}
            >
              verified_user
            </span>
            <span className="text-xs font-semibold font-headline" style={{ color: "#4edea3" }}>
              3-Agent Fairness
            </span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: "#64748b" }}>
            Every answer verified by Decision, Bias Audit & Judge agents.
          </p>
        </div>

        {/* Upgrade button */}
        <button
          id="upgrade-plan-btn"
          className="mb-2 liquid-light px-4 py-3 rounded-xl font-bold text-sm text-center transition-all duration-200 active:scale-[0.98] hover:opacity-90"
          style={{ color: "#00285d" }}
        >
          Upgrade Plan
        </button>

        {BOTTOM_ITEMS.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-white/[0.04] active:scale-[0.98]"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#dee2f5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
