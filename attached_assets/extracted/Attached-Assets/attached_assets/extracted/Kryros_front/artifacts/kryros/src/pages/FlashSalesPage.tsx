import { PRODUCTS } from "@/lib/mockData";
import { ProductCard } from "@/components/layout/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Timer, ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";

export default function FlashSalesPage() {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      {/* Hero */}
      <section className="gradient-flash py-5 px-4 md:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0,transparent_50%)]" />
        </div>

        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: title */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex-shrink-0">
                <Zap className="h-4 w-4 text-white fill-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight leading-none">FLASH SALES</h1>
                <p className="text-white/75 text-xs mt-0.5">Limited time — massive discounts</p>
              </div>
            </div>

            {/* Right: countdown */}
            <div className="flex gap-2 items-center">
              {[{ val: "03", label: "Days" }, { val: "22", label: "Hrs" }, { val: "47", label: "Min" }, { val: "08", label: "Sec" }].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="bg-black/35 backdrop-blur-md rounded-lg px-2.5 py-1.5 text-center min-w-[44px]">
                    <div className="text-lg font-sans font-bold leading-none">{item.val}</div>
                    <div className="text-[9px] uppercase tracking-wider opacity-60 mt-0.5">{item.label}</div>
                  </div>
                  {i < 3 && <span className="text-white/50 font-bold text-sm">:</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Deals */}
      <section className="py-12 px-4 md:px-8 max-w-screen-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
            </span>
            Live Now
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {PRODUCTS.slice(4, 10).map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="absolute top-2 right-2 left-2 z-20 pointer-events-none">
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-background/80 backdrop-blur rounded-full h-2 overflow-hidden mt-12 px-0.5 py-0.5">
                    <div className="bg-destructive h-full rounded-full" style={{ width: `${Math.random() * 40 + 10}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-destructive px-2 text-right">Only {Math.floor(Math.random() * 15 + 2)} left!</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Deals */}
      <section className="py-12 px-4 md:px-8 max-w-screen-2xl mx-auto w-full bg-muted/20 border-t border-border rounded-3xl mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
          <Timer className="h-6 w-6 text-muted-foreground" />
          Upcoming Deals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-xl z-10 flex flex-col items-center justify-center transition-all group-hover:bg-background/60">
                <Lock className="h-8 w-8 text-muted-foreground mb-3" />
                <div className="font-sans font-bold text-xl mb-1">Starts in {i * 2 + 1}h</div>
                <div className="text-sm text-muted-foreground">Mystery Product</div>
              </div>
              <div className="opacity-30 blur-sm">
                <div className="aspect-square bg-muted rounded-xl mb-4" />
                <div className="h-4 bg-muted w-3/4 rounded mb-2" />
                <div className="h-4 bg-muted w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alert Signup */}
      <section className="py-12 px-4 md:px-8 max-w-screen-md mx-auto w-full mb-12 text-center">
        <div className="border-2 border-brand-gold/30 bg-brand-gold/5 rounded-3xl p-8 md:p-12">
          <Zap className="h-10 w-10 text-brand-gold mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Never miss a drop</h2>
          <p className="text-muted-foreground mb-8">Get instant notifications via SMS when new flash sales go live.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1 relative">
              <Input type="tel" placeholder="Phone number (with country code)" className="h-12 rounded-full px-5" />
            </div>
            <Button type="submit" className="h-12 rounded-full px-8 gradient-gold text-brand-navy font-bold">
              Notify Me
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
