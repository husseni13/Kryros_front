import { useState } from "react";
import { Link } from "wouter";
import { Star, Heart, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { cn } from "@/lib/utils";

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  bnplMonthly: number;
  discount: number;
  inStock: boolean;
  featured: boolean;
  badge?: string | null;
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: Date.now(),
      productId: product.id,
      name: product.name,
      variant: "Standard",
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWished(w => !w);
  };

  const reviewLabel = product.reviews >= 1000
    ? `${(product.reviews / 1000).toFixed(1)}k`
    : String(product.reviews);

  return (
    <div className="group relative flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-card-float hover:border-primary/25 transition-all duration-300">

      {/* ── Image area ── */}
      <Link href={`/product/${product.id}`} className="block">
        {/* aspect-square gives a reliable square that scales with card width */}
        <div className="aspect-square w-full overflow-hidden bg-gradient-to-b from-muted/20 to-muted/5 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Badges */}
      {product.discount > 0 && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md leading-tight">
          -{product.discount}%
        </span>
      )}
      {product.badge && product.badge !== "Out of Stock" && (
        <span className={cn(
          "absolute top-2.5 z-10 text-[9px] font-black px-1.5 py-0.5 rounded-md leading-tight",
          product.discount > 0 ? "left-11" : "left-2.5",
          product.badge === "New" ? "bg-teal-500 text-white" :
          product.badge === "Trending" || product.badge === "Flash Deal" ? "gradient-flash text-white" :
          product.badge === "Hot" ? "bg-orange-500 text-white" :
          "bg-primary text-primary-foreground"
        )}>
          {product.badge}
        </span>
      )}

      {/* Out of stock overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 z-10 bg-background/60 flex items-center justify-center">
          <span className="text-xs font-semibold text-foreground/70 border border-border px-3 py-1 rounded-full bg-card">
            Out of Stock
          </span>
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={handleWish}
        className={cn(
          "absolute top-2.5 right-2.5 z-20 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm",
          wished
            ? "bg-red-500 text-white"
            : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-500 hover:bg-background"
        )}
      >
        <Heart className={cn("h-3.5 w-3.5", wished && "fill-current")} />
      </button>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 px-3 pt-2 pb-3 gap-1">
        <Link href={`/product/${product.id}`} className="block flex-1">
          <p className="text-[10px] font-black text-primary uppercase tracking-wide mb-0.5">
            {product.brand}
          </p>
          <h3 className="text-[12px] font-semibold leading-snug line-clamp-2 text-foreground mb-1.5 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Star rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={cn(
                    "h-2.5 w-2.5",
                    i <= Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({reviewLabel})</span>
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-[13px] sm:text-sm font-black text-foreground leading-none">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-muted-foreground line-through font-sans leading-none">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* BNPL line */}
          <p className="text-[10px] text-amber-500 font-bold mt-0.5">
            {formatPrice(product.bnplMonthly)}/mo · 0%
          </p>
        </Link>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            "mt-2 w-full h-8 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95",
            added
              ? "bg-green-500 text-white"
              : product.inStock
              ? "gradient-hero text-white hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {added ? (
            <><Check className="h-3.5 w-3.5" /> Added!</>
          ) : product.inStock ? (
            <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>
    </div>
  );
}
