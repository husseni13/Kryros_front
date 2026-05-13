import { useState } from "react";
import { Heart, Share2, ShoppingCart, X, SortAsc, Star } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { PRODUCTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(PRODUCTS.slice(0, 8));
  const [sort, setSort] = useState("Newest");
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  function removeItem(id: number) {
    setWishlistItems((prev) => prev.filter((p) => p.id !== id));
  }

  function handleShare() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleAddToCart(product: typeof PRODUCTS[0]) {
    addToCart({
      id: Date.now(),
      productId: product.id,
      name: product.name,
      variant: "Standard",
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 1500);
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-screen-xl mx-auto w-full px-4 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Heart className="h-7 w-7 text-red-500 fill-red-500" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Wishlist</h1>
            <Badge variant="secondary" className="rounded-full font-sans">{wishlistItems.length}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2 text-sm">
                  <SortAsc className="h-4 w-4" /> {sort}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["Newest", "Price: Low to High", "Price: High to Low", "Name"].map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setSort(s)}>{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="rounded-xl gap-2 text-sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              {copied ? "Link Copied!" : "Share"}
            </Button>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save products you love and come back to them anytime.</p>
            <Link href="/shop">
              <Button className="gradient-hero text-white rounded-full px-8">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {wishlistItems.map((product) => (
              <div key={product.id} className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all hover:-translate-y-1">
                <button
                  className="absolute left-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 backdrop-blur text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  onClick={() => removeItem(product.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {product.discount > 0 && (
                  <div className="absolute right-2 top-2 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    -{product.discount}%
                  </div>
                )}

                <Link href={`/product/${product.id}`}>
                  <div className="aspect-square w-full overflow-hidden bg-muted/30">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Link>

                <div className="p-3">
                  <p className="text-[11px] font-semibold text-primary mb-0.5">{product.brand}</p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-2 min-h-[2.5rem] hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="font-sans text-base font-bold">{formatPrice(product.price)}</span>
                    <span className="font-sans text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  </div>
                  <p className="text-[10px] text-amber-500 font-semibold mb-3">From {formatPrice(product.bnplMonthly)}/mo</p>

                  <Button
                    size="sm"
                    className={cn(
                      "w-full h-9 rounded-xl text-xs font-semibold gap-1.5 transition-all",
                      addedIds.includes(product.id) ? "bg-green-500 hover:bg-green-500 text-white" :
                      product.inStock ? "gradient-hero border-0 text-white hover:opacity-90" :
                      "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {addedIds.includes(product.id) ? "Added!" : product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
