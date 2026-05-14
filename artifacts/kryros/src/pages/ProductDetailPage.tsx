import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Truck, RefreshCw, ShieldCheck, Zap, Heart } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { PRODUCTS } from "@/lib/mockData";
import { ProductCard } from "@/components/layout/ProductCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingActions } from "@/components/layout/FloatingActions";

const TEAL = "#1FA89A";

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: "#FFC107", fontSize: 14, opacity: s <= Math.round(rating) ? 1 : 0.25 }}>★</span>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const productId = params?.id ? parseInt(params.id) : 1;
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [wished, setWished] = useState(false);

  const colors = [
    { label: "Natural", hex: "#b4b2af" },
    { label: "Dark",    hex: "#2B2F39" },
    { label: "White",   hex: "#f3f2ee" },
    { label: "Black",   hex: "#1e1e1e" },
  ];
  const storages = ["256GB", "512GB", "1TB"];
  const gallery = [product.image, product.image, product.image, product.image];

  const handleAddToCart = () => {
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: Date.now() + i,
        productId: product.id,
        name: product.name,
        variant: `${selectedStorage}, ${colors[selectedColor].label}`,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
    }
    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "var(--foreground)" }}>

      {/* Sticky header */}
      <div style={{
        height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 30, background: "var(--background)",
      }}>
        <button onClick={() => setLocation("/")} style={{
          width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--foreground)", background: "none", border: "none", cursor: "pointer",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, color: "var(--foreground)" }}>
          {product.name}
        </span>
        <button onClick={() => setWished(w => !w)} style={{
          width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
          background: "none", border: "none", cursor: "pointer",
          color: wished ? TEAL : "var(--foreground)",
        }}>
          <Heart size={20} fill={wished ? TEAL : "none"} stroke={wished ? TEAL : "currentColor"} strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 0 110px" }}>

        {/* Main image */}
        <div style={{ position: "relative", overflow: "hidden", background: "var(--muted)" }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedImage}
              src={gallery[selectedImage]}
              alt={product.name}
              style={{ width: "100%", display: "block", aspectRatio: "1/1", objectFit: "cover" }}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
          {product.discount > 0 && (
            <div style={{
              position: "absolute", top: 14, left: 14,
              background: "#991B1B", color: "white",
              padding: "5px 12px", borderRadius: 999,
              fontSize: 13, fontWeight: 700,
            }}>
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div style={{ display: "flex", gap: 10, padding: "14px 16px 0", overflowX: "auto" }}>
          {gallery.map((img, i) => (
            <button key={i} onClick={() => setSelectedImage(i)} style={{
              width: 60, height: 60, borderRadius: 14, overflow: "hidden", flexShrink: 0,
              border: `2.5px solid ${selectedImage === i ? TEAL : "var(--border)"}`,
              background: "var(--card)", cursor: "pointer", padding: 0,
              transition: "border-color 0.15s",
            }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>

        {/* Product info block */}
        <div style={{ padding: "14px 16px 0" }}>

          {/* Category + brand */}
          <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "2px", textTransform: "uppercase" }}>
            {product.brand} · {product.category}
          </div>

          {/* Title */}
          <div style={{ marginTop: 5, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.25, color: "var(--foreground)" }}>
            {product.name}
          </div>

          {/* Rating row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <Stars rating={product.rating} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{product.rating}</span>
            <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>({product.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: TEAL, letterSpacing: -1, lineHeight: 1 }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: 16, fontWeight: 500, color: "var(--muted-foreground)", textDecoration: "line-through" }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span style={{
                background: "rgba(153,27,27,0.15)", color: "#EF4444",
                padding: "3px 10px", borderRadius: 999, fontSize: 13, fontWeight: 700,
              }}>
                Save {product.discount}%
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ marginTop: 12, fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.65 }}>
            {product.name} — a flagship product offering premium build quality, cutting-edge performance, and an immersive experience. Available with 0% financing from Kryros.
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", margin: "18px 0" }} />

        {/* Color picker */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--foreground)" }}>
            Color: <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{colors[selectedColor].label}</span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {colors.map((c, i) => (
              <button key={i} onClick={() => setSelectedColor(i)} style={{
                width: 36, height: 36, borderRadius: "50%",
                background: c.hex, cursor: "pointer", padding: 0, border: "none",
                outline: selectedColor === i ? `2.5px solid ${TEAL}` : "2.5px solid transparent",
                outlineOffset: 2,
                transition: "outline 0.15s",
              }} />
            ))}
          </div>
        </div>

        {/* Storage / Size picker */}
        <div style={{ padding: "18px 16px 0" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--foreground)" }}>
            Storage: <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{selectedStorage}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            {storages.map(size => {
              const active = selectedStorage === size;
              return (
                <button key={size} onClick={() => setSelectedStorage(size)} style={{
                  height: 40, padding: "0 20px", borderRadius: 999,
                  border: active ? "none" : "1.5px solid var(--border)",
                  background: active ? TEAL : "var(--card)",
                  color: active ? "#fff" : "var(--card-foreground)",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", margin: "18px 0" }} />

        {/* Add to cart row — matches reference exactly */}
        <div style={{ padding: "0 16px", display: "flex", alignItems: "center", gap: 10 }}>

          {/* Quantity control */}
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            background: "var(--card)", border: "1.5px solid var(--border)",
            borderRadius: 14, overflow: "hidden", height: 50, flexShrink: 0,
          }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{
                width: 42, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--foreground)", fontSize: 20, fontWeight: 300,
              }}>−</button>
            <span style={{
              minWidth: 28, textAlign: "center", fontSize: 16, fontWeight: 700,
              color: "var(--foreground)",
            }}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{
                width: 42, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--foreground)", fontSize: 20, fontWeight: 300,
              }}>+</button>
          </div>

          {/* Add to Cart */}
          <button onClick={handleAddToCart} style={{
            flex: 1, height: 50, border: "none", borderRadius: 14,
            background: isAdding ? "#178a7e" : TEAL,
            color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 6px 20px rgba(31,168,154,0.3)",
            transition: "background 0.2s",
          }}>
            <ShoppingCart size={18} strokeWidth={2.5} />
            {isAdding ? "Added!" : "Add to Cart"}
          </button>

          {/* Wishlist heart */}
          <button onClick={() => setWished(w => !w)} style={{
            width: 50, height: 50, borderRadius: 14, flexShrink: 0,
            border: "1.5px solid var(--border)", background: "var(--card)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: wished ? TEAL : "var(--foreground)",
            transition: "color 0.15s",
          }}>
            <Heart size={20} fill={wished ? TEAL : "none"} stroke={wished ? TEAL : "currentColor"} strokeWidth={2} />
          </button>
        </div>

        {/* Buy Now */}
        <div style={{ padding: "10px 16px 0" }}>
          <button
            onClick={() => { handleAddToCart(); setLocation("/checkout"); }}
            style={{
              width: "100%", height: 50, borderRadius: 14,
              border: "1.5px solid var(--border)",
              background: "var(--card)", color: "var(--foreground)",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            ⚡ Buy Now
          </button>
        </div>

        {/* BNPL */}
        <div style={{ padding: "10px 16px 0" }}>
          <div style={{
            background: "var(--card)", border: "1.5px solid var(--card-border)",
            borderRadius: 16, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "rgba(31,168,154,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Zap size={18} color={TEAL} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--card-foreground)" }}>Pay with Kryros BNPL</div>
              <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 2 }}>
                From {formatPrice(Math.round(product.price / 12))}/mo — 0% interest
              </div>
            </div>
          </div>
        </div>

        {/* Delivery card */}
        <div style={{ padding: "10px 16px 0" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--card-border)", borderRadius: 16, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <Truck size={17} color={TEAL} strokeWidth={2} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--card-foreground)" }}>Delivery</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 12, lineHeight: 1.5 }}>
              Free standard shipping on orders over $35.
            </div>
            {[
              { label: "Standard", time: "1–4 business days", cost: "$4.50",  free: false },
              { label: "Express",  time: "1 business day",    cost: "$10.00", free: false },
              { label: "Pickup",   time: "1–3 business days", cost: "Free",   free: true  },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 0",
                borderTop: i === 0 ? "1px solid var(--border)" : "none",
                borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--card-foreground)", width: 70 }}>{row.label}</span>
                <span style={{ fontSize: 13, color: "var(--muted-foreground)", flex: 1 }}>{row.time}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: row.free ? TEAL : "var(--card-foreground)" }}>{row.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Returns card */}
        <div style={{ padding: "10px 16px 0" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--card-border)", borderRadius: 16, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <RefreshCw size={17} color={TEAL} strokeWidth={2} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--card-foreground)" }}>Returns</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 10, lineHeight: 1.5 }}>
              You have 60 days to return the item.
            </div>
            {["Free store return", "Free returns via USPS Dropoff"].map((item, i, arr) => (
              <div key={item} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 0",
                borderTop: i === 0 ? "1px solid var(--border)" : "none",
                borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: 14, color: "var(--card-foreground)",
              }}>
                <span style={{ color: "var(--muted-foreground)", fontSize: 16, lineHeight: 1 }}>›</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Warranty card */}
        <div style={{ padding: "10px 16px 0" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--card-border)", borderRadius: 16, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <ShieldCheck size={17} color={TEAL} strokeWidth={2} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--card-foreground)" }}>Warranty</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.5 }}>
              1 Year Official Warranty · Accidental damage cover for 6 months.
            </div>
          </div>
        </div>

        {/* Share + Payments footer — matches reference */}
        <div style={{ padding: "24px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>

          {/* Share */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 12 }}>
              SHARE
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {/* Facebook */}
              <button style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "var(--card)", border: "1.5px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--foreground)",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </button>
              {/* Twitter / X */}
              <button style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "var(--card)", border: "1.5px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--foreground)",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              {/* Share */}
              <button style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "var(--card)", border: "1.5px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--foreground)",
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Accepted Payments */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 12 }}>
              ACCEPTED PAYMENTS
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {/* Visa */}
              <div style={{
                width: 58, height: 38, borderRadius: 10,
                background: "var(--card)", border: "1.5px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: "#1A1F71", letterSpacing: -0.5 }}>VISA</span>
              </div>
              {/* Mastercard */}
              <div style={{
                width: 58, height: 38, borderRadius: 10,
                background: "var(--card)", border: "1.5px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 0,
              }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#EB001B", marginRight: -6, zIndex: 1 }} />
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#F79E1B" }} />
              </div>
              {/* MTN Mobile Money */}
              <div style={{
                width: 58, height: 38, borderRadius: 10,
                background: TEAL, border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "white", textAlign: "center", lineHeight: 1.2 }}>MTN{"\n"}MoMo</span>
              </div>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div style={{ padding: "28px 16px 0" }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, color: "var(--foreground)" }}>You May Also Like</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {PRODUCTS.slice(1, 5).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>

      </div>

      <FloatingActions />
      <BottomNav />
    </div>
  );
}
