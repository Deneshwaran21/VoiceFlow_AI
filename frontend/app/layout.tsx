import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceFlow AI — Real-Time Intelligent Voice Assistant",
  description: "Speak naturally. AI understands intent, extracts action items, schedules meetings, and responds with natural voice speech.",
  keywords: ["Voice AI", "LLM", "Action Intelligence", "Speech to Text", "FastAPI", "Next.js", "GenAI Workshop"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#090a0f] text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
