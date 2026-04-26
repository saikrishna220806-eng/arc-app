import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARC — Unbiased Decision Assistant",
  description:
    "ARC: AI-powered unbiased decision assistant with 3-agent fairness pipeline. Get transparent answers with confidence scores and bias risk analysis.",
  icons: { icon: "/favicon.ico" },
  keywords: ["AI", "bias detection", "fair decision", "unbiased AI", "ethical AI"],
  authors: [{ name: "ARC" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-background text-on-surface overflow-hidden h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
