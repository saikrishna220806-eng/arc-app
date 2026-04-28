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

        const safeText =
          typeof data?.answer === "string"
            ? data.answer
            : typeof data?.result === "string"
              ? data.result
              : "No response";

        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: safeText,
          timestamp: new Date(),
          confidence: data?.confidence ?? "N/A",
          bias: data?.bias ?? "Unknown",
        };

        setMessages((prev) => [...prev, aiMsg]);
        setLastConfidence(data?.confidence);
        setLastBias(data?.bias);
        setMascotState("responding");

        setTimeout(() => setMascotState("idle"), 1400);
      } catch (err) {
        const errMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "error",
          content: "Something went wrong.",
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
      {/* Decorative */}
      <div className="surface-glow-tr light-pulse"></div>
      <div
        className="surface-glow-bl light-pulse"
        style={{ animationDelay: "3s" }}
      ></div>

      <Sidebar onNewChat={handleNewChat} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar lastConfidence={lastConfidence} lastBias={lastBias} />

        <div className="flex-1 overflow-y-auto pt-6 pb-48 max-w-4xl mx-auto">
          {messages.length === 0 && !isLoading ? (
            <WelcomeScreen onSuggestion={handleSuggestion} />
          ) : (
            <div className="flex flex-col gap-6">
              {messages.map((msg) => {
                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="text-right">
                      {msg.content}
                    </div>
                  );
                }

                if (msg.role === "error") {
                  return (
                    <div key={msg.id} style={{ color: "red" }}>
                      {msg.content}
                    </div>
                  );
                }

                return (
                  <AIResponseCard
                    key={msg.id}
                    answer={
                      typeof msg.content === "string"
                        ? msg.content
                        : "No response"
                    }
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

        <ChatInput onSend={handleSend} disabled={isLoading} />
      </main>

      <Mascot state={mascotState} />
    </div>
  );
}