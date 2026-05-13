import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { ProductCard } from "@/components/layout/ProductCard";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowRight, Zap, Star, Shield, Truck, CreditCard,
  ChevronRight, ChevronLeft, Play, VolumeX, ShoppingCart, Check, Heart, Plus,
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

// Helper to safely render text and avoid React Error #31
const s = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val.name || val.title || val.label || "";
  }
  return String(val);
};

type Product = {
  id: string;
  name: string;
  brand: { name: string };
  category: { name: string; slug: string };
  price: number;
  salePrice?: number | null;
  images: { url: string }[];
  discountPercentage?: number | null;
  isNew?: boolean;
  isTrending?: boolean;
  isHot?: boolean;
  isBestSeller?: boolean;
};

function FlashSaleCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [added, setAdded] = useState(false);
  
  if (!product) return null;
  
  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0].url : "";
  const discount = product.discountPercentage || 0;
  const currentPrice = Number(product.salePrice || product.price || 0);
  const originalPrice = product.salePrice ? Number(product.price || 0) : (currentPrice * 1.2);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: Date.now(),
      productId: product.id,
      name: s(product.name),
      variant: "Standard",
      price: currentPrice,
      quantity: 1,
      image: image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="flex-shrink-0 w-[155px] sm:w-[170px] bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group relative">
        {/* Image — full bleed */}
        <div className="aspect-square w-full overflow-hidden bg-muted/20">
          <img
            src={image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"}
            alt={s(product.name)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Discount badge — red pill, top-left over image */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full leading-tight">
            -{discount}%
          </div>
        )}

        {/* Heart — circle, top-right over image */}
        <div className="absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full bg-white/90 dark:bg-white/15 backdrop-blur-sm flex items-center justify-center">
          <Heart className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Info */}
        <div className="px-2.5 pt-2 pb-2.5">
          <p className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.2rem]">{s(product.name)}</p>

          <div className="flex items-baseline gap-1.5 mt-1.5 mb-2 flex-wrap">
            <span className="text-[15px] font-bold text-foreground">{formatPrice(currentPrice)}</span>
            {discount > 0 && (
              <span className="text-[11px] text-muted-foreground line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={cn(
              "w-full flex items-center justify-center gap-1.5 rounded-full h-9 text-[12px] font-semibold transition-all",
              added
                ? "bg-green-500 text-white"
                : "bg-[#1FA89A] hover:bg-[#18978a] text-white"
            )}
          >
            {added ? <><Check className="h-3.5 w-3.5" /> Added</> : <><Plus className="h-3.5 w-3.5" /> Add to Cart</>}
          </button>
        </div>
      </div>
    </Link>
  );
}

