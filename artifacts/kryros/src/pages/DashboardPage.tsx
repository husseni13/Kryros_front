import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Clock, MapPin, CreditCard, User, Bell, Settings,
  ChevronRight, LogOut, X, Check, Loader2, Pencil,
} from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAuth } from "@/lib/AuthContext";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { API_BASE } from "@/lib/AuthContext";

/* ────────────────────────────────────────────
   Stat Card
──────────────────────────────────────────── */
function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex-1 rounded-2xl flex flex-col items-center justify-center py-4 px-2 bg-card border border-border shadow-sm">
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}

/* ────────────────────────────────────────────
   Menu Row
──────────────────────────────────────────── */
type MenuItem = {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  href?: string;
  onClick?: () => void;
};

function MenuGroup({ items }: { items: MenuItem[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {items.map((item, i) => {
        const inner = (
          <div
            className={cn(
              "flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition-colors cursor-pointer",
              i < items.length - 1 && "border-b border-border/60"
            )}
            onClick={item.onClick}
          >
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <item.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.sublabel}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        );
        return item.href ? (
          <Link key={`${item.label}-${i}`} href={item.href}>{inner}</Link>
        ) : (
          <div key={`${item.label}-${i}`}>{inner}</div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────
   Edit Profile Sheet
──────────────────────────────────────────── */
function EditProfileSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, token, updateUser } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const inputClass =
    "w-full h-11 rounded-xl border border-border bg-muted/40 text-foreground text-sm px-4 placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const body = { firstName, lastName, email, phone };
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).message || "Failed to save profile");
      }

      updateUser({ firstName, lastName, email, phone });
      setSaved(true);
      toast({ title: "Profile updated", description: "Your info has been saved." });
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 900);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Save failed", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl border-t border-border animate-in slide-in-from-bottom-4 duration-300">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-base text-foreground">Edit Profile</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Update your personal information</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-5 space-y-4">
          {/* Avatar preview */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-14 w-14 rounded-full bg-[#1FA89A] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {((firstName[0] || "") + (lastName[0] || "")).toUpperCase() || user?.avatar || "?"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {firstName || lastName ? `${firstName} ${lastName}`.trim() : user?.name || "Your Name"}
              </p>
              <p className="text-xs text-muted-foreground">{email || user?.email || "No email"}</p>
            </div>
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className={inputClass}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className={inputClass}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1 555 000 0000"
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={cn(
              "w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-1",
              saved
                ? "bg-green-500 text-white"
                : "bg-[#1FA89A] hover:bg-[#18978a] text-white disabled:opacity-70"
            )}
          >
            {saved ? (
              <><Check className="h-4 w-4" /> Saved!</>
            ) : saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {/* safe area spacer */}
        <div className="h-6" />
      </div>
    </>
  );
}

/* ────────────────────────────────────────────
   Dashboard Page
──────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const { useGet } = useApi();
  const [, navigate] = useLocation();
  const [editOpen, setEditOpen] = useState(false);

  const { data: ordersData } = useGet(
    ["my-orders"],
    "/orders?limit=100",
    { enabled: isLoggedIn }
  );

  const ordersCount  = user?.ordersCount  ?? (ordersData as any)?.data?.length ?? (ordersData as any)?.length ?? 0;
  const reviewsCount = user?.reviewsCount ?? 0;
  const couponsCount = user?.couponsCount ?? 0;

  const displayName = user?.name ||
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    "My Account";
  const displayEmail = user?.email || "";
  const initials = user?.avatar && user.avatar.length <= 3
    ? user.avatar
    : displayName.trim().split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase() || "ME";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const accountItems: MenuItem[] = [
    { icon: Clock,      label: "Orders",          sublabel: "Track & return orders",  href: "/cart"          },
    { icon: MapPin,     label: "Addresses",        sublabel: "Manage delivery info",   href: "/profile"       },
    { icon: CreditCard, label: "Payment Methods",  sublabel: "Manage saved cards",     href: "/checkout"      },
  ];

  const settingsItems: MenuItem[] = [
    { icon: User,     label: "Profile Info",  sublabel: "Update personal info", onClick: () => setEditOpen(true) },
    { icon: Bell,     label: "Notifications", sublabel: "Manage alerts",        href: "/notifications" },
    { icon: Settings, label: "Preferences",   sublabel: "App settings",         href: "/profile"       },
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background pb-20">

        {/* ── Teal header ── */}
        <div className="bg-[#1FA89A] px-5 pt-10 pb-16 relative">
          <div className="flex items-center gap-4">
            {/* Avatar — tap to edit */}
            <button
              className="h-16 w-16 rounded-full border-2 border-white/60 bg-white/20 flex items-center justify-center flex-shrink-0 relative group"
              onClick={() => isLoggedIn && setEditOpen(true)}
            >
              <span className="text-white font-bold text-xl">{initials}</span>
              {isLoggedIn && (
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Pencil className="h-4 w-4 text-white" />
                </div>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-white font-bold text-xl leading-tight truncate">
                {isLoading ? "Loading..." : displayName}
              </h1>
              <p className="text-white/80 text-sm mt-0.5 truncate">
                {isLoading ? "" : displayEmail || (isLoggedIn ? "No email set" : "Not signed in")}
              </p>
            </div>

            {/* Edit button in header */}
            {isLoggedIn && (
              <button
                onClick={() => setEditOpen(true)}
                className="h-8 w-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 hover:bg-white/30 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* ── Stats row (overlaps header) ── */}
        <div className="mx-4 -mt-8 relative z-10">
          <div className="flex gap-3">
            <StatCard value={isLoading ? "—" : ordersCount}  label="Orders"  />
            <StatCard value={isLoading ? "—" : reviewsCount} label="Reviews" />
            <StatCard value={isLoading ? "—" : couponsCount} label="Coupons" />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-4 pt-6 space-y-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">My Account</p>
            <MenuGroup items={accountItems} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Settings</p>
            <MenuGroup items={settingsItems} />
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border hover:bg-destructive/10 hover:border-destructive/30 transition-colors text-muted-foreground hover:text-destructive"
            >
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <LogOut className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">Log Out</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">Sign out of your account</p>
              </div>
            </button>
          ) : (
            <Link href="/login">
              <div className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border hover:bg-muted/40 transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">Sign In</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Login to access your account</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Link>
          )}

        </div>

        <BottomNav />
      </div>

      {/* ── Edit Profile Sheet ── */}
      <EditProfileSheet open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}
