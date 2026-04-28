"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ChatInput from "@/components/ChatInput";
import Mascot from "@/components/Mascot";
import WelcomeScreen from "@/components/WelcomeScreen";
import AIResponseCard from "@/components/AIResponseCard";
import TypingIndicator from "@/components/TypingIndicator";
import { ChatMessage, MascotState } from "@/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [lastConfidence, setLastConfidence] = useState<string | undefined>();
  const [lastBias, setLastBias] = useState<string | undefined>();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = useCallback(
    async (text: string) => {
      if (isLoading) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setMascotState("thinking");

      try {
        const res = await fetch("/api/fair-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Something went wrong.");
        }


        if (!data?.answer && !data?.result) {
          throw new Error("Invalid API response");
        }

        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer || data.result || "No response",
          timestamp: new Date(),
          confidence: data.confidence,
          bias: data.bias,
        };

        setMessages((prev) => [...prev, aiMsg]);
        setLastConfidence(data.confidence);
        setLastBias(data.bias);
        setMascotState("responding");

        setTimeout(() => setMascotState("idle"), 1400);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred.";
        const errMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "error",
          content: message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
        setMascotState("idle");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setLastConfidence(undefined);
    setLastBias(undefined);
    setMascotState("idle");
  }, []);

  const handleSuggestion = useCallback(
    (text: string) => {
      handleSend(text);
    },
    [handleSend]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ─── Decorative ambient blobs ─── */}
      <div className="surface-glow-tr light-pulse" />
      <div className="surface-glow-bl light-pulse" style={{ animationDelay: "3s" }} />

      {/* ─── Sidebar ─── */}
      <Sidebar onNewChat={handleNewChat} />

      {/* ─── Main content ─── */}
      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <TopBar lastConfidence={lastConfidence} lastBias={lastBias} />

        {/* Chat scroll area */}
        <div
          id="chat-scroll-area"
          className="flex-1 overflow-y-auto pt-6 pb-48 w-full max-w-4xl mx-auto"
          style={{ scrollBehavior: "smooth", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
        >
          {messages.length === 0 && !isLoading ? (
            <WelcomeScreen onSuggestion={handleSuggestion} />
          ) : (
            <div className="flex flex-col gap-8">
              {messages.map((msg) => {
                if (msg.role === "user") {
                  return (
                    <div
                      key={msg.id}
                      className="flex flex-col items-end gap-2 max-w-[82%] ml-auto msg-enter"
                    >
                      <div
                        className="px-5 py-3.5 rounded-3xl text-sm leading-relaxed text-on-surface"
                        style={{
                          background: "#252a38",
                          borderTopRightRadius: 6,
                          border: "1px solid rgba(66,71,84,0.25)",
                        }}
                      >
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <span
                          className="text-xs font-medium"
                          style={{ color: "#64748b" }}
                        >
                          YOU •{" "}
                          {msg.timestamp.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                }

                if (msg.role === "error") {
                  return (
                    <div
                      key={msg.id}
                      className="msg-enter p-4 rounded-2xl text-sm leading-relaxed"
                      style={{
                        background: "rgba(255,180,171,0.06)",
                        border: "1px solid rgba(255,180,171,0.14)",
                        color: "#ffb4ab",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 16 }}
                        >
                          error
                        </span>
                        <span className="font-semibold text-xs uppercase tracking-widest">
                          Pipeline Error
                        </span>
                      </div>
                      {msg.content}
                      {msg.content.includes("GEMINI_API_KEY") && (
                        <p className="mt-2 text-xs" style={{ color: "#ffb4ab88" }}>
                          Add your key to <code>.env.local</code> and restart the dev server.
                        </p>
                      )}
                    </div>
                  );
                }

                return (
                  <AIResponseCard
                    key={msg.id}
                    answer={msg.content}
                    confidence={msg.confidence || "N/A"}
                    bias={msg.bias || "N/A"}
                    timestamp={msg.timestamp}
                  />
                );
              })}

              {isLoading && <TypingIndicator />}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Fixed input bar — rendered here but positioned fixed, so it sits above sidebar */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </main>

      {/* ─── Wolf mascot ─── */}
      <Mascot state={mascotState} />
    </div>
  );
}
