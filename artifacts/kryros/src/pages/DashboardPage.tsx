import { useState } from "react";
import { Link } from "wouter";
import {
  Package, Heart, CreditCard, Bell, Settings, LogOut,
  LayoutDashboard, ShoppingBag, HeadphonesIcon,
  Zap, Star, X, MapPin, Calendar, Hash, CheckCircle2,
  ChevronRight, TrendingUp, Wallet, ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { USER, ORDERS, NOTIFICATIONS } from "@/lib/mockData";
import { useCurrency } from "@/lib/CurrencyContext";

type Order = typeof ORDERS[number];

const STATUS_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  Delivered: { dot: "bg-teal-400", text: "text-teal-400", bg: "bg-teal-400/10" },
  Shipped:   { dot: "bg-violet-400", text: "text-violet-400", bg: "bg-violet-400/10" },
  Processing:{ dot: "bg-amber-400",  text: "text-amber-400",  bg: "bg-amber-400/10"  },
};

const SIDEBAR_ITEMS = [
  { label: "Overview",      href: "/dashboard",     icon: LayoutDashboard },
  { label: "Orders",        href: "/cart",           icon: Package },
  { label: "Wishlist",      href: "/wishlist",       icon: Heart },
  { label: "Financing",     href: "/financing",      icon: CreditCard },
  { label: "Notifications", href: "/notifications",  icon: Bell, badge: 3 },
  { label: "Profile",       href: "/profile",        icon: Settings },
];

const QUICK_ACTIONS = [
  { label: "Shop",     href: "/shop",      icon: ShoppingBag,    gradient: "from-violet-500 to-indigo-600" },
  { label: "Track",    href: "/track-order", icon: Package,      gradient: "from-teal-500 to-emerald-600" },
  { label: "Finance",  href: "/financing", icon: CreditCard,     gradient: "from-amber-500 to-orange-500" },
  { label: "Support",  href: "/support",   icon: HeadphonesIcon, gradient: "from-rose-500 to-pink-600"    },
];

const FINANCING_PLANS = [
  { name: "iPhone 15 Pro Max", total: 699, paid: 489, nextDate: "Jan 15, 2025", monthly: 58, remaining: 4 },
  { name: "MacBook Air M3",    total: 949, paid: 237, nextDate: "Jan 20, 2025", monthly: 79, remaining: 9 },
];

function OrderReceiptModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const { formatPrice } = useCurrency();
  const style = STATUS_STYLES[order.status] ?? STATUS_STYLES["Processing"];
  const steps = ["Placed", "Processing", "Shipped", "Delivered"];
  const stepIndex = order.status === "Delivered" ? 3 : order.status === "Shipped" ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 sm:hidden" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Receipt</p>
            <p className="font-bold text-base mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{order.product}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Qty: 1</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-sm">{formatPrice(order.price)}</p>
            <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full mt-1", style.bg, style.text)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
              {order.status}
            </span>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-border space-y-2.5">
          {[
            { icon: Hash,     label: "Order ID",         value: order.id },
            { icon: Calendar, label: "Order Date",       value: order.date },
            { icon: MapPin,   label: "Delivery",         value: "Your Location" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-xs font-medium ml-auto">{value}</span>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-b border-border">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Tracking</p>
          <div className="relative flex items-start justify-between">
            <div className="absolute top-3 left-3 right-3 h-[2px] bg-border" />
            <div
              className="absolute top-3 left-3 h-[2px] bg-primary transition-all"
              style={{ width: `${(stepIndex / (steps.length - 1)) * (100 - 0)}%` }}
            />
            {steps.map((step, i) => {
              const done = i <= stepIndex;
              const active = i === stepIndex;
              return (
                <div key={step} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                  <div className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center border-2",
                    done ? "bg-primary border-primary" : "bg-background border-border"
                  )}>
                    {done ? <CheckCircle2 className="h-3.5 w-3.5 text-white" /> : <span className="text-[9px] text-muted-foreground font-bold">{i + 1}</span>}
                  </div>
                  <span className={cn("text-[9px] text-center leading-tight", active ? "text-primary font-bold" : done ? "text-foreground" : "text-muted-foreground")}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <span className="text-sm text-muted-foreground">Total Paid</span>
          <span className="font-bold text-lg">{formatPrice(order.price)}</span>
        </div>

        <div className="px-5 py-4 grid grid-cols-2 gap-2">
          <Link href="/track-order">
            <button className="w-full h-10 rounded-xl border border-border bg-muted/60 text-sm font-medium hover:bg-muted transition-colors">Track Order</button>
          </Link>
          <Link href="/support">
            <button className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Get Help</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { formatPrice } = useCurrency();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = USER.name.split(" ")[0];

  const iconMap: Record<string, React.ElementType> = { order: Package, financing: CreditCard, promo: Zap, system: Star };
  const colorMap: Record<string, string> = {
    order:     "bg-violet-500/15 text-violet-400",
    financing: "bg-amber-500/15 text-amber-400",
    promo:     "bg-rose-500/15 text-rose-400",
    system:    "bg-teal-500/15 text-teal-400",
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 bg-background">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {selectedOrder && (
        <OrderReceiptModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">

        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-60 border-r border-border/40 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-card/30 flex-shrink-0">
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-hero text-white font-bold text-sm">
                  {USER.avatar}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-teal-400 border-2 border-background" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{USER.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{USER.email}</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-2.5 space-y-0.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 pt-2 pb-1">Menu</p>
            {SIDEBAR_ITEMS.map((item) => {
              const active = activeSection === item.label;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 h-9 rounded-xl text-sm font-medium transition-all",
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                    onClick={() => setActiveSection(item.label)}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </Link>
              );
            })}
          </nav>
          <div className="p-2.5 border-t border-border/40">
            <button className="w-full flex items-center gap-3 px-3 h-9 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* ── Hero section ── */}
          <div className="bg-gradient-to-br from-primary/90 via-teal-600/80 to-emerald-700 px-4 pt-5 pb-8 relative overflow-hidden">
            {/* decorative circles */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute top-6 -right-4 h-24 w-24 rounded-full bg-white/5" />

            {/* Greeting row */}
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 font-bold text-white text-sm flex-shrink-0">
                  {USER.avatar}
                </div>
                <div>
                  <p className="text-white/70 text-xs">{greeting}</p>
                  <p className="text-white font-bold text-base leading-tight">{firstName} 👋</p>
                </div>
              </div>
              <Link href="/notifications">
                <button className="relative h-9 w-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/25 transition-colors">
                  <Bell className="h-4 w-4 text-white" />
                  <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-rose-400 border border-white" />
                </button>
              </Link>
            </div>

            {/* BNPL repayment summary */}
            {(() => {
              const totalFinanced = FINANCING_PLANS.reduce((s, p) => s + p.total, 0);
              const totalPaid     = FINANCING_PLANS.reduce((s, p) => s + p.paid,  0);
              const totalLeft     = totalFinanced - totalPaid;
              const pct           = Math.round((totalPaid / totalFinanced) * 100);
              return (
                <div className="relative z-10 mb-1">
                  <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">My Installment Plan</p>
                  <div className="flex items-end gap-3 mt-0.5">
                    <p className="text-white font-black text-4xl tracking-tight">{formatPrice(totalPaid)}</p>
                    <p className="text-white/60 text-sm mb-1">paid</p>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-300 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-white/60 text-[11px]">{formatPrice(totalLeft)} remaining</span>
                    <span className="text-emerald-300 text-[11px] font-semibold">{pct}% complete</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-emerald-300" />
                    <span className="text-emerald-300 text-xs font-medium">0% interest · always</span>
                  </div>
                </div>
              );
            })()}

            {/* Stat pills */}
            <div className="flex items-center gap-2 mt-4 relative z-10 flex-wrap">
              {[
                { label: "Orders",  value: USER.totalOrders,   icon: Package    },
                { label: "Plans",   value: USER.activePlans,   icon: CreditCard },
                { label: "Wishlist",value: USER.wishlistCount, icon: Heart      },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
                  <Icon className="h-3 w-3 text-white/70" />
                  <span className="text-white font-bold text-xs">{value}</span>
                  <span className="text-white/60 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="-mt-5 mx-4 bg-card border border-border rounded-2xl shadow-lg p-4 relative z-10">
            <div className="grid grid-cols-4 gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-md group-hover:scale-105 transition-transform",
                      action.gradient
                    )}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Body sections ── */}
          <div className="p-4 space-y-4">

            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                <div>
                  <h2 className="font-bold text-sm">Recent Orders</h2>
                  <p className="text-[11px] text-muted-foreground">{ORDERS.length} orders · tap for receipt</p>
                </div>
                <Link href="/cart">
                  <button className="flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline">
                    View all <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>

              <div className="divide-y divide-border/40">
                {ORDERS.slice(0, 4).map((order) => {
                  const style = STATUS_STYLES[order.status] ?? STATUS_STYLES["Processing"];
                  return (
                    <button
                      key={order.id}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                      onClick={() => setSelectedOrder(order)}
                      data-testid={`order-${order.id}`}
                    >
                      <div className="h-9 w-9 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{order.product}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{order.id} · {order.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs font-bold">{formatPrice(order.price)}</span>
                        <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full", style.bg, style.text)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                          {order.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Financing */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                <div>
                  <h2 className="font-bold text-sm">Active Financing</h2>
                  <p className="text-[11px] text-muted-foreground">{FINANCING_PLANS.length} active plans · 0% interest</p>
                </div>
                <Link href="/financing">
                  <button className="flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline">
                    Manage <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>

              <div className="divide-y divide-border/40">
                {FINANCING_PLANS.map((plan, i) => {
                  const pct = Math.round((plan.paid / plan.total) * 100);
                  return (
                    <div key={i} className="px-4 py-3" data-testid={`financing-plan-${i}`}>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{plan.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {formatPrice(plan.monthly)}/mo · {plan.remaining} payments left
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-black text-primary">{pct}%</p>
                          <p className="text-[10px] text-muted-foreground">paid</p>
                        </div>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                        <span>{formatPrice(plan.paid)} paid of {formatPrice(plan.total)}</span>
                        <span>Due {plan.nextDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                <div>
                  <h2 className="font-bold text-sm">Recent Activity</h2>
                  <p className="text-[11px] text-muted-foreground">Latest notifications</p>
                </div>
                <Link href="/notifications">
                  <button className="flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline">
                    See all <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>

              <div className="divide-y divide-border/40">
                {NOTIFICATIONS.slice(0, 4).map((n) => {
                  const Icon = iconMap[n.type] || Bell;
                  return (
                    <div
                      key={n.id}
                      className={cn("flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors", !n.read && "bg-primary/5")}
                      data-testid={`activity-${n.id}`}
                    >
                      <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0", colorMap[n.type])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold truncate">{n.title}</p>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{n.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA banner */}
            <Link href="/shop">
              <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity">
                <div>
                  <p className="text-white font-black text-base">Shop New Arrivals</p>
                  <p className="text-white/70 text-xs mt-0.5">Smartphones, Laptops & more</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </Link>

          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
