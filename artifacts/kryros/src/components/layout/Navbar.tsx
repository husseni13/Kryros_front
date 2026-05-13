import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  Search, ShoppingCart, User, Moon, Sun, Menu, ChevronDown, Heart, X,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Button } from "@/components/ui/button";
import { CATEGORY_DATA } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All Categories", ...CATEGORY_DATA.map((c) => c.name)];

export function Navbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { theme, setTheme } = useTheme();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [, navigate] = useLocation();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const mobileCatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
      if (mobileCatRef.current && !mobileCatRef.current.contains(e.target as Node)) {
        setMobileCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cat = selectedCategory !== "All Categories" ? `&category=${encodeURIComponent(selectedCategory)}` : "";
    navigate(`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}${cat}` : cat ? `?${cat.slice(1)}` : ""}`);
    setCatOpen(false);
    setMobileCatOpen(false);
  }

  const shortLabel = selectedCategory === "All Categories" ? "ALL" : selectedCategory.length > 8 ? selectedCategory.slice(0, 8) + "…" : selectedCategory;

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border/40 shadow-sm" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>

      {/* ── Search Bar — mobile TOP row ── */}
      <div className="md:hidden px-3 pt-2 pb-1">
        <form onSubmit={handleSearch} className="flex items-center rounded-full border border-border bg-muted/40 overflow-hidden h-10 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 bg-transparent text-sm px-4 outline-none placeholder:text-muted-foreground min-w-0 h-full"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="flex items-center justify-center h-full px-2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Category dropdown — mobile */}
          <div className="w-px h-5 bg-border mx-1 flex-shrink-0" />
          <div ref={mobileCatRef} className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setMobileCatOpen((p) => !p)}
              className="flex items-center gap-0.5 px-2.5 h-10 text-[11px] font-bold uppercase tracking-wide text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <span className="max-w-[52px] truncate">{shortLabel}</span>
              <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform duration-200 flex-shrink-0", mobileCatOpen && "rotate-180")} />
            </button>
            {mobileCatOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-background border border-border rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-150 max-h-64 overflow-y-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setSelectedCategory(cat); setMobileCatOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors",
                      selectedCategory === cat && "text-primary font-semibold bg-primary/5"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="flex items-center justify-center h-10 w-10 bg-primary hover:bg-primary/90 transition-colors flex-shrink-0 rounded-r-full">
            <Search className="h-4 w-4 text-primary-foreground" />
          </button>
        </form>
      </div>

      {/* ── Logo + Icons row (mobile BOTTOM, desktop full bar) ── */}
      <div className="flex items-center gap-2 px-3 py-2 md:py-2.5">

        {/* Hamburger (mobile) */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex flex-row items-center flex-shrink-0 gap-2.5">
          <img src="/kryros-logo.jpg" alt="Kryros" className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
          <span className="font-black text-lg tracking-widest text-foreground uppercase leading-none">KRYROS</span>
        </Link>

        {/* Search bar — desktop only inline */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-4 items-center rounded-full border border-border bg-muted/40 overflow-hidden h-9 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 bg-transparent text-sm px-4 outline-none placeholder:text-muted-foreground min-w-0 h-full"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="flex items-center justify-center h-full px-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <div className="w-px h-5 bg-border mx-1 flex-shrink-0" />
          <div ref={catRef} className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setCatOpen((p) => !p)}
              className="flex items-center gap-1 px-3 h-9 text-xs font-bold uppercase tracking-wide text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <span className="max-w-[80px] truncate">{shortLabel}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", catOpen && "rotate-180")} />
            </button>
            {catOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-background border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-150 max-h-72 overflow-y-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setSelectedCategory(cat); setCatOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors",
                      selectedCategory === cat && "text-primary font-semibold bg-primary/5"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="flex items-center justify-center h-9 w-11 bg-primary hover:bg-primary/90 transition-colors flex-shrink-0 rounded-r-full">
            <Search className="h-4 w-4 text-primary-foreground" />
          </button>
        </form>

        {/* Spacer (mobile only) */}
        <div className="flex-1 md:hidden" />

        {/* Action icons */}
        <div className="flex items-center gap-0">

          {/* Wishlist */}
          <Link href="/wishlist">
            <button className="relative flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white leading-none">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <button className="relative flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground leading-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </Link>

          {/* Account */}
          <Link href="/login">
            <button className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors">
              <User className="h-5 w-5" />
            </button>
          </Link>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </div>
      </div>

    </header>
  );
}
