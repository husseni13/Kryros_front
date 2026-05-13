import { Link, useLocation } from "wouter";
import {
  Clock, MapPin, CreditCard, User, Bell, Settings,
  ChevronRight, LogOut, Package,
} from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAuth } from "@/lib/AuthContext";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex-1 rounded-2xl flex flex-col items-center justify-center py-4 px-2 bg-card border border-border shadow-sm">
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}

type MenuItem = {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  href: string;
};

function MenuGroup({ items }: { items: MenuItem[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {items.map((item, i) => (
        <Link key={item.href} href={item.href}>
          <div className={cn(
            "flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition-colors cursor-pointer",
            i < items.length - 1 && "border-b border-border/60"
          )}>
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <item.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.sublabel}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const { useGet } = useApi();
  const [, navigate] = useLocation();

  const { data: ordersData } = useGet(
    ["my-orders"],
    "/orders?limit=100",
    { enabled: isLoggedIn }
  );

  const ordersCount = user?.ordersCount ?? (ordersData as any)?.data?.length ?? (ordersData as any)?.length ?? 0;
  const reviewsCount = user?.reviewsCount ?? 0;
  const couponsCount = user?.couponsCount ?? 0;

  const displayName = user?.name ||
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    "My Account";
  const displayEmail = user?.email || "";
  const initials = user?.avatar && user.avatar.length <= 3
    ? user.avatar
    : displayName
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase() || "ME";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const accountItems: MenuItem[] = [
    { icon: Clock,       label: "Orders",          sublabel: "Track & return orders",    href: "/cart"            },
    { icon: MapPin,      label: "Addresses",        sublabel: "Manage delivery info",     href: "/profile"         },
    { icon: CreditCard,  label: "Payment Methods",  sublabel: "Manage saved cards",       href: "/checkout"        },
  ];

  const settingsItems: MenuItem[] = [
    { icon: User,        label: "Profile Info",     sublabel: "Update personal info",     href: "/profile"         },
    { icon: Bell,        label: "Notifications",    sublabel: "Manage alerts",            href: "/notifications"   },
    { icon: Settings,    label: "Preferences",      sublabel: "App settings",             href: "/profile"         },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">

      {/* ── Teal header ── */}
      <div className="bg-[#1FA89A] px-5 pt-10 pb-16 relative">
        <div className="flex items-center gap-4">
          {/* Avatar circle */}
          <div className="h-16 w-16 rounded-full border-2 border-white/60 bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">{initials}</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-xl leading-tight truncate">
              {isLoading ? "Loading..." : displayName}
            </h1>
            <p className="text-white/80 text-sm mt-0.5 truncate">
              {isLoading ? "" : displayEmail || (isLoggedIn ? "No email set" : "Not signed in")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats row (overlaps header) ── */}
      <div className="mx-4 -mt-8 relative z-10">
        <div className="flex gap-3">
          <StatCard value={isLoading ? "—" : ordersCount} label="Orders" />
          <StatCard value={isLoading ? "—" : reviewsCount} label="Reviews" />
          <StatCard value={isLoading ? "—" : couponsCount} label="Coupons" />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 pt-6 space-y-5">

        {/* MY ACCOUNT section */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            My Account
          </p>
          <MenuGroup items={accountItems} />
        </div>

        {/* SETTINGS section */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Settings
          </p>
          <MenuGroup items={settingsItems} />
        </div>

        {/* Sign In / Logout */}
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
  );
}
