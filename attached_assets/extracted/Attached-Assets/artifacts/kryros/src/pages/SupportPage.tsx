import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeadphonesIcon, MessageCircle, Mail, Phone, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";

const FAQS = [
  {
    q: "How do I track my order?",
    a: "Go to the Track Order page and enter your Order ID (found in your confirmation email) along with your email address to see real-time updates.",
  },
  {
    q: "How does 0% financing (BNPL) work?",
    a: "Buy Now Pay Later lets you split your purchase into equal monthly payments with zero interest. Simply choose your repayment period at checkout — 3, 6, or 12 months.",
  },
  {
    q: "Can I return or exchange a product?",
    a: "Yes. You have 14 days from delivery to request a return or exchange. The product must be in its original condition and packaging.",
  },
  {
    q: "How long does delivery take?",
    a: "Local city deliveries typically take 1–2 business days. Deliveries to other cities and regions take 3–5 business days.",
  },
  {
    q: "Is my payment information secure?",
    a: "Absolutely. All transactions are encrypted and processed through secure payment gateways. Kryros never stores your card details.",
  },
  {
    q: "How do I cancel or modify my order?",
    a: "Orders can be cancelled or modified within 1 hour of placing them. After that, please contact support directly.",
  },
];

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "Live Chat",
    desc: "Chat with our team now",
    action: "Start Chat",
    gradient: "from-violet-500 to-indigo-600",
  },
  {
    icon: Mail,
    label: "Email Support",
    desc: "support@kryros.com",
    action: "Send Email",
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    icon: Phone,
    label: "Phone Support",
    desc: "+1 800 000 0123",
    action: "Call Now",
    gradient: "from-amber-500 to-orange-600",
  },
];

export default function SupportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-border bg-background text-foreground text-sm px-4 py-3 placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  function handleSend() {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 bg-background">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card mb-3">
            <HeadphonesIcon className="h-6 w-6 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground text-sm mt-0.5">We're here 24/7 — how can we help?</p>
        </div>

        {/* Contact Channels — horizontal rectangles, same style as dashboard quick actions */}
        <div className="space-y-2.5">
          {CHANNELS.map((ch) => (
            <div
              key={ch.label}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer px-4 py-3"
            >
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white flex-shrink-0 group-hover:scale-105 transition-transform ${ch.gradient}`}>
                <ch.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{ch.label}</div>
                <div className="text-[11px] text-muted-foreground truncate">{ch.desc}</div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-primary flex-shrink-0">
                {ch.action}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-semibold text-sm mb-3">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={`rounded-xl border transition-all ${open ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}>
                  <button
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left"
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span className="text-sm font-medium">{faq.q}</span>
                    {open
                      ? <ChevronUp className="h-4 w-4 text-primary flex-shrink-0" />
                      : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    }
                  </button>
                  {open && (
                    <div className="px-3 pb-3 text-xs text-muted-foreground leading-relaxed">{faq.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-semibold text-sm mb-0.5">Send us a message</h2>
          <p className="text-[11px] text-muted-foreground mb-3">We typically reply within 2 hours</p>
          {sent ? (
            <div className="py-6 text-center space-y-2">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-500/15 mb-1">
                <MessageCircle className="h-5 w-5 text-teal-400" />
              </div>
              <p className="font-semibold text-sm">Message sent!</p>
              <p className="text-xs text-muted-foreground">We'll get back to you at {email} shortly.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</span>
                  <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</span>
                  <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Message</span>
                <textarea
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className={inputClass + " resize-none"}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!name.trim() || !email.trim() || !message.trim()}
                className="w-full h-10 rounded-xl gradient-hero text-white text-sm font-bold tracking-wide transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
            </div>
          )}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