function FlashSaleProducts({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });
  };

  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <div className="relative group/flash">
      <button
        onClick={() => scroll("left")}
        className="absolute left-1 top-[40%] -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card/90 border border-orange-500/30 shadow-lg flex items-center justify-center opacity-0 group-hover/flash:opacity-100 transition-all hidden md:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-1 top-[40%] -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card/90 border border-orange-500/30 shadow-lg flex items-center justify-center opacity-0 group-hover/flash:opacity-100 transition-all hidden md:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth pb-1"
      >
        {products.filter(Boolean).map(product => (
          <FlashSaleCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductSlider({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 240 : -240, behavior: "smooth" });
  };

  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <div className="relative group/slider overflow-hidden">
      <button
        onClick={() => scroll("left")}
        className="absolute left-1 top-[40%] -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-muted hidden md:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-1 top-[40%] -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-muted hidden md:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth pb-1"
      >
        {products.filter(Boolean).map(product => (
          <div key={product.id} className="flex-shrink-0 w-[170px] sm:w-[195px] md:w-[215px]">
            <SafeProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SafeProductCard({ product }: { product: any }) {
  // Map the backend product format to the ProductCard expected format
  const mappedProduct = {
    id: product.id,
    name: s(product.name),
    brand: s(product.brand?.name) || "KRYROS",
    category: s(product.category?.name) || "Electronics",
    price: Number(product.salePrice || product.price || 0),
    originalPrice: Number(product.price || 0),
    rating: product.rating || 5,
    reviews: product.reviewsCount || 0,
    image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0].url : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    bnplMonthly: Number(product.salePrice || product.price || 0) / 12,
    discount: product.discountPercentage || 0,
    inStock: product.stockStatus !== "OUT_OF_STOCK",
    featured: product.isFeatured || false,
    badge: product.isNew ? "New" : (product.isTrending ? "Trending" : null)
  };

  return <ProductCard product={mappedProduct as any} />;
}

function CountdownTimer() {
  const [time, setTime] = useState({ h: 3, m: 22, s: 47 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 5, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 font-sans font-bold text-white">
      {[pad(time.h), pad(time.m), pad(time.s)].map((unit, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white/20 rounded px-2 py-1 text-xl">{unit}</span>
          {i < 2 && <span className="text-white/80 text-lg">:</span>}
        </span>
      ))}
    </div>
  );
}

type HeroSlide = {
  type: "image" | "video" | "youtube";
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  overlay: string;
  media: string;
  badge?: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    type: "youtube",
    tag: "New Arrivals 2025",
    title: "Next-Level\nSmartphones.",
    subtitle: "Own the latest iPhone, Samsung & more — with 0% financing from $58/mo.",
    cta: "Shop Phones",
    ctaLink: "/shop",
    secondaryCta: "0% Financing",
    secondaryCtaLink: "/financing",
    overlay: "from-black/70 via-black/40 to-transparent",
    media: "B0TICvpuaww",
    badge: "50K+ Products",
  },
  {
    type: "image",
    tag: "Flash Deal — Ends Soon",
    title: "Fashion That\nTurns Heads.",
    subtitle: "Streetwear, sneakers, shades and more. New drops every week.",
    cta: "Explore Fashion",
    ctaLink: "/shop",
    secondaryCta: "Flash Deals",
    secondaryCtaLink: "/flash-sales",
    overlay: "from-black/80 via-black/45 to-transparent",
    media: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&h=900&fit=crop&auto=format&q=90",
    badge: "Up to 70% Off",
  },
  {
    type: "image",
    tag: "Best Sellers",
    title: "Sound Without\nBoundaries.",
    subtitle: "Sony, Apple AirPods, Samsung Buds — immersive audio at flash prices.",
    cta: "Shop Audio",
    ctaLink: "/shop",
    secondaryCta: "View Deals",
    secondaryCtaLink: "/flash-sales",
    overlay: "from-black/85 via-black/55 to-transparent",
    media: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=900&fit=crop&auto=format&q=90",
    badge: "New Drops",
  },
  {
    type: "image",
    tag: "0% Interest — Instant Approval",
    title: "Own It Today.\nPay Tomorrow.",
    subtitle: "Get instant credit up to $5,500. No hidden fees, no paperwork.",
    cta: "Apply Now",
    ctaLink: "/financing",
    secondaryCta: "Shop Now",
    secondaryCtaLink: "/shop",
    overlay: "from-black/85 via-black/50 to-black/20",
    media: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=900&fit=crop&auto=format&q=90",
    badge: "Instant Credit",
  },
];

function HeroMedia({ slide, active }: { slide: HeroSlide; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current) return;
    if (active) { videoRef.current.currentTime = 0; videoRef.current.play().catch(() => {}); }
    else videoRef.current.pause();
  }, [active]);

  if (slide.type === "youtube") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${slide.media}?autoplay=1&mute=1&loop=1&playlist=${slide.media}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
          allow="autoplay; fullscreen"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "max(100vw, 177.78vh)",
            height: "max(100vh, 56.25vw)",
            border: "none",
          }}
          title="Hero background video"
        />
      </div>
    );
  }

  if (slide.type === "video") {
    return (
      <video ref={videoRef} src={slide.media} className="absolute inset-0 w-full h-full object-cover"
        muted loop playsInline preload="metadata" />
    );
  }
  return <img src={slide.media} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />;
}

