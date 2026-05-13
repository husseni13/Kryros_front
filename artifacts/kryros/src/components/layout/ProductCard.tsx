import { useState } from "react";
import { Link } from "wouter";
import { Heart, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";

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

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <Link href={`/product/${product.id}`} className="flex flex-col flex-1">
        <div className="relative aspect-square bg-muted/30 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button
            onClick={handleWish}
            aria-label="Add to wishlist"
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground hover:text-primary transition-colors"
          >
            <Heart className={`w-4 h-4 ${wished ? "fill-primary text-primary" : ""}`} />
          </button>
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-md">
              -{product.discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-xs font-semibold text-foreground/70 border border-border px-3 py-1 rounded-full bg-card">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 flex-1">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            variant={added ? "secondary" : "default"}
            disabled={!product.inStock}
            className="w-full h-9 text-xs transition-all duration-200"
          >
            {added ? (
              <><Check className="w-3 h-3 mr-1" /> Added!</>
            ) : product.inStock ? (
              <><Plus className="w-3 h-3 mr-1" /> Add to Cart</>
            ) : (
              "Out of Stock"
            )}
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
