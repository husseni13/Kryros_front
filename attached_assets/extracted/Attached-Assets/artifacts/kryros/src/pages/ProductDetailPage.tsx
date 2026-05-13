import { useState } from "react";
import { useRoute } from "wouter";
import { PRODUCTS } from "@/lib/mockData";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Heart, Truck, ShieldCheck, Check, Plus, Minus, Zap } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { ProductCard } from "@/components/layout/ProductCard";

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 1;
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [selectedColor, setSelectedColor] = useState("Natural Titanium");
  const [selectedPlan, setSelectedPlan] = useState("12mo");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const colors = [
    { name: "Natural Titanium", hex: "#b4b2af" },
    { name: "Blue Titanium", hex: "#2b2d36" },
    { name: "White Titanium", hex: "#f3f2ee" },
    { name: "Black Titanium", hex: "#1e1e1e" },
  ];

  const storages = ["256GB", "512GB", "1TB"];
  const plans = [
    { months: "12mo", amount: Math.round(product.price / 12) },
    { months: "6mo",  amount: Math.round(product.price / 6) },
    { months: "4mo",  amount: Math.round(product.price / 4) },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="container max-w-screen-2xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumbs could go here */}

      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        {/* Left Col - Images */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="glass text-white text-xs font-bold px-3 py-1 rounded-full">New Arrival</span>
              <span className="glass text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Kryros Verified
              </span>
            </div>
            {product.discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{product.discount}% OFF
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${i === 0 ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Col - Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-2 text-primary font-bold tracking-wider text-sm uppercase">{product.brand}</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name} — {selectedStorage} {selectedColor}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= Math.floor(product.rating) ? 'fill-secondary text-secondary' : 'fill-muted text-muted'}`} />
              ))}
              <span className="ml-2 font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground text-sm">({product.reviews.toLocaleString()} reviews)</span>
            <span className="text-muted-foreground text-sm border-l border-border pl-4">1K+ bought this week</span>
          </div>

          <div className="flex items-end gap-4 mb-6">
            <span className="font-sans text-4xl font-bold text-foreground tracking-tight">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="font-sans text-xl text-muted-foreground line-through mb-1">{formatPrice(product.originalPrice)}</span>
                <span className="mb-2 bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded">SAVE {formatPrice(product.originalPrice - product.price)}</span>
              </>
            )}
          </div>

          <div className="space-y-6 mb-8">
            {/* Financing selector */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-secondary fill-secondary" />
                <span className="font-bold text-sm">Pay over time with Kryros BNPL</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((plan) => (
                  <button
                    key={plan.months}
                    onClick={() => setSelectedPlan(plan.months)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all ${
                      selectedPlan === plan.months 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-xs font-medium text-muted-foreground mb-1">{plan.months}</span>
                    <span className="font-sans font-bold text-sm">{formatPrice(plan.amount)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-medium mb-3 text-sm flex items-center justify-between">
                Color <span className="text-muted-foreground">{selectedColor}</span>
              </h3>
              <div className="flex gap-3">
                {colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${selectedColor === color.name ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : 'border-transparent'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && <Check className={`h-4 w-4 ${color.name === 'White Titanium' ? 'text-black' : 'text-white'}`} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div>
              <h3 className="font-medium mb-3 text-sm">Storage</h3>
              <div className="flex flex-wrap gap-2">
                {storages.map(storage => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedStorage === storage 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between border border-border rounded-full px-2 py-1 bg-card h-14 w-full sm:w-32 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-sans font-bold w-6 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                size="lg" 
                className="flex-1 h-14 rounded-full gradient-hero border-0 text-white font-bold text-lg hover:shadow-brand transition-all hover:-translate-y-0.5"
                onClick={() => {
                  addToCart({
                    id: Date.now(),
                    productId: product.id,
                    name: product.name,
                    variant: `${selectedStorage}, ${selectedColor}`,
                    price: product.price,
                    quantity: quantity,
                    image: product.image
                  });
                }}
              >
                Add to Cart
              </Button>
              <Button size="lg" className="flex-1 h-14 rounded-full gradient-hero border-0 text-white font-bold text-lg hover:shadow-brand transition-all hover:-translate-y-0.5">
                Buy Now
              </Button>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Button variant="link" className="text-muted-foreground hover:text-primary px-0">
                <Heart className="h-4 w-4 mr-2" /> Add to Wishlist
              </Button>
              <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-600/10 px-2 py-1 rounded">
                <Check className="h-3 w-3 mr-1" /> Kryros Official Store
              </div>
            </div>
          </div>
          
          <Card className="bg-muted/30 border-0 p-4 flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block">Free Express Delivery</span>
                <span className="text-muted-foreground">Order within 2hrs 30mins for delivery by tomorrow.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block">1 Year Official Warranty</span>
                <span className="text-muted-foreground">Includes accidental damage protection for 6 months.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-24">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b border-border rounded-none h-auto bg-transparent p-0 overflow-x-auto hide-scrollbar flex-nowrap mb-8">
            <TabsTrigger value="description" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-base">Description</TabsTrigger>
            <TabsTrigger value="specs" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-base">Specifications</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-base">Reviews ({product.reviews})</TabsTrigger>
            <TabsTrigger value="qa" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-base">Q&A</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="prose dark:prose-invert max-w-4xl font-sans">
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Forged in titanium.</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              iPhone 15 Pro Max is the first iPhone to feature an aerospace‑grade titanium design, using the same alloy that spacecraft use for missions to Mars. Titanium has one of the best strength‑to‑weight ratios of any metal, making these our lightest Pro models ever. You'll notice the difference the moment you pick one up.
            </p>
            <h3 className="text-xl font-bold mb-4 tracking-tight">A17 Pro chip. A monster win for gaming.</h3>
            <p className="text-muted-foreground leading-relaxed">
              It's here. The biggest redesign in the history of Apple GPUs. A17 Pro is an entirely new class of iPhone chip that delivers our best graphics performance by far. Mobile games will look and feel so immersive, with incredibly detailed environments and more realistic characters.
            </p>
          </TabsContent>
          
          <TabsContent value="specs" className="max-w-4xl">
            <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
              {[
                { label: "Display", value: "6.7-inch Super Retina XDR display with ProMotion" },
                { label: "Processor", value: "A17 Pro chip, 6-core CPU, 6-core GPU" },
                { label: "Camera", value: "48MP Main, 12MP Ultra Wide, 12MP Telephoto with 5x optical zoom" },
                { label: "Battery", value: "Up to 29 hours video playback, USB-C fast charging" },
                { label: "Material", value: "Aerospace-grade titanium design" },
                { label: "Connectivity", value: "5G, Wi-Fi 6E, Bluetooth 5.3" }
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
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3 w-3 fill-secondary text-secondary" />)}
                  </div>
                  <h4 className="font-bold mb-2">Absolute powerhouse</h4>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Upgraded from the 12 Pro Max and the difference is night and day. The titanium makes it noticeably lighter and the camera zoom is incredible. Ordered through Kryros BNPL and process was seamless.</p>
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
                { q: "Can I use Kryros BNPL if I'm not a citizen of my country?", a: "Yes, provided you have a valid work permit and meet our credit assessment criteria." }
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {PRODUCTS.slice(1, 5).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      </div>
      <FloatingActions />
      <BottomNav />
    </div>
  );
}
