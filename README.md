# FairDecision AI — Unbiased Decision Assistant

> A production-ready AI chat assistant that delivers bias-checked, transparent decisions powered by a 3-Agent Gemini pipeline.

---

## ✨ Features

- **3-Agent Fairness Pipeline** — Decision Maker → Bias Auditor → Final Judge
- **Confidence Score** — Animated SVG progress ring showing answer reliability (0–100%)
- **Bias Risk Level** — Low / Medium / High with color-coded indicators
- **Ethereal Intelligence Design** — Glassmorphism dark UI matching the Stitch design system
- **Animated Wolf Mascot** — Floating, bouncing, popping states based on AI activity
- **Responsive** — Desktop, tablet, and mobile support

---

## 🚀 Quick Start

### 1. Get a Gemini API Key
Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.

### 2. Configure Environment
```bash
# Copy the example file
copy .env.local.example .env.local

# Edit .env.local and replace the placeholder
GEMINI_API_KEY=your_actual_key_here
```

### 3. Add Wolf Video *(optional)*
Place your wolf video at:
```
/public/mascot/wolf.mp4
```
The mascot widget will still render without the video (with a dark gradient fallback).

### 4. Install & Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧠 AI Pipeline Architecture

```
User Question
     │
     ▼
Agent A — Decision Maker
• Provides neutral factual answer
• Identifies assumptions & missing info
     │
     ▼
Agent B — Bias Auditor
• Checks for gender, age, cultural, economic bias
• Assigns initial Confidence Score
     │
     ▼
Agent C — Final Judge
• Merges Agent A + B findings
• Issues corrected final answer
• Returns: answer, confidence %, bias risk
     │
     ▼
  /api/fair-answer → JSON response
```

---

## 📁 Project Structure

```
fairdecision/
├── app/
│   ├── api/fair-answer/route.ts   # 3-Agent Gemini backend
│   ├── chat/page.tsx              # Main chat UI
│   ├── globals.css                # Design system + animations
│   └── layout.tsx                 # Root layout + SEO
├── components/
│   ├── AIResponseCard.tsx         # Answer card with metrics
│   ├── ChatInput.tsx              # Fixed input bar
│   ├── Mascot.tsx                 # Animated wolf widget
│   ├── Sidebar.tsx                # Navigation panel
│   ├── TopBar.tsx                 # Header with score display
│   ├── TypingIndicator.tsx        # Loading dots animation
│   └── WelcomeScreen.tsx          # Empty state / suggestions
├── lib/
│   └── gemini.ts                  # Gemini API helper
├── public/
│   └── mascot/wolf.mp4            # ← Place your wolf video here
└── types/index.ts                 # TypeScript definitions
```

---

## 🎨 Design System (Ethereal Intelligence)

| Token | Value | Use |
|---|---|---|
| `background` | `#0e1320` | Page background |
| `primary` | `#adc6ff` | Interactive accents |
| `tertiary` | `#4edea3` | Success / Low bias |
| `surface-container-high` | `#252a38` | Cards |
| `outline-variant` | `#424754` | Ghost borders |

Fonts: **Space Grotesk** (headlines) + **Inter** (body)

---

## 🐺 Wolf Mascot States

| State | Animation | Trigger |
|---|---|---|
| `idle` | Gentle float + rotate | Default |
| `thinking` | Bounce loop + ping ring | After user sends message |
| `responding` | Scale pop | When AI response arrives |

---

## 📡 API Reference

**POST `/api/fair-answer`**

Request:
```json
{ "question": "Should I hire based on university name?" }
```

Response:
```json
{
  "answer": "Hiring decisions should be based on...",
  "confidence": "84%",
  "bias": "Low"
}
```

---

*FairDecision AI may produce inaccurate information. Verify critical decisions independently.*
