"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

// Sidebar is 272px wide on md+ screens
const SIDEBAR_W = 272;

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="fixed bottom-0 right-0 z-50"
      style={{
        // On md+ screens start after the sidebar; on mobile start at left:0
        left: 0,
      }}
    >
      {/* Fade-up gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to top, #0e1320 55%, transparent 100%)",
        }}
      />

      {/* Actual content: on desktop, indent by sidebar width */}
      <div
        className="relative pb-5 pt-6 px-4 md:px-6 flex flex-col items-center"
        style={{
          // Push content right by sidebar width on md+ screens
          // On mobile (< md = 768px) this gets overridden to 0 via media query below
          marginLeft: `clamp(0px, calc(${SIDEBAR_W}px * (100vw - 767px) / (100vw - 767px)), ${SIDEBAR_W}px)`,
        }}
      >
        <div className="w-full max-w-3xl relative" id="chat-input-bar">
          {/* Input pill */}
          <div
            className="glass-panel neon-focus rounded-full px-3 py-2 flex items-center gap-1.5 transition-all duration-300"
            style={{
              background: "rgba(37,42,56,0.7)",
              border: "1px solid rgba(140,144,159,0.09)",
              boxShadow: "0 24px 64px -16px rgba(0,0,0,0.5)",
            }}
          >
            {/* Add file button */}
            <button
              id="chat-add-btn"
              className="p-2 rounded-full transition-all duration-200 hover:bg-white/5 flex-shrink-0 active:scale-95"
              style={{ color: "#8c909f" }}
              disabled={disabled}
              title="Add content"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                add_circle
              </span>
            </button>

            {/* Attach button */}
            <button
              id="chat-attach-btn"
              className="p-2 rounded-full transition-all duration-200 hover:bg-white/5 flex-shrink-0 active:scale-95"
              style={{ color: "#8c909f" }}
              disabled={disabled}
              title="Attach file"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                attach_file
              </span>
            </button>

            {/* Text input */}
            <input
              ref={inputRef}
              id="chat-text-input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              disabled={disabled}
              placeholder="Ask ARC anything..."
              className="flex-1 bg-transparent border-none outline-none text-on-surface text-sm py-3 px-2 font-body disabled:opacity-50 placeholder:text-[#424754]"
              style={{ caretColor: "#adc6ff" }}
              autoFocus
              autoComplete="off"
            />

            {/* Send / Analyze button */}
            <button
              id="chat-send-btn"
              onClick={handleSend}
              disabled={disabled || !value.trim()}
              className="liquid-light flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 flex-shrink-0 disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90"
              style={{
                color: "#001a42",
                minWidth: 44,
                boxShadow:
                  disabled || !value.trim()
                    ? "none"
                    : "0 0 24px rgba(173,198,255,0.35), 0 4px 16px rgba(77,142,255,0.3)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
              >
                send
              </span>
              <span className="hidden sm:inline">Analyze</span>
            </button>
          </div>

          {/* Disclaimer */}
          <p
            className="text-center mt-3 tracking-widest uppercase font-medium"
            style={{ fontSize: 10, color: "rgba(140,144,159,0.4)" }}
          >
            ARC removes bias via 3-agent pipeline • Verify critical decisions
            independently
          </p>
        </div>
        {/* Inline responsive override: remove sidebar indent on mobile */}
        <style>{`
          @media (max-width: 767px) {
            #chat-input-bar-wrapper { margin-left: 0 !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
