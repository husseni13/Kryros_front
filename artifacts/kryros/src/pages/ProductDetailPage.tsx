import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { PRODUCTS } from "@/lib/mockData";
import { ProductCard } from "@/components/layout/ProductCard";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingActions } from "@/components/layout/FloatingActions";

const BG    = "#050816";
const CARD  = "#0D1523";
const CARD2 = "#101826";
const TEAL  = "#22D3C5";
const MUTED = "#8E9AAF";
const BORDER = "rgba(255,255,255,0.07)";

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: "#FFC107", fontSize: 15, opacity: s <= Math.round(rating) ? 1 : 0.25 }}>★</span>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "white" }}>
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Product sub-header */}
      <div style={{
        height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", borderBottom: `1px solid ${BORDER}`,
        position: "sticky", top: "var(--navbar-height, 88px)", zIndex: 30,
        background: BG,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLocation("/")}
            style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "white", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>
            ←
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>{product.name}</span>
        </div>
        <button onClick={() => setWished(w => !w)}
          style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: wished ? TEAL : "white", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>
          {wished ? "♥" : "♡"}
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* Main image */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "#dfe3e8" }}>
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
        <div style={{ display: "flex", gap: 10, marginTop: 12, overflowX: "auto", paddingBottom: 2 }}>
          {gallery.map((img, i) => (
            <button key={i} onClick={() => setSelectedImage(i)}
              style={{
                width: 58, height: 58, borderRadius: 14, overflow: "hidden", flexShrink: 0,
                border: `2px solid ${selectedImage === i ? TEAL : "transparent"}`,
                boxShadow: selectedImage === i ? `0 0 0 1px rgba(34,211,197,0.2)` : "none",
                background: CARD2, cursor: "pointer", padding: 0,
              }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>

        {/* Category */}
        <div style={{ marginTop: 18, color: TEAL, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
          {product.brand} · {product.category}
        </div>

        {/* Title */}
        <div style={{ marginTop: 6, fontSize: 22, lineHeight: "28px", fontWeight: 800, letterSpacing: -0.5 }}>
          {product.name}
        </div>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>{product.rating}</span>
          <span style={{ fontSize: 14, color: MUTED }}>({product.reviews.toLocaleString()} reviews)</span>
        </div>

        {/* Price */}
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: 30, lineHeight: 1, fontWeight: 800, color: TEAL, letterSpacing: -1 }}>
            {formatPrice(product.price)}
          </div>
          {product.originalPrice > product.price && (
            <div style={{ fontSize: 16, fontWeight: 500, color: "#A9B4C7", textDecoration: "line-through" }}>
              {formatPrice(product.originalPrice)}
            </div>
          )}
          {product.discount > 0 && (
            <div style={{
              background: "rgba(127,29,29,0.3)", color: "#EF4444",
              padding: "4px 10px", borderRadius: 999,
              fontSize: 13, fontWeight: 700,
            }}>
              Save {product.discount}%
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ marginTop: 16, color: MUTED, fontSize: 14, lineHeight: 1.7, fontWeight: 400 }}>
          {product.name} — a flagship product offering premium build quality, cutting-edge performance, and an immersive experience. Available with 0% financing from Kryros.
        </div>

        {/* Color */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            Color: <span style={{ fontWeight: 400, color: MUTED }}>{colors[selectedColor].label}</span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {colors.map((c, i) => (
              <button key={i} onClick={() => setSelectedColor(i)}
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  border: `2px solid ${selectedColor === i ? TEAL : "transparent"}`,
                  background: c.hex, cursor: "pointer", padding: 0,
                  boxShadow: selectedColor === i ? `0 0 0 2px rgba(34,211,197,0.15)` : "none",
                  transition: "all 0.15s",
                }} />
            ))}
          </div>
        </div>

        {/* Storage */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            Storage: <span style={{ fontWeight: 400, color: MUTED }}>{selectedStorage}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            {storages.map(size => (
              <button key={size} onClick={() => setSelectedStorage(size)}
                style={{
                  height: 44, padding: "0 18px", borderRadius: 14,
                  border: `1px solid ${selectedStorage === size ? "transparent" : "#1E293B"}`,
                  background: selectedStorage === size ? TEAL : CARD2,
                  color: selectedStorage === size ? "#000" : "white",
                  fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                }}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22 }}>
          {/* Qty */}
          <div style={{
            width: 110, height: 48, borderRadius: 16, border: `1px solid #1E293B`,
            background: CARD2, display: "flex", alignItems: "center", justifyContent: "space-around",
            fontSize: 17, fontWeight: 700,
          }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18, padding: "0 10px", height: "100%" }}>
              −
            </button>
            <span style={{ minWidth: 22, textAlign: "center", fontSize: 15 }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18, padding: "0 10px", height: "100%" }}>
              +
            </button>
          </div>

          {/* Add to cart */}
          <button onClick={handleAddToCart}
            style={{
              flex: 1, height: 48, border: "none", borderRadius: 16,
              background: isAdding ? "#1a9990" : TEAL,
              color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 8px 20px rgba(34,211,197,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "background 0.2s",
            }}>
            {isAdding ? "✓ Added!" : "🛒 Add to Cart"}
          </button>

          {/* Wishlist */}
          <button onClick={() => setWished(w => !w)}
            style={{
              width: 48, height: 48, borderRadius: 16, border: `1px solid #1E293B`,
              background: CARD2, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, cursor: "pointer", color: wished ? TEAL : "white",
            }}>
            {wished ? "♥" : "♡"}
          </button>
        </div>

        {/* BNPL */}
        <div style={{
          marginTop: 14, background: CARD, border: `1px solid ${BORDER}`,
          borderRadius: 16, padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18, color: TEAL }}>⚡</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Pay with Kryros BNPL</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 1 }}>
              From {formatPrice(Math.round(product.price / 12))}/mo — 0% interest
            </div>
          </div>
        </div>

        {/* Delivery card */}
        <div style={{ marginTop: 18, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: TEAL, fontSize: 18 }}>🚚</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Delivery</span>
          </div>
          <div style={{ marginTop: 10, color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            Free standard shipping on orders over $35.
          </div>
          {[
            { label: "Standard", time: "3–5 business days", cost: "$4.50",  free: false },
            { label: "Express",  time: "1–2 business days", cost: "$10.00", free: false },
            { label: "Pickup",   time: "1–3 business days", cost: "Free",   free: true  },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "12px 0",
              borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{row.label}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 1 }}>{row.time}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: row.free ? TEAL : "white" }}>{row.cost}</div>
            </div>
          ))}
        </div>

        {/* Returns card */}
        <div style={{ marginTop: 14, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: TEAL, fontSize: 18 }}>↻</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Returns</span>
          </div>
          <div style={{ marginTop: 10, color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            You have 60 days to return the item.
          </div>
          {["Free store return", "Free returns via courier dropoff"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 14 }}>
              <span style={{ color: TEAL, fontSize: 15 }}>›</span>
              {item}
            </div>
          ))}
        </div>

        {/* Warranty card */}
        <div style={{ marginTop: 14, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: TEAL, fontSize: 18 }}>🛡</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Warranty</span>
          </div>
          <div style={{ marginTop: 10, color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            1 Year Official Warranty. Includes accidental damage protection for 6 months.
          </div>
        </div>

        {/* Footer: share + payments */}
        <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ color: MUTED, fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>SHARE</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["f", "𝕏", "↗"].map(icon => (
                <div key={icon} style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: CARD2, border: `1px solid ${BORDER}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, cursor: "pointer",
                }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ color: MUTED, fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>PAYMENTS</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["VISA", "MC", "MTN"].map(p => (
                <div key={p} style={{
                  width: 60, height: 44, borderRadius: 14,
                  background: CARD2, border: `1px solid ${BORDER}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}>
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>You May Also Like</div>
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
