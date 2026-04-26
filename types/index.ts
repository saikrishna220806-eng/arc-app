// types/index.ts

export type MessageRole = "user" | "assistant" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  confidence?: string;
  bias?: string;
}

export interface APIResponse {
  answer: string;
  confidence: string;
  bias: string;
  error?: string;
}

export type MascotState = "idle" | "thinking" | "responding";
export type BiasLevel = "Low" | "Medium" | "High" | "low" | "medium" | "high";
