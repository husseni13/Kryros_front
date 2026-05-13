import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  X, User, ChevronRight, Phone, Mail, DollarSign,
  Smartphone, Monitor, Laptop, Headphones, Camera, Tag,
  Home, ShoppingBag, Package, Truck, Users, Download, Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORY_DATA } from "@/lib/mockData";
import { useCurrency, CURRENCIES } from "@/lib/CurrencyContext";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};


const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Smartphones: Smartphone,
  Laptops: Laptop,
  Audio: Headphones,
  Cameras: Camera,
  Gaming: Monitor,
  Electronics: Monitor,
  Discounted: Tag,
  Tablets: Smartphone,
  Watches: Monitor,
  Fashion: ShoppingBag,
  Accessories: Package,
  Gadgets: Monitor,
};

const PAYMENT_METHODS = [
  { name: "Airtel Money", logo: "/airtel-logo.png",  bg: "bg-red-50 dark:bg-red-950/30",    border: "border-red-200 dark:border-red-800/40" },
  { name: "MTN MoMo",    logo: "/mtn-logo.png",      bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800/40" },
  { name: "Zamtel Money",logo: "/zamtel-logo.jpeg",  bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800/40" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState<"menu" | "categories">("menu");
  const { currency, setCurrency } = useCurrency();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(false);

  if (!isOpen) return null;

  const menuItems = [
    { name: "Home",             href: "/",                 icon: Home },
    { name: "Shop",             href: "/shop",              icon: ShoppingBag },
    { name: "Pickup Stations",  href: "/pickup-stations",   icon: Store },
    { name: "Track Order",      href: "/track-order",       icon: Truck },
    { name: "Get Now",          href: "/get-now",           icon: DollarSign },
    { name: "Wholesale",        href: "/wholesale",         icon: Users },
  ];

  const handleNavClick = () => {
    setShowCurrencyPicker(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed top-0 left-0 z-50 w-[85%] max-w-sm bg-background text-foreground shadow-2xl flex flex-col animate-in slide-in-from-left duration-300"
        style={{ bottom: "64px" }}
      >
        {/* ── Header with tabs + close button ── */}
        <div className="flex-shrink-0 flex items-center border-b border-border bg-background">
          {/* Logo strip */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1">
            <img src="/kryros-logo.jpg" alt="Kryros" className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
            <span className="font-black text-sm tracking-widest uppercase">KRYROS</span>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center h-12 w-12 bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex-shrink-0"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex-shrink-0 flex border-b border-border">
          <button
            onClick={() => setActiveTab("menu")}
            className={cn(
              "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors",
              activeTab === "menu"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={cn(
              "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors",
              activeTab === "categories"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            Categories
          </button>
        </div>

        {/* ══ MENU TAB ══ */}
        {activeTab === "menu" && (
          <div className="flex flex-col flex-1 min-h-0">

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">

              {/* Nav links */}
              <div>
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={handleNavClick}>
                    <div className={cn(
                      "flex items-center gap-3 px-5 py-3.5 border-b border-border/40 hover:bg-muted/50 transition-colors cursor-pointer",
                      location === item.href && "bg-primary/5 text-primary font-semibold"
                    )}>
                      <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm flex-1">{item.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* ── Pay With section ── */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Pay With</p>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.name}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border",
                        m.bg, m.border
                      )}
                    >
                      <img src={m.logo} alt={m.name} className="h-8 w-8 rounded-lg object-contain" />
                      <span className="text-[9px] font-semibold text-center leading-tight text-foreground/80">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Install App */}
              <div className="mx-4 my-3 border border-border rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Download className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">Install App</p>
                    <p className="text-xs text-muted-foreground">Add to home screen</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs font-bold px-3 h-8"
                  disabled={pwaInstalled}
                  onClick={() => setPwaInstalled(true)}
                >
                  {pwaInstalled ? "ADDED" : "ADD"}
                </Button>
              </div>

              {/* Currency picker */}
              <button
                onClick={() => setShowCurrencyPicker(p => !p)}
                className="w-full flex items-center justify-between px-5 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">Currency</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{currency.flag} ({currency.code})</span>
                  <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", showCurrencyPicker && "rotate-90")} />
                </div>
              </button>
              {showCurrencyPicker && (
                <div className="bg-muted/30 border-b border-border/50">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c); setShowCurrencyPicker(false); }}
                      className={cn(
                        "w-full flex items-center gap-3 px-8 py-2.5 text-sm hover:bg-muted transition-colors",
                        currency.code === c.code && "text-primary font-semibold"
                      )}
                    >
                      <span>{c.flag}</span>
                      <span>{c.label}</span>
                      <span className="text-muted-foreground ml-auto">({c.code})</span>
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* ── Fixed footer — always visible, never scrolls ── */}
            <div className="flex-shrink-0 border-t border-border bg-background px-4 pt-3 pb-3">
              <Link href="/login" onClick={handleNavClick}>
                <Button className="w-full rounded-lg bg-foreground text-background hover:bg-foreground/90 font-bold h-10 text-sm tracking-wide">
                  <User className="h-3.5 w-3.5 mr-1.5" />
                  MY ACCOUNT
                </Button>
              </Link>
              <div className="border-t border-border/50 my-2.5" />
              <div className="flex gap-2">
                <a href="tel:+18000000123" className="flex-1">
                  <Button variant="outline" className="w-full rounded-lg text-sm h-10 font-medium gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    CALL US
                  </Button>
                </a>
                <a href="mailto:support@kryros.com" className="flex-1">
                  <Button variant="outline" className="w-full rounded-lg text-sm h-10 font-medium gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    EMAIL
                  </Button>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* ══ CATEGORIES TAB ══ */}
        {activeTab === "categories" && (
          <div className="flex-1 overflow-y-auto">
            {CATEGORY_DATA.map((cat) => {
              return (
                <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`} onClick={handleNavClick}>
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-border/40 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="h-11 w-11 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", cat.gradient)} />
                    </div>
                    <span className="flex-1 text-sm font-medium">{cat.name}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
}
