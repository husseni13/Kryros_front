import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { PackageSearch, CheckCircle2, Truck, Package, MapPin, Clock } from "lucide-react";

const MOCK_STEPS = [
  { label: "Order Placed", desc: "Your order was confirmed", time: "May 7, 10:32 AM", done: true },
  { label: "Processing", desc: "Item is being prepared", time: "May 7, 2:15 PM", done: true },
  { label: "Shipped", desc: "On the way to you", time: "May 8, 9:00 AM", done: true },
  { label: "Out for Delivery", desc: "Almost there!", time: "Expected today", done: false },
  { label: "Delivered", desc: "Package delivered", time: "", done: false },
];

export default function TrackOrderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [tracked, setTracked] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full h-12 rounded-full border border-border bg-background text-foreground text-sm px-6 placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  function handleTrack() {
    if (!orderId.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setTracked(true); }, 900);
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 bg-background">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-sm space-y-5">

          {/* Main card — same as login/register */}
          <div className="rounded-3xl border border-border bg-card shadow-lg px-6 py-8">

            {/* Icon + Title — inside card just like login */}
            <div className="text-center mb-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background mb-4">
                <PackageSearch className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">Track Order</h1>
              <p className="text-muted-foreground text-sm mt-1">Enter your details to see real-time updates</p>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Order ID</span>
                <input
                  type="text"
                  placeholder="e.g. KRY-2025-00123"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Email Address</span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  className={inputClass}
                />
              </div>

              {/* Button — same gradient pill as login/register */}
              <button
                onClick={handleTrack}
                className="w-full h-12 rounded-full gradient-hero text-white text-sm font-bold tracking-widest transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4" />
                    TRACK ORDER
                  </>
                )}
              </button>
            </div>

            {/* Help text */}
            {!tracked && (
              <p className="text-center text-muted-foreground text-sm mt-5">
                Your Order ID is in your confirmation email
              </p>
            )}
          </div>

          {/* Results card — same rounded-3xl style */}
          {tracked && (
            <div className="rounded-3xl border border-border bg-card shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">

              {/* Order header */}
              <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Order ID</p>
                  <p className="font-black text-foreground text-base">{orderId}</p>
                  {email && <p className="text-muted-foreground text-xs mt-0.5">{email}</p>}
                </div>
                <span className="flex-shrink-0 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                  In Transit
                </span>
              </div>

              {/* Destination */}
              <div className="px-5 py-3 border-b border-border flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-xs">Regional Distribution Centre → Your Address</span>
              </div>

              {/* ETA */}
              <div className="px-5 py-3 border-b border-border flex items-center gap-2.5">
                <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-xs">
                  Estimated delivery:{" "}
                  <span className="text-foreground font-semibold">Today by 6:00 PM</span>
                </span>
              </div>

              {/* Steps */}
              <div className="px-5 py-5">
                {MOCK_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-3.5 items-start">
                    <div className="flex flex-col items-center">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-all ${
                        step.done
                          ? "bg-primary border-primary"
                          : i === MOCK_STEPS.findIndex(s => !s.done)
                          ? "bg-amber-500/15 border-amber-500/40"
                          : "bg-muted border-border"
                      }`}>
                        {step.done
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          : i === MOCK_STEPS.findIndex(s => !s.done)
                          ? <Truck className="h-3.5 w-3.5 text-amber-500" />
                          : <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        }
                      </div>
                      {i < MOCK_STEPS.length - 1 && (
                        <div className={`w-px h-7 mt-1 mb-1 ${step.done ? "bg-primary/40" : "bg-border"}`} />
                      )}
                    </div>
                    <div className={`pt-1 ${i < MOCK_STEPS.length - 1 ? "pb-4" : "pb-0"}`}>
                      <p className={`font-semibold text-sm leading-none ${
                        step.done ? "text-foreground" :
                        i === MOCK_STEPS.findIndex(s => !s.done) ? "text-amber-600 dark:text-amber-400" :
                        "text-muted-foreground"
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-xs mt-0.5 text-muted-foreground">{step.desc}</p>
                      {step.time && (
                        <p className={`text-[10px] mt-0.5 font-medium ${step.done ? "text-primary" : "text-amber-600 dark:text-amber-400"}`}>
                          {step.time}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