function HeroSection({ slides }: { slides: any[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((idx: number) => setCurrent((idx + slides.length) % slides.length), [slides.length]);
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    if (paused || !slides.length) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, paused, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <section className="relative w-full h-[72vh] min-h-[420px] max-h-[600px] md:h-[78vh] md:min-h-[580px] md:max-h-[900px] overflow-hidden bg-black">
      {slides.map((s, i) => (
        <div key={i} className={cn("absolute inset-0 transition-opacity duration-700", i === current ? "opacity-100 z-10" : "opacity-0 z-0")}>
          <HeroMedia slide={{
            type: s.mediaType === "video" ? "video" : (s.mediaType === "youtube" ? "youtube" : "image"),
            tag: s.tag || s.subtitle || "",
            title: s.title,
            subtitle: s.subtitle || "",
            cta: s.linkText || "Shop Now",
            ctaLink: s.link || "/shop",
            secondaryCta: s.secondaryCta,
            secondaryCtaLink: s.secondaryCtaLink,
            badge: s.badge,
            overlay: "from-black/70 via-black/40 to-transparent",
            media: s.mediaType === "image" ? s.image : s.videoUrl,
          }} active={i === current} />
          <div className={cn("absolute inset-0 bg-gradient-to-r", "from-black/70 via-black/40 to-transparent")} />
        </div>
      ))}

      <div className="relative z-20 h-full flex items-center">
        <div className="w-full max-w-screen-xl mx-auto px-5 md:px-12 lg:px-16">
          <div className="max-w-xl space-y-3 md:space-y-5">
            <div key={`tag-${current}`} className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-1.5 md:px-5 md:py-2 rounded-full animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              {slide.tag || slide.subtitle}
              {slide.badge && <><span className="w-px h-3 bg-white/30" /><span className="text-amber-300">{slide.badge}</span></>}
            </div>
            <h1 key={`title-${current}`} className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] whitespace-pre-line drop-shadow-lg animate-fade-in">
              {slide.title}
            </h1>
            <p key={`sub-${current}`} className="text-sm md:text-base text-white/85 font-light leading-relaxed max-w-md animate-fade-in">
              {slide.subtitle}
            </p>
            <div className="flex flex-row gap-3 pt-2 animate-fade-in">
              <Link href={slide.link || "/shop"}>
                <Button className="rounded-full gradient-hero text-white hover:opacity-90 font-bold px-7 h-11 text-sm md:px-9 md:h-13 md:text-base shadow-brand">
                  {slide.linkText || "Shop Now"} <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              {slide.secondaryCta && (
                <Link href={slide.secondaryCtaLink || "/shop"}>
                  <Button variant="outline" className="rounded-full border-primary/70 text-white hover:bg-primary/20 backdrop-blur-sm font-semibold px-7 h-11 text-sm md:px-9 md:h-13 md:text-base">
                    {slide.secondaryCta}
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-5 md:gap-6 pt-1">
              {[{ value: "50K+", label: "Products" }, { value: "20+", label: "Countries" }, { value: "0%", label: "Interest" }].map((stat, i) => (
                <div key={i} className="flex items-center gap-5 md:gap-6">
                  {i > 0 && <div className="w-px h-6 md:h-7 bg-white/25" />}
                  <div className="text-center">
                    <p className="text-base md:text-xl font-black text-white">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-white/60 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all">
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button onClick={next} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all">
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button onClick={() => setPaused(p => !p)} className="absolute bottom-14 right-4 md:right-6 z-30 h-8 w-8 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all">
        {paused ? <Play className="h-3.5 w-3.5 fill-white" /> : <VolumeX className="h-3.5 w-3.5" />}
      </button>

      <div className="absolute bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { go(i); setPaused(false); }}
              className={cn("rounded-full transition-all duration-400", i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70")} />
          ))}
        </div>
        <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase">{current + 1} / {slides.length}</p>
      </div>

      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
          <div key={`progress-${current}`} className="h-full bg-white/60 animate-progress-bar" style={{ animationDuration: "6000ms" }} />
        </div>
      )}
    </section>
  );
}

const HOME_CATEGORY_COUNTS: Record<string, string> = {
  Smartphones: "4 Items",
  Fashion: "3 Items",
  Audio: "3 Items",
  Laptops: "2 Items",
  Watches: "2 Items",
  Cameras: "1 Item",
  Gaming: "1 Item",
  Accessories: "1 Item",
  Tablets: "1 Item",
};

function CategorySlider({ categories }: { categories: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-10 max-w-screen-xl mx-auto w-full">
      <div className="px-4 md:px-8 flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">All Products</h2>
          <p className="text-muted-foreground text-sm mt-1">Shop by category</p>
        </div>
        <Link href="/shop">
          <Button variant="ghost" size="sm" className="text-primary font-semibold text-sm">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Large image cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 px-4 md:px-8 hide-scrollbar scroll-smooth"
      >
        {categories.map((cat) => (
          <Link key={cat.id} href={`/shop?category=${encodeURIComponent(s(cat.slug))}`}>
            <div className="group flex-shrink-0 relative w-[140px] h-[170px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
              <img
                src={cat.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
                alt={s(cat.name)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-black text-sm uppercase leading-tight tracking-wide drop-shadow">
                  {s(cat.name)}
                </p>
                <p className="text-white/70 text-[11px] font-semibold mt-0.5 uppercase tracking-wide">
                  {cat._count?.products || 0} Items
                </p>
              </div>
            </div>
          </Link>
        ))}
        <Link href="/shop">
          <div className="flex-shrink-0 w-[140px] h-[170px] rounded-2xl border-2 border-dashed border-border bg-muted/40 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/70 transition-all">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">See All</p>
          </div>
        </Link>
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle, link }: { title: string; subtitle: string; link: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>
      </div>
      <Link href={link}>
        <Button variant="ghost" size="sm" className="text-primary font-semibold text-sm flex-shrink-0">
          View All <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}

function CategoryProductsSection({ section }: { section: any }) {
  const { useGet } = useApi();
  const categoryId = section.targetCategoryId || section.config?.categoryId || section.config?.targetCategoryId;
  const { data: productsData } = useGet(["products", "category", categoryId], `/products?categoryId=${categoryId}&limit=10`, { enabled: !!categoryId });

  const products = productsData?.data || [];

  if (!categoryId || !products.length) return null;

  return (
    <section className="pb-10 px-4 md:px-8 max-w-screen-xl mx-auto w-full">
      <SectionHeader 
        title={section.title || "Products"} 
        subtitle={section.subtitle || "Latest from this category"} 
        link={`/shop?category=${section.targetCategorySlug || ""}`} 
      />
      <ProductSlider products={products} />
    </section>
  );
}

const HERO_SLIDES_AS_CMS = HERO_SLIDES.map(s => ({
  isActive: true,
  mediaType: s.type,
  tag: s.tag,
  title: s.title,
  subtitle: s.subtitle,
  link: s.ctaLink,
  linkText: s.cta,
  secondaryCta: s.secondaryCta,
  secondaryCtaLink: s.secondaryCtaLink,
  badge: s.badge,
  image: s.type === "image" ? s.media : undefined,
  videoUrl: s.type !== "image" ? s.media : undefined,
}));

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { useGet, usePost } = useApi();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  // Fetch Homepage Config
  const { data: sections = [] } = useGet(["homepage-sections"], "/cms/homepage-sections");
  const { data: bannersRaw = [] } = useGet(["cms-banners"], "/cms/banners");
  const banners = Array.isArray(bannersRaw) && bannersRaw.length > 0 ? bannersRaw : HERO_SLIDES_AS_CMS;
  const { data: categories = [] } = useGet(["categories"], "/categories");
  const { data: footerConfig } = useGet(["footer-config"], "/cms/footer-config");
  const { data: footerSections = [] } = useGet(["footer-sections"], "/cms/footer-sections");

  // Fetch Product Collections
  const { data: featuredData } = useGet(["products", "featured"], "/products?isFeatured=true&limit=10");
  const { data: trendingData } = useGet(["products", "trending"], "/products?popularity=trending&limit=10");
  const { data: flashSaleData } = useGet(["products", "flash-sale"], "/products?isFlashSale=true&limit=12");

  const featuredProducts = featuredData?.data || [];
  const trendingProducts = trendingData?.data || [];
  const flashSaleProducts = flashSaleData?.data || [];

  // Newsletter Mutation
  const subscribeMutation = usePost("/newsletter/subscribe", {
    onSuccess: () => {
      toast({ title: "Subscribed!", description: "You've been added to our newsletter." });
      setEmail("");
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email });
  };

  // Helper to find specific section config
  const getSection = (type: string) => sections.find((s: any) => s.type === type);

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* HERO */}
      {Array.isArray(banners) && banners.length > 0 ? (
        <HeroSection slides={banners.filter((b: any) => b && b.isActive)} />
      ) : (
        <div className="h-64 bg-muted animate-pulse" />
      )}

      {/* DYNAMIC SECTIONS FROM CMS */}
      {Array.isArray(sections) && sections.filter((s: any) => s && s.isActive).map((section: any) => {
        if (!section) return null;
        switch (section.type) {
          case "TrustBadges":
            const badgeItems = Array.isArray(section.config?.items) ? section.config.items : [
              { icon: 'Truck', title: 'Free Delivery', subtitle: 'On orders over $30' },
              { icon: 'Shield', title: '2-Year Warranty', subtitle: 'On all electronics' },
              { icon: 'CreditCard', title: '0% Financing', subtitle: 'Instant approval' },
              { icon: 'Star', title: '4.9★ Rated', subtitle: '50,000+ customers' }
            ];
            return (
              <section key={section.id} className="bg-card border-y border-border/50 py-5 overflow-hidden">
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{section.title || "Our Guarantees"}</p>
                <div className="flex animate-marquee whitespace-nowrap select-none">
                  {badgeItems.filter(Boolean).map((item: any, i: number) => {
                     if (item.type === 'brand') {
                       return (
                         <span key={i} className="inline-flex items-center mx-6 text-lg md:text-xl font-black text-muted-foreground/40 tracking-tight flex-shrink-0">
                           {item.name}
                         </span>
                       );
                     }
                     const IconComp = item.icon === 'Truck' ? Truck : (item.icon === 'ShieldCheck' || item.icon === 'Shield' ? Shield : (item.icon === 'CreditCard' ? CreditCard : Star));
                     return (
                       <span key={i} className="inline-flex items-center gap-2.5 mx-6 flex-shrink-0">
                         <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                           <IconComp className="h-4 w-4 text-primary" />
                         </span>
                         <span className="flex flex-col leading-none">
                           <span className="text-xs font-bold text-foreground">{item.title}</span>
                           <span className="text-[10px] text-muted-foreground mt-0.5">{item.subtitle}</span>
                         </span>
                       </span>
                     );
                   })}
                   {/* Duplicate for marquee effect */}
                   {badgeItems.filter(Boolean).map((item: any, i: number) => {
                     if (item.type === 'brand') {
                       return (
                         <span key={`dup-${i}`} className="inline-flex items-center mx-6 text-lg md:text-xl font-black text-muted-foreground/40 tracking-tight flex-shrink-0">
                           {item.name}
                         </span>
                       );
                     }
                     const IconComp = item.icon === 'Truck' ? Truck : (item.icon === 'ShieldCheck' || item.icon === 'Shield' ? Shield : (item.icon === 'CreditCard' ? CreditCard : Star));
                     return (
                       <span key={`dup-${i}`} className="inline-flex items-center gap-2.5 mx-6 flex-shrink-0">
                         <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                           <IconComp className="h-4 w-4 text-primary" />
                         </span>
                         <span className="flex flex-col leading-none">
                           <span className="text-xs font-bold text-foreground">{item.title}</span>
                           <span className="text-[10px] text-muted-foreground mt-0.5">{item.subtitle}</span>
                         </span>
                       </span>
                     );
                   })}
                </div>
              </section>
            );

          case "FlashSale":
            return (
              <div key={section.id}>
                {/* FLASH SALE BANNER */}
                <section className="gradient-flash py-5 px-4">
                  <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Zap className="h-6 w-6 text-white fill-white animate-pulse" />
                      <div>
                        <p className="text-white font-bold text-lg leading-none">{section.title || "FLASH SALE LIVE"}</p>
                        <p className="text-white/80 text-xs mt-0.5">{section.subtitle || "Up to 70% off — limited time"}</p>
                      </div>
                    </div>
                    <CountdownTimer />
                    <Link href="/flash-sales">
                      <Button className="rounded-full bg-white text-orange-600 hover:bg-white/90 font-bold shadow-lg px-6">
                        Shop Flash Deals <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </section>

                <section className="py-6 px-4 md:px-8 max-w-screen-xl mx-auto w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500 fill-orange-500 animate-pulse" />
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{section.title || "Flash Deals"}</h2>
                        <p className="text-muted-foreground text-xs mt-0.5">{section.subtitle || "Limited time — grab them fast"}</p>
                      </div>
                    </div>
                    <Link href="/flash-sales">
                      <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex-shrink-0">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <FlashSaleProducts products={Array.isArray(flashSaleProducts) ? flashSaleProducts : []} />
                </section>
              </div>
            );
          
          case "ProductGrid":
          case "CategoryProducts":
          case "FeaturedCategory":
            return <CategoryProductsSection key={section.id} section={section} />;

          case "FeaturedProducts":
            return (
              <section key={section.id} className="pb-10 px-4 md:px-8 max-w-screen-xl mx-auto w-full">
                <SectionHeader 
                  title={section.title || "Featured Products"} 
                  subtitle={section.subtitle || "Hand-picked for you"} 
                  link="/shop?featured=true" 
                />
                <ProductSlider products={Array.isArray(featuredProducts) ? featuredProducts : []} />
              </section>
            );

          case "TrendingProducts":
            return (
              <section key={section.id} className="pb-10 px-4 md:px-8 max-w-screen-xl mx-auto w-full">
                <SectionHeader 
                  title={section.title || "Trending Now"} 
                  subtitle={section.subtitle || "What everyone is buying"} 
                  link="/shop?popularity=trending" 
                />
                <ProductSlider products={Array.isArray(trendingProducts) ? trendingProducts : []} />
              </section>
            );

          case "PopularFiltersProducts":
          case "PopularTagsProducts":
            return (
              <section key={section.id} className="py-10 px-4 md:px-8 max-w-screen-xl mx-auto w-full">
                <SectionHeader 
                  title={section.title || "Popular Now"} 
                  subtitle={section.subtitle || "Trending collections"} 
                  link="/shop" 
                />
                <ProductSlider products={Array.isArray(trendingProducts) ? trendingProducts : []} />
              </section>
            );

          case "CategoriesGrid":
            return <CategorySlider key={section.id} categories={Array.isArray(categories) ? categories.filter((c: any) => c && c.isActive) : []} />;

          case "ProductPromoList":
            const promoItems = Array.isArray(section.config?.items) ? section.config.items : [];
            return (
              <section key={section.id} className="py-8 px-4 md:px-8 max-w-screen-xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {promoItems.filter(Boolean).map((item: any, i: number) => (
                  <div key={i} className="rounded-3xl p-8 flex flex-col justify-between min-h-[220px] transition-transform hover:scale-[1.02]" style={{ backgroundColor: item.backgroundColor || '#EEF2FF', color: item.textColor || '#4F46E5' }}>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{item.subtitle}</p>
                      <h3 className="text-2xl font-black leading-tight mb-4">{item.title}</h3>
                    </div>
                    <Link href={item.link || "/shop"}>
                      <Button variant="ghost" className="rounded-full border-current hover:bg-white/20 font-bold w-fit">
                        {item.linkText || "Buy Product"} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </section>
            );

          case "TrendProductsBanner":
            const trendBadges = Array.isArray(section.config?.badges) ? section.config.badges : [];
            return (
              <section key={section.id} className="py-8 px-4 md:px-8 max-w-screen-xl mx-auto w-full">
                <div className="rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8" style={{ backgroundColor: section.config?.backgroundColor || '#FFF7ED', color: section.config?.textColor || '#78350F' }}>
                  <div className="max-w-md space-y-4">
                    <div className="flex gap-2">
                      {trendBadges.filter(Boolean).map((badge: any, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: badge.backgroundColor, color: badge.color }}>{badge.label}</span>
                      ))}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black leading-tight">{section.config?.title || section.title}</h2>
                    <Link href={section.config?.buttonLink || "/shop"}>
                      <Button className="rounded-full font-bold px-8 h-12" style={{ backgroundColor: section.config?.textColor || '#78350F', color: section.config?.backgroundColor || '#FFF7ED' }}>
                        {section.config?.buttonText || "Check Products"}
                      </Button>
                    </Link>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    {/* Display some trending products here as a mini-grid */}
                    {Array.isArray(trendingProducts) && trendingProducts.slice(0, 2).map((p: any) => (
                      <Link key={p.id} href={`/product/${p.slug}`} className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/80 transition-colors">
                        <img src={p.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"} alt={p.name} className="w-24 h-24 object-contain mb-2" />
                        <p className="text-xs font-bold line-clamp-1">{p.name}</p>
                        <p className="text-sm font-black mt-1">${p.price}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );

          case "PromoBanner":
            return (
              <section key={section.id} className="py-6 px-4 md:px-8 max-w-screen-xl mx-auto w-full">
                <div 
                  className="relative rounded-3xl overflow-hidden h-64 md:h-80"
                  style={{ backgroundColor: section.backgroundColor || '#1B2533' }}
                >
                  {section.imageUrl && (
                    <>
                      <img src={section.imageUrl} alt={section.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    </>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12" style={{ color: section.textColor || '#ffffff' }}>
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">{section.subtitle || "New Collection"}</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-3 max-w-xs leading-tight" style={{ color: 'inherit' }}>{section.title}</h2>
                    <p className="mb-6 max-w-sm text-sm md:text-base opacity-80" style={{ color: 'inherit' }}>{section.description}</p>
                    <Link href={section.link || "/shop"}>
                      <Button className="rounded-full font-bold w-fit px-6" style={{ backgroundColor: section.textColor || '#ffffff', color: section.backgroundColor || '#1B2533' }}>
                        {section.linkText || "Shop Now"} <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            );

          case "CreditSection":
            return (
              <section key={section.id} className="py-8 px-4 md:px-8 max-w-screen-xl mx-auto w-full">
                <div className="gradient-hero rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full" />
                  <div className="absolute -right-4 -bottom-8 w-40 h-40 bg-white/5 rounded-full" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-4 text-center md:text-left max-w-xl">
                      <h2 className="text-3xl md:text-5xl font-bold leading-tight">{section.title || "Own It Today.\nPay Tomorrow."}</h2>
                      <p className="text-white/85 text-lg">{section.subtitle || "Get up to $5,500 in instant credit with 0% interest options."}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {["No hidden fees", "Instant approval", "Up to 12 months"].map(b => (
                          <span key={b} className="bg-white/15 backdrop-blur border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">{b}</span>
                        ))}
                      </div>
                    </div>
                    <Link href="/financing">
                      <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-white/90 font-bold text-base px-10 h-14 shadow-xl w-full md:w-auto">
                        Apply Now — It's Free
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}

      {/* NEWSLETTER */}
      <section className="py-20 px-4 md:px-8 max-w-screen-md mx-auto w-full text-center">
        <div className="rounded-3xl p-8 md:p-12 border border-border bg-card shadow-lg">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Ahead of the Curve</h2>
          <p className="text-muted-foreground mb-8 text-sm">Join 50,000+ subscribers getting exclusive deals, new arrivals and tech news.</p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ height: "56px", minHeight: "56px" }}
              className="flex-1 rounded-full px-8 text-base bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              disabled={subscribeMutation.isPending}
            />
            <Button 
              type="submit" 
              className="h-14 rounded-full px-10 gradient-hero text-white font-semibold text-base"
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border pt-16 pb-8 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <span className="font-sans text-2xl font-bold tracking-tight">
              <span className="text-gradient-brand">K</span>RYROS
            </span>
            <p className="text-sm text-muted-foreground max-w-xs">{footerConfig?.description || "The future of commerce is African. Gadgets, fashion and more — with zero-interest financing."}</p>
            <div className="flex gap-3">
              {["🇿🇲 ZM", "🇿🇦 ZA", "🇰🇪 KE", "🇳🇬 NG"].map(c => (
                <span key={c} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">{c}</span>
              ))}
            </div>
          </div>
          {Array.isArray(footerSections) && footerSections.filter((s: any) => s && s.isActive).map((section: any) => (
            <div key={section.id}>
              <h4 className="font-bold mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {Array.isArray(section.links) && section.links.filter((l: any) => l && l.isActive).map((link: any) => (
                  <li key={link.id}><Link href={link.href || "/"} className="hover:text-foreground transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border text-xs text-muted-foreground gap-3">
          <p>{footerConfig?.copyrightText || "© 2025 Kryros Mobile Tech Ltd. All rights reserved."}</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/" className="hover:text-foreground">Cookie Settings</Link>
          </div>
        </div>
      </footer>
      <BottomNav />
    </div>
  );
}
