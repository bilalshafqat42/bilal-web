"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const WHATSAPP_NUMBER = "971529766006";
const AUTO_OPEN_SCROLL_PX = 700;
const AUTO_OPEN_SESSION_KEY = "bilal_wa_widget_shown";

const SERVICES = [
  "Paid Marketing (Google & Social)",
  "Performance Marketing",
  "Web Design & Development",
  "MERN Stack Development",
  "Mobile App Development",
  "Graphic Design",
  "Social Media Management",
  "Something else",
];

type FieldKey = "name" | "email" | "phone" | "service" | "meetingTime";
type Answers = Partial<Record<FieldKey, string>>;

type Step = {
  key: FieldKey;
  bot: (a: Answers) => string;
  type: "text" | "email" | "tel" | "chips" | "datetime-local";
  placeholder?: string;
};

const STEPS: Step[] = [
  {
    key: "name",
    bot: () =>
      "I'm here on Bilal's behalf so he can personally follow up with you. What's your name?",
    type: "text",
    placeholder: "Your name",
  },
  {
    key: "email",
    bot: (a) => `Nice to meet you, ${a.name}. What's your email address?`,
    type: "email",
    placeholder: "you@company.com",
  },
  {
    key: "phone",
    bot: () => "And the best phone number to reach you on?",
    type: "tel",
    placeholder: "+971 5X XXX XXXX",
  },
  {
    key: "service",
    bot: () => "Which service are you interested in?",
    type: "chips",
  },
  {
    key: "meetingTime",
    bot: () => "Last thing — when would you like to schedule a quick call?",
    type: "datetime-local",
  },
];

type Message = { from: "bot" | "user"; text: string };

function buildWhatsAppMessage(a: Answers) {
  const formattedTime = a.meetingTime
    ? new Date(a.meetingTime).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
    : "Not specified";

  return [
    "Hi Bilal, I'd like to talk about a project.",
    "",
    `Name: ${a.name}`,
    `Email: ${a.email}`,
    `Phone: ${a.phone}`,
    `Service: ${a.service}`,
    `Preferred meeting time: ${formattedTime}`,
  ].join("\n");
}

