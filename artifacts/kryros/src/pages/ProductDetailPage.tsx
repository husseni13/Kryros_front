import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  RefreshCw,
  Facebook,
  Twitter,
  Share2,
  Minus,
  Plus,
  ChevronRight,
  Zap,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { PRODUCTS } from "@/lib/mockData";
import { ProductCard } from "@/components/layout/ProductCard";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : star - 0.5 <= rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
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
  const [selectedPlan, setSelectedPlan] = useState("12mo");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [wished, setWished] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const colors = [
    { label: "Natural Titanium", hex: "#b4b2af" },
    { label: "Blue Titanium",    hex: "#2b2d36" },
    { label: "White Titanium",   hex: "#f3f2ee" },
    { label: "Black Titanium",   hex: "#1e1e1e" },
  ];
  const storages = ["256GB", "512GB", "1TB"];
  const plans = [
    { months: "12mo", amount: Math.round(product.price / 12) },
    { months: "6mo",  amount: Math.round(product.price / 6) },
    { months: "4mo",  amount: Math.round(product.price / 4) },
  ];

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
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 bg-background">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Back header */}
      <div className="sticky top-16 z-30 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setLocation("/")}
          className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-foreground flex-1 truncate text-sm">
          {product.name}
        </span>
        <button
          onClick={() => setWished(w => !w)}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              wished ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 md:p-6">

          {/* Gallery */}
          <div className="flex flex-col gap-3 p-4 md:p-0">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square md:aspect-auto md:h-[500px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={gallery[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                />
              </AnimatePresence>
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-lg">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === i
                      ? "border-primary ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="px-4 pb-4 md:px-0 flex flex-col gap-5">
            {/* Brand + Title + Rating */}
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                {product.brand}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} />
                <span className="text-sm text-foreground font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-sm font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* BNPL */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary shrink-0" />
                <h4 className="font-semibold text-foreground text-sm">Pay over time with Kryros BNPL</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((plan) => (
                  <button
                    key={plan.months}
                    onClick={() => setSelectedPlan(plan.months)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-sm transition-all ${
                      selectedPlan === plan.months
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-xs font-medium text-muted-foreground mb-1">{plan.months}</span>
                    <span className="font-bold text-foreground text-sm">{formatPrice(plan.amount)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">
                Color:{" "}
                <span className="font-normal text-muted-foreground">
                  {colors[selectedColor].label}
                </span>
              </p>
              <div className="flex gap-2">
                {colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    title={color.label}
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === i
                        ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                        : "border-border hover:border-primary/50"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Storage selector */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">
                Storage:{" "}
                <span className="font-normal text-muted-foreground">{selectedStorage}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {storages.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedStorage(size)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      selectedStorage === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 hover:bg-muted transition-colors text-foreground"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 hover:bg-muted transition-colors text-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1 h-11 text-sm font-bold gap-2"
              >
                {isAdding ? (
                  <><Check className="w-4 h-4" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                )}
              </Button>

              <button
                onClick={() => setWished(w => !w)}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-border bg-card hover:border-primary hover:text-primary transition-all"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    wished ? "fill-primary text-primary" : "text-foreground"
                  }`}
                />
              </button>
            </div>

            {/* Delivery */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary shrink-0" />
                <h4 className="font-semibold text-foreground">Delivery</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Free standard shipping on orders over $35.
              </p>
              <div className="divide-y divide-border">
                {[
                  { label: "Standard", time: "3–5 business days", cost: "$4.50" },
                  { label: "Express",  time: "1–2 business days", cost: "$10.00" },
                  { label: "Pickup",   time: "Same day",          cost: "Free" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 text-sm">
                    <span className="font-medium text-foreground w-20">{row.label}</span>
                    <span className="text-muted-foreground flex-1">{row.time}</span>
                    <span className={`font-semibold ${row.cost === "Free" ? "text-primary" : "text-foreground"}`}>
                      {row.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Returns */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary shrink-0" />
                <h4 className="font-semibold text-foreground">Returns</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                You have 60 days to return the item.
              </p>
              <ul className="space-y-1">
                {["Free store return", "Free returns via courier dropoff"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <ChevronRight className="w-3 h-3 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warranty */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <h4 className="font-semibold text-foreground">Warranty</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                1 Year Official Warranty. Includes accidental damage protection for 6 months.
              </p>
            </div>

            {/* Share */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Share</p>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Share2].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-600/10 px-3 py-2 rounded-xl">
                <Check className="w-3 h-3 mr-1" /> Kryros Official Store
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 md:px-6 mb-10">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none h-auto bg-transparent p-0 overflow-x-auto hide-scrollbar flex-nowrap mb-8">
              <TabsTrigger value="description" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-base">Description</TabsTrigger>
              <TabsTrigger value="specs" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-base">Specifications</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-base">Reviews ({product.reviews})</TabsTrigger>
              <TabsTrigger value="qa" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-base">Q&A</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="prose dark:prose-invert max-w-4xl">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Forged in titanium.</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                iPhone 15 Pro Max is the first iPhone to feature an aerospace-grade titanium design, using the same alloy that spacecraft use for missions to Mars. Titanium has one of the best strength-to-weight ratios of any metal, making these our lightest Pro models ever.
              </p>
              <h3 className="text-xl font-bold mb-4 tracking-tight">A17 Pro chip. A monster win for gaming.</h3>
              <p className="text-muted-foreground leading-relaxed">
                It's here. The biggest redesign in the history of Apple GPUs. A17 Pro is an entirely new class of iPhone chip that delivers our best graphics performance by far. Mobile games will look and feel so immersive, with incredibly detailed environments and more realistic characters.
              </p>
            </TabsContent>

            <TabsContent value="specs" className="max-w-4xl">
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {[
                  { label: "Display",      value: "6.7-inch Super Retina XDR display with ProMotion" },
                  { label: "Processor",    value: "A17 Pro chip, 6-core CPU, 6-core GPU" },
                  { label: "Camera",       value: "48MP Main, 12MP Ultra Wide, 12MP Telephoto with 5x optical zoom" },
                  { label: "Battery",      value: "Up to 29 hours video playback, USB-C fast charging" },
                  { label: "Material",     value: "Aerospace-grade titanium design" },
                  { label: "Connectivity", value: "5G, Wi-Fi 6E, Bluetooth 5.3" },
                ].map((spec, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center p-4 bg-card hover:bg-muted/30 transition-colors">
                    <div className="w-48 font-bold text-sm text-foreground/80 mb-1 sm:mb-0">{spec.label}</div>
                    <div className="flex-1 text-sm text-muted-foreground">{spec.value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 border-border shadow-sm">
                    <div className="flex items-center gap-1 mb-3">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <h4 className="font-bold mb-2">Absolute powerhouse</h4>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Upgraded from the 12 Pro Max and the difference is night and day. The titanium makes it noticeably lighter and the camera zoom is incredible. Ordered through Kryros BNPL and process was seamless.
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Mwansa K. <span className="text-emerald-500 font-normal">✓ Verified</span></span>
                      <span className="text-muted-foreground">2 days ago</span>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button variant="outline" className="rounded-full px-8">Load More Reviews</Button>
              </div>
            </TabsContent>

            <TabsContent value="qa" className="max-w-3xl">
              <div className="space-y-4">
                {[
                  { q: "Is this the dual physical SIM version?", a: "No, this model supports 1 physical Nano-SIM and 1 eSIM." },
                  { q: "Does it come with a charger in the box?", a: "It comes with a USB-C charge cable. The power adapter is sold separately." },
                  { q: "Can I use Kryros BNPL if I'm not a citizen of my country?", a: "Yes, provided you have a valid work permit and meet our credit assessment criteria." },
                ].map((faq, i) => (
                  <div key={i} className="bg-card border border-border p-5 rounded-xl">
                    <div className="font-bold mb-2 flex items-start gap-2">
                      <span className="text-primary">Q:</span> {faq.q}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="font-medium text-foreground">A:</span> {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* You May Also Like */}
        <div className="px-4 md:px-6 mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
