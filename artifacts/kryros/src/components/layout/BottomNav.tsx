import { Link, useLocation } from "wouter";
import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";

export function BottomNav() {
  const [location] = useLocation();
  const { itemCount } = useCart();

  const navItems = [
    { name: "Home",     href: "/",          icon: Home        },
    { name: "Search",   href: "/shop",       icon: Search      },
    { name: "Wishlist", href: "/wishlist",   icon: Heart       },
    { name: "Cart",     href: "/cart",       icon: ShoppingCart, badge: itemCount },
    { name: "Me",       href: "/dashboard",  icon: User        },
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
              <span className={cn("text-[10px] font-medium", isActive && "text-primary")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
