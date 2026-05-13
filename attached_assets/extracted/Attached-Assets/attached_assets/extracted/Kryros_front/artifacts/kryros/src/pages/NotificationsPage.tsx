import { useState } from "react";
import { Package, CreditCard, Zap, Star, Bell, CheckCheck, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { NOTIFICATIONS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  order:     Package,
  financing: CreditCard,
  promo:     Zap,
  system:    Star,
};

const COLOR_MAP: Record<string, { bg: string; icon: string }> = {
  order:     { bg: "bg-violet-500/15", icon: "text-violet-400" },
  financing: { bg: "bg-amber-500/15",  icon: "text-amber-400"  },
  promo:     { bg: "bg-rose-500/15",   icon: "text-rose-400"   },
  system:    { bg: "bg-teal-500/15",   icon: "text-teal-400"   },
};

const TABS = ["All", "Orders", "Financing", "Promotions", "System"] as const;
const TYPE_MAP: Record<string, string> = {
  Orders: "order", Financing: "financing", Promotions: "promo", System: "system",
};

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function getFiltered(tab: (typeof TABS)[number]) {
    if (tab === "All") return notifications;
    return notifications.filter((n) => n.type === TYPE_MAP[tab]);
  }

  const filtered = getFiltered(activeTab);

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 bg-background">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-screen-md mx-auto w-full">

        {/* ── Page header ── */}
        <div className="bg-gradient-to-br from-primary/90 via-teal-600/80 to-emerald-700 px-4 pt-5 pb-6 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-black text-lg leading-tight">Notifications</h1>
                <p className="text-white/70 text-xs">
                  {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                data-testid="button-mark-all-read"
                className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 border border-white/25 text-white rounded-full px-3 py-2 hover:bg-white/25 transition-colors backdrop-blur-sm"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-card border-b border-border px-4 py-2">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const count = getFiltered(tab).filter((n) => !n.read).length;
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  data-testid={`tab-${tab.toLowerCase()}`}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                  {count > 0 && (
                    <span className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
                      active ? "bg-white/25 text-white" : "bg-destructive text-white"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Notification list ── */}
        <div className="p-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                <Bell className="h-7 w-7 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">No {activeTab.toLowerCase()} notifications</p>
              <p className="text-xs text-muted-foreground/60">You're all caught up here</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border/50">
              {filtered.map((n) => {
                const Icon = ICON_MAP[n.type] || Bell;
                const colors = COLOR_MAP[n.type] || COLOR_MAP.system;
                return (
                  <button
                    key={n.id}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/30",
                      !n.read && "bg-primary/5"
                    )}
                    onClick={() => markRead(n.id)}
                    data-testid={`notification-${n.id}`}
                  >
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0", colors.bg)}>
                      <Icon className={cn("h-4.5 w-4.5", colors.icon, "h-[18px] w-[18px]")} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-semibold truncate">{n.title}</span>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{n.message}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
