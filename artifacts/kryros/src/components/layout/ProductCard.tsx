import { useState } from "react";
import { Link } from "wouter";
import { Heart, Check, Plus } from "lucide-react";
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
    if (!product.inStock) return;
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

  return (
    <div className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">

      {/* ── Image area — full bleed, no padding ── */}
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="w-full aspect-square overflow-hidden bg-muted/20">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Discount badge — red pill, top-left over image */}
        {product.discount > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full leading-tight">
            -{product.discount}%
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
      </Link>

      {/* Heart button — circle, top-right over image */}
      <button
        onClick={handleWish}
        aria-label="Add to wishlist"
        className={cn(
          "absolute top-2.5 right-2.5 z-20 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm",
          wished
            ? "bg-red-500 text-white"
            : "bg-white/90 dark:bg-white/15 backdrop-blur-sm text-muted-foreground hover:text-red-500"
        )}
      >
        <Heart className={cn("h-4 w-4", wished && "fill-current")} />
      </button>

      {/* ── Info section ── */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 gap-1.5">
        <Link href={`/product/${product.id}`} className="block flex-1">
          {/* Product name */}
          <h3 className="font-semibold text-[14px] leading-snug text-foreground line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price row */}
          <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
            <span className="font-bold text-[17px] text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[12px] text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </Link>

        {/* Add to Cart button — full width, pill, teal */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            "mt-1 w-full h-10 rounded-full text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95",
            added
              ? "bg-green-500 text-white"
              : product.inStock
              ? "bg-[#1FA89A] hover:bg-[#18978a] text-white"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {added ? (
            <><Check className="h-4 w-4" /> Added!</>
          ) : product.inStock ? (
            <><Plus className="h-4 w-4" /> Add to Cart</>
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>
    </div>
  );
}