function formatAnswerForDisplay(step: Step, value: string) {
  if (step.type === "datetime-local") {
    return new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
  }
  return value;
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [finished, setFinished] = useState(false);
  const [botTripped, setBotTripped] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef(false);

  // Proactive open once per session, after the visitor has scrolled a bit —
  // mimics a sales rep stepping in rather than a static widget.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(AUTO_OPEN_SESSION_KEY)) return;

    const onScroll = () => {
      if (window.scrollY > AUTO_OPEN_SCROLL_PX) {
        window.removeEventListener("scroll", onScroll);
        sessionStorage.setItem(AUTO_OPEN_SESSION_KEY, "1");
        startConversation(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [stepIndex, open]);

  function startConversation(greetFirst: boolean) {
    if (startedRef.current) {
      setOpen(true);
      return;
    }
    startedRef.current = true;
    sessionStorage.setItem(AUTO_OPEN_SESSION_KEY, "1");
    setOpen(true);
    setHasUnread(true);
    setTyping(true);

    if (greetFirst) {
      setTimeout(() => {
        setTyping(false);
        setMessages([{ from: "bot", text: "Hi there! Thanks for stopping by — how can I help you today?" }]);
        setTimeout(() => {
          setTyping(true);
          setTimeout(() => {
            setTyping(false);
            setMessages((m) => [...m, { from: "bot", text: STEPS[0].bot({}) }]);
          }, 550);
        }, 900);
      }, 500);
    } else {
      setTimeout(() => {
        setTyping(false);
        setMessages([{ from: "bot", text: STEPS[0].bot({}) }]);
      }, 500);
    }
  }

  function handleLauncherClick() {
    if (open) {
      setOpen(false);
      return;
    }
    setHasUnread(false);
    startConversation(false);
  }

  const closeAndReset = () => {
    setOpen(false);
  };

  function resetForNextTime() {
    setMessages([]);
    setStepIndex(0);
    setAnswers({});
    setInputValue("");
    setFinished(false);
    setBotTripped(false);
    startedRef.current = false;
  }

  function advance(nextAnswers: Answers) {
    const nextIndex = stepIndex + 1;
    setInputValue("");

    if (nextIndex >= STEPS.length) {
      const waMessage = buildWhatsAppMessage(nextAnswers);
      // Opened synchronously inside the click/submit handler that led here,
      // so browsers treat it as a direct user gesture, not a blocked popup.
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`,
        "_blank",
        "noopener,noreferrer"
      );

      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nextAnswers,
          message: `Requested via WhatsApp assistant — service: ${nextAnswers.service}`,
          source: "whatsapp-chat",
        }),
      }).catch(() => {});

      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            from: "bot",
            text: `All set, ${nextAnswers.name}. I've opened WhatsApp with everything filled in — just hit send there and Bilal will get back to you directly.`,
          },
        ]);
        setFinished(true);
      }, 600);
      return;
    }

    setStepIndex(nextIndex);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text: STEPS[nextIndex].bot(nextAnswers) }]);
    }, 550);
  }

  function submitAnswer(rawValue: string) {
    if (botTripped) return;
    const step = STEPS[stepIndex];
    const value = rawValue.trim();
    if (!value) return;

    setMessages((m) => [...m, { from: "user", text: formatAnswerForDisplay(step, value) }]);
    const nextAnswers = { ...answers, [step.key]: value };
    setAnswers(nextAnswers);
    advance(nextAnswers);
  }

  function handleInputSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitAnswer(inputValue);
  }

  const step = STEPS[stepIndex];

  return (
    <>
      <button
        type="button"
        onClick={handleLauncherClick}
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-shadow hover:shadow-xl"
      >
        {open ? (
          <X size={20} />
        ) : (
          <>
            <MessageCircle size={22} fill="white" strokeWidth={0} />
            {hasUnread ? (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-[#08080b]" />
            ) : null}
          </>
        )}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-labelledby="whatsapp-chat-heading"
          className="fixed bottom-40 right-4 left-4 sm:left-auto sm:right-6 z-40 flex w-auto sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-border glass-strong shadow-2xl shadow-black/40"
          style={{ height: "min(560px, 65vh)" }}
        >
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
              <MessageCircle size={18} fill="currentColor" strokeWidth={0} />
            </div>
            <div>
              <h3 id="whatsapp-chat-heading" className="text-sm font-semibold text-ink">
                Bilal&apos;s Assistant
              </h3>
              <p className="text-xs text-muted">Usually replies within a business day</p>
            </div>
            <button
              type="button"
              onClick={closeAndReset}
              aria-label="Close"
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "bot"
                      ? "self-start bg-surface/70 border border-border text-ink/90"
                      : "self-end bg-[#25D366]/20 border border-[#25D366]/30 text-ink"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {typing ? (
                <div className="self-start flex items-center gap-1 rounded-2xl border border-border bg-surface/70 px-4 py-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce" />
                </div>
              ) : null}

              <div ref={transcriptEndRef} />
            </div>
          </div>

          {!finished && !typing ? (
            <div className="border-t border-border p-4">
              <input
                type="checkbox"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                style={{ display: "none" }}
                onChange={(e) => setBotTripped(e.target.checked)}
              />

              {step.type === "chips" ? (
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submitAnswer(s)}
                      className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-ink hover:border-[#25D366]/50 hover:text-[#25D366] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type={step.type}
                    required
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={step.placeholder}
                    className="flex-1 rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-[#25D366]/50 [color-scheme:dark]"
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-shadow hover:shadow-lg hover:shadow-[#25D366]/30"
                  >
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          ) : null}

          {finished ? (
            <div className="border-t border-border p-4">
              <button
                type="button"
                onClick={() => {
                  closeAndReset();
                  resetForNextTime();
                }}
                className="w-full btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
