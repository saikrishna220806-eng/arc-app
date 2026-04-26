"use client";
import ArcLogo from "./ArcLogo";

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const SUGGESTIONS = [
  "Should I hire based on university name?",
  "Is remote work less productive than office work?",
  "Which career is best suited for introverts?",
  "Are older employees harder to manage?",
  "Should salary depend on negotiation skills?",
  "Is startup experience better than corporate?",
];

const PIPELINE_STEPS = [
  {
    icon: "psychology",
    label: "Decision Maker",
    desc: "Neutral factual analysis",
    color: "#adc6ff",
  },
  {
    icon: "policy",
    label: "Bias Auditor",
    desc: "Detects hidden assumptions",
    color: "#a4c9ff",
  },
  {
    icon: "gavel",
    label: "Final Judge",
    desc: "Issues the fair verdict",
    color: "#4edea3",
  },
];

export default function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-14 px-6 text-center gap-8">
      {/* ─── Icon ─── */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center relative"
          style={{
            background: "rgba(22,27,41,0.8)",
            border: "1px solid rgba(66,71,84,0.3)",
            boxShadow: "0 0 60px rgba(173,198,255,0.07), 0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{ background: "radial-gradient(circle at 40% 30%, rgba(173,198,255,0.08) 0%, transparent 60%)" }}
          />
          <ArcLogo size={48} />
        </div>

        {/* Title */}
        <div>
          <h1
            className="font-headline font-bold tracking-tighter text-on-surface"
            style={{ fontSize: 30 }}
          >
            ARC
          </h1>
          <p
            className="mt-2 text-sm max-w-xs mx-auto leading-relaxed"
            style={{ color: "#64748b" }}
          >
            Ask any question — I&apos;ll analyze it through a 3-Agent fairness pipeline and
            return a bias-checked, confident answer.
          </p>
        </div>
      </div>

      {/* ─── Pipeline steps ─── */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xl mx-auto p-5 rounded-3xl"
        style={{
          background: "rgba(22,27,41,0.45)",
          border: "1px solid rgba(66,71,84,0.12)",
        }}
      >
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl text-center transition-all duration-200 cursor-default"
              style={{
                background: `${step.color}0D`,
                border: `1px solid ${step.color}1F`,
                minWidth: 110,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 22, color: step.color }}
              >
                {step.icon}
              </span>
              <span
                className="text-xs font-bold font-headline"
                style={{ color: step.color }}
              >
                {step.label}
              </span>
              <span className="text-[10px] leading-tight" style={{ color: "#64748b" }}>
                {step.desc}
              </span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <span
                className="material-symbols-outlined flow-line"
                style={{ fontSize: 16, color: "#424754" }}
              >
                arrow_forward
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ─── Suggestion pills ─── */}
      <div className="w-full max-w-2xl">
        <p
          className="text-xs uppercase tracking-widest mb-4 font-semibold"
          style={{ color: "#424754" }}
        >
          Try asking...
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestion(s)}
              className="px-4 py-2.5 rounded-full text-sm font-body transition-all duration-200 active:scale-95 text-left"
              style={{
                background: "rgba(37,42,56,0.8)",
                border: "1px solid rgba(66,71,84,0.28)",
                color: "#c2c6d6",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "rgba(173,198,255,0.28)";
                el.style.background = "rgba(173,198,255,0.05)";
                el.style.color = "#adc6ff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "rgba(66,71,84,0.28)";
                el.style.background = "rgba(37,42,56,0.8)";
                el.style.color = "#c2c6d6";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
