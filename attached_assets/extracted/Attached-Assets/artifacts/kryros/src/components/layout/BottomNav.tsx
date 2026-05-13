import { Link, useLocation } from "wouter";
import { House, Store, CreditCard, ShoppingBag, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";

export function BottomNav() {
  const [location] = useLocation();
  const { itemCount } = useCart();

  const navItems = [
    { name: "Home", href: "/", icon: House },
    { name: "Shop", href: "/shop", icon: Store },
    { name: "Pay", href: "/checkout", icon: CreditCard },
    { name: "Cart", href: "/cart", icon: ShoppingBag, badge: itemCount },
    { name: "Track", href: "/track-order", icon: PackageSearch },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-safe">
      <nav className="flex h-16 items-center justify-around px-1">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className={cn("text-[10px] font-medium uppercase tracking-wide", isActive && "text-primary")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
