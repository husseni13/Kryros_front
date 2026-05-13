import { useState } from "react";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Shield, Truck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProductCard } from "@/components/layout/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { PRODUCTS } from "@/lib/mockData";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const vat = Math.round((subtotal - discount) * 0.16);
  const total = subtotal - discount + vat;
  const bnplMonthly = Math.round(total / 4);

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-screen-xl mx-auto w-full px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <Badge variant="secondary" className="rounded-full font-sans">{items.length} items</Badge>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Browse our products and add your favourites.</p>
            <Link href="/shop">
              <Button className="gradient-hero text-white rounded-full px-8 h-12">
                Browse Products <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-card rounded-2xl border border-border/60">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-primary/40" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-sans font-bold">{formatPrice(item.price * item.quantity)}</p>
                        {item.quantity > 1 && (
                          <p className="font-sans text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code */}
              <div className="p-4 bg-card rounded-2xl border border-border/60">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Promo Code</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="rounded-full text-sm h-10"
                  />
                  <Button
                    variant="outline"
                    className="rounded-full px-5 h-10 font-semibold"
                    onClick={() => { if (promoCode) setPromoApplied(true); }}
                  >
                    Apply
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-green-500 font-semibold mt-2">✓ 10% discount applied!</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="p-6 bg-card rounded-2xl border border-border/60 sticky top-24">
                <h2 className="font-bold text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-sans font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount (10%)</span>
                      <span className="font-sans font-semibold">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5" /> Shipping
                    </span>
                    <span className="font-semibold text-green-500">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT (16%)</span>
                    <span className="font-sans font-semibold">{formatPrice(vat)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-baseline mb-4">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-sans font-bold text-xl">{formatPrice(total)}</span>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    💳 Split into 4 payments of {formatPrice(bnplMonthly)}/mo
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">0% interest • No hidden fees • Instant approval</p>
                </div>

                <Link href="/checkout">
                  <Button className="w-full gradient-hero border-0 text-white font-bold rounded-full h-12 text-base hover:opacity-90">
                    Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="ghost" className="w-full mt-2 rounded-full text-muted-foreground hover:text-foreground text-sm">
                    Continue Shopping
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secure checkout</span>
                  <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Free delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* You may also like */}
        {items.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PRODUCTS.filter(p => !items.find(i => i.productId === p.id)).slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
