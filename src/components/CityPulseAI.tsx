import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Radio,
  Cpu,
  CornerDownLeft,
  Loader2,
  Copy,
  Check,
  MessageSquare,
  Smile,
  HelpCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';
import type { UnifiedTelemetry } from '../types/telemetry';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLiveAI?: boolean;
}

interface CityPulseAIProps {
  isOpen: boolean;
  onToggle: () => void;
  telemetry: UnifiedTelemetry;
}

export const CityPulseAI: React.FC<CityPulseAIProps> = ({
  isOpen,
  onToggle,
  telemetry,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: "Hello! 👋 I am **CityPulse AI**, your intelligent companion for **ECOSPHERE** by **Blossoms Convent School**.\n\nI know everything about our smart waste segregation, automated irrigation, atmospheric air sensors, and Arduino hardware—and I'm also here for everyday conversation, science questions, or smart city brainstorming!\n\nHow can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLiveAI: true,
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'chat' | 'project' | 'telemetry'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const analysisPrompt = [
    "Analyse this ECOSPHERE sensor snapshot across waste, irrigation, and air quality.",
    "Use only the supplied readings. Do not invent missing values or claim a sensor is live unless the connection and subsystem statuses support that.",
    "First state whether the data is HARDWARE or SIMULATOR and whether the overall connection is LIVE, WAITING, STALE, DISCONNECTED, or DEMO.",
    "For each subsystem, report its online status, interpret the readings, identify any alert, and give practical next steps.",
    "Explain limitations: MQ-2 raw values are an indicative gas-sensor reading, not a certified AQI; soil moisture percentage is the project's mapped sensor estimate.",
    "If a subsystem is offline, waiting, stale, or missing, clearly say that it cannot currently be assessed. Finish with a concise overall ECOSPHERE status.",
    "",
    "CURRENT SNAPSHOT (values supplied by the dashboard):",
    JSON.stringify({
      mode: telemetry.mode,
      connectionStatus: telemetry.connectionStatus,
      isStale: telemetry.isStale,
      lastPacketTimestamp: telemetry.lastPacketTimestamp,
      subsystemStatus: telemetry.subsystemStatus,
      waste: telemetry.waste,
      irrigation: telemetry.irrigation,
      air: telemetry.air,
      alerts: telemetry.alerts,
    }, null, 2),
  ].join("\\n");

  const prompts = [
    { label: "👋 How are you doing today?", category: "chat", text: "Hello! How are you doing today?" },
    { label: "🤖 What can you do?", category: "chat", text: "What can you do and what do you know about ECOSPHERE?" },
    { label: "😄 Tell me a science joke", category: "chat", text: "Tell me a fun science or smart-city joke!" },
    { label: "🌱 Give me composting tips", category: "chat", text: "What are some best practices for organic composting?" },
    { label: "✨ Analyse all current readings", category: "telemetry", text: analysisPrompt },
    { label: "📊 Current live sensor conditions", category: "telemetry", text: "What is the current live condition of all ECOSPHERE subsystems?" },
    { label: "🗑️ How does waste segregation work?", category: "project", text: "Explain the waste segregation mechanism and the composting model." },
    { label: "💧 Why is the irrigation pump ON/OFF?", category: "telemetry", text: "What is the soil moisture and pump status right now?" },
    { label: "🔗 Explain Arduino serial chain", category: "project", text: "How does the Arduino serial chain communicate with the NodeMCU ESP8266?" },
    { label: "💰 Pitch deck financial projections", category: "project", text: "What are the project's financial feasibility and revenue projections?" },
    { label: "🏫 Who built ECOSPHERE?", category: "project", text: "Tell me about Blossoms Convent School and the student innovation team." }
  ];

  const filteredPrompts = prompts.filter(p => activeCategory === 'all' || p.category === activeCategory);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: data.isLiveAI ?? false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: 'bot-err-' + Date.now(),
        role: 'assistant',
        content: "I'm right here! Here is our current telemetry overview:\n\n" +
          `• **Status**: ${telemetry.connectionStatus} (${telemetry.mode})\n` +
          `• **Waste**: ${telemetry.waste.dryCount} Dry / ${telemetry.waste.organicCount} Organic (Bin: ${telemetry.waste.binStatus})\n` +
          `• **Irrigation**: Moisture ${telemetry.irrigation.moisturePercent}% (Pump: ${telemetry.irrigation.pumpStatus})\n` +
          `• **Air Gas Index**: ${telemetry.air.pollutionRaw} (${telemetry.air.pollutionLevel})\n\n` +
          `Feel free to ask me anything about the project or chat about sustainability!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset-1',
        role: 'assistant',
        content: "Chat history refreshed! Ready to talk about anything—from general chit-chat and science ideas to ECOSPHERE's live sensors and circuits.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: true,
      }
    ]);
  };

  // Helper to format simple markdown-like text
  const renderFormattedContent = (content: string) => {
    return (
      <div className="whitespace-pre-wrap leading-relaxed text-xs">
        {content}
      </div>
    );
  };

  return (
    <>
      {/* Floating Launch Button (When Closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-xl transition-all duration-300 hover:bg-emerald-700 hover:shadow-2xl hover:scale-105 active:scale-95"
          aria-label="Open CityPulse AI chatbot"
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-extrabold tracking-wide flex items-center gap-1">
              CityPulse AI
              <Sparkles className="h-3 w-3 text-emerald-300" />
            </span>
            <span className="text-[10px] opacity-90 leading-tight">Smart City Chatbot</span>
          </div>
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-emerald-500/20 bg-white/95 shadow-2xl backdrop-blur-md transition-all duration-300 dark:border-emerald-800/40 dark:bg-slate-900/95 ${
            isExpanded
              ? 'h-[88vh] w-[95vw] sm:w-[720px]'
              : 'h-[620px] w-[92vw] sm:w-[440px]'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/10 bg-emerald-50/70 px-4 py-3 dark:border-emerald-900/30 dark:bg-emerald-950/40">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    CityPulse AI Chatbot
                  </h3>
                  <div className="flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <Radio className="h-2.5 w-2.5 animate-pulse" />
                    <span>{telemetry.connectionStatus}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Knows everything about ECOSPHERE · Ready for normal chat
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearChat}
                title="Clear chat session"
                className="rounded-lg p-1.5 hover:bg-slate-200/80 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand window'}
                className="rounded-lg p-1.5 hover:bg-slate-200/80 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              <button
                onClick={onToggle}
                title="Close chat"
                className="rounded-lg p-1.5 hover:bg-slate-200/80 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Chips for Prompts */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 bg-white/80 px-3 py-1.5 dark:border-slate-800/60 dark:bg-slate-900/80 text-[11px]">
            <span className="text-slate-400 text-[10px] font-semibold mr-1">Topic:</span>
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-md px-2 py-0.5 font-medium transition-colors ${activeCategory === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              All Topics
            </button>
            <button
              onClick={() => setActiveCategory('chat')}
              className={`rounded-md px-2 py-0.5 font-medium transition-colors ${activeCategory === 'chat' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              💬 Normal Chat
            </button>
            <button
              onClick={() => setActiveCategory('project')}
              className={`rounded-md px-2 py-0.5 font-medium transition-colors ${activeCategory === 'project' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              🌿 Project & Tech
            </button>
            <button
              onClick={() => setActiveCategory('telemetry')}
              className={`rounded-md px-2 py-0.5 font-medium transition-colors ${activeCategory === 'telemetry' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              📡 Live Sensors
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/40 dark:bg-slate-950/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'border border-slate-200/90 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 rounded-bl-xs'
                  }`}
                >
                  {renderFormattedContent(msg.content)}
                </div>

                <div className="mt-1 flex items-center gap-2 px-1 text-[10px] text-slate-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <>
                      <span>· {msg.isLiveAI ? 'Gemini 3.8 Flash' : 'ECOSPHERE Engine'}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-0.5"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                            <Check className="h-3 w-3" /> Copied!
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Copy className="h-3 w-3" /> Copy
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs py-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                <span className="animate-pulse">CityPulse AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="border-t border-slate-100 bg-white/90 px-3 py-2 dark:border-slate-800/80 dark:bg-slate-900/90">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Suggested Questions:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              {filteredPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  disabled={isLoading}
                  className="whitespace-nowrap shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything: normal conversation, live sensors, hardware, pitch..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
