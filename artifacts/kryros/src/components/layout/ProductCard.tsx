import { useState } from "react";
import { Link } from "wouter";
import { Heart, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
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

const CARD_BG   = "#161b21";
const BTN_TEAL  = "#1FA89A";
const BTN_HOVER = "#178a7e";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [wished, setWished] = useState(false);
  const [added, setAdded]   = useState(false);
  const [btnHover, setBtnHover] = useState(false);

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
      style={{
        background: CARD_BG,
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Link href={`/product/${product.id}`} style={{ display: "flex", flexDirection: "column", flex: 1, textDecoration: "none" }}>

        {/* Image */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {/* Discount badge */}
          {product.discount > 0 && (
            <div style={{
              position: "absolute", top: 10, left: 10,
              background: "#8B0000", color: "white",
              padding: "4px 10px", borderRadius: 999,
              fontSize: 13, fontWeight: 700,
            }}>
              -{product.discount}%
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWish}
            aria-label="Add to wishlist"
            style={{
              position: "absolute", top: 10, right: 10,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(30,30,30,0.75)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: wished ? BTN_TEAL : "white",
              backdropFilter: "blur(4px)",
            }}
          >
            <Heart size={17} fill={wished ? BTN_TEAL : "none"} stroke={wished ? BTN_TEAL : "white"} strokeWidth={2} />
          </button>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "4px 12px", borderRadius: 999, background: CARD_BG,
              }}>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "12px 12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>

          {/* Product name — max 2 lines, ellipsis for overflow */}
          <div style={{
            fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {product.name}
          </div>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: 13, color: "#7A8899", textDecoration: "line-through", fontWeight: 500 }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              marginTop: 2,
              width: "100%", height: 44, borderRadius: 999,
              border: "none", cursor: product.inStock ? "pointer" : "default",
              background: added ? BTN_HOVER : btnHover && product.inStock ? BTN_HOVER : BTN_TEAL,
              color: "white",
              fontSize: 15, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              transition: "background 0.15s",
              opacity: product.inStock ? 1 : 0.5,
            }}
          >
            {added ? (
              <><Check size={16} /> Added!</>
            ) : (
              <><Plus size={16} /> Add to Cart</>
            )}
          </button>

        </div>
      </Link>
    </motion.div>
  );
}
