import { useState, useMemo, useRef } from "react";
import { PRODUCTS, CATEGORY_DATA } from "@/lib/mockData";
import { ProductCard } from "@/components/layout/ProductCard";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, SlidersHorizontal, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Smartphones", "Laptops", "Audio", "Fashion", "Watches", "Tablets", "Gaming", "Cameras", "Electronics", "Accessories", "Gadgets"];
const BRANDS = ["Apple", "Samsung", "Sony", "Nike", "Levi's", "Ray-Ban", "Xiaomi", "DJI", "GoPro", "Targus", "AllSaints"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
];

const CATEGORY_EMOJI: Record<string, string> = {
  Smartphones: "📱", Laptops: "💻", Audio: "🎧", Fashion: "👗",
  Watches: "⌚", Tablets: "📟", Gaming: "🎮", Cameras: "📸",
  Electronics: "⚡", Accessories: "🎒", Gadgets: "🔧",
};

const CATEGORY_ITEM_COUNTS: Record<string, number> = {
  Smartphones: 4, Laptops: 2, Audio: 3, Fashion: 3, Watches: 2,
  Tablets: 1, Gaming: 1, Cameras: 1, Electronics: 0, Accessories: 1, Gadgets: 0,
};

const EXTRA_CATS = [
  { name: "AirPods", emoji: "🎧" },
  { name: "Clothes", emoji: "👕" },
  { name: "Gaming", emoji: "🎮" },
  { name: "Tablets", emoji: "📟" },
  { name: "Cameras", emoji: "📸" },
  { name: "Accessories", emoji: "🎒" },
  { name: "Gadgets", emoji: "🔧" },
];

function ShopCategorySlider({
  selectedCategories,
  onSelect,
}: {
  selectedCategories: string[];
  onSelect: (cat: string | null) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-background">
      {/* Large image cards row */}
      <div className="pt-4 pb-2">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth px-4"
        >
          {CATEGORY_DATA.map((cat) => {
            const isActive = selectedCategories.includes(cat.name);
            const count = CATEGORY_ITEM_COUNTS[cat.name] ?? 0;
            return (
              <button
                key={cat.name}
                onClick={() => onSelect(cat.name)}
                className={cn(
                  "flex-shrink-0 relative w-[140px] h-[170px] rounded-2xl overflow-hidden transition-all",
                  isActive ? "ring-2 ring-primary scale-[1.03]" : "hover:scale-[1.02]"
                )}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <p className="text-white font-black text-sm uppercase leading-tight tracking-wide drop-shadow">
                    {cat.name}
                  </p>
                  <p className="text-white/70 text-[11px] font-semibold mt-0.5 uppercase tracking-wide">
                    {count} Items
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Small text pill row for extra categories */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 pb-4 pt-1">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap",
            selectedCategories.length === 0
              ? "bg-foreground text-background border-foreground"
              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
          )}
        >
          All
        </button>
        {EXTRA_CATS.map((c) => (
          <button
            key={c.name}
            onClick={() => onSelect(c.name)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap",
              selectedCategories.includes(c.name)
                ? "bg-foreground text-background border-foreground"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isFinancingAvailable, setIsFinancingAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (c: string) => {
    setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };
  const toggleBrand = (b: string) => {
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const handleCategorySelect = (cat: string | null) => {
    if (cat === null) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([cat]);
    }
  };

  const filteredProducts = useMemo(() => {
    let results = [...PRODUCTS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (selectedCategories.length > 0) {
      results = results.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedBrands.length > 0) {
      results = results.filter(p => selectedBrands.includes(p.brand));
    }
    switch (sortBy) {
      case "price_asc": return results.sort((a, b) => a.price - b.price);
      case "price_desc": return results.sort((a, b) => b.price - a.price);
      case "rating": return results.sort((a, b) => b.rating - a.rating);
      case "discount": return results.sort((a, b) => b.discount - a.discount);
      default: return results;
    }
  }, [selectedCategories, selectedBrands, sortBy, searchQuery]);

  const activeFilters = [...selectedCategories, ...selectedBrands];

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground">Category</h4>
        <div className="space-y-2.5">
          {CATEGORIES.map(c => (
            <div key={c} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${c}`}
                checked={selectedCategories.includes(c)}
                onCheckedChange={() => toggleCategory(c)}
              />
              <Label htmlFor={`cat-${c}`} className="text-sm font-medium cursor-pointer">{c}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground">Brand</h4>
        <div className="space-y-2.5">
          {BRANDS.map(b => (
            <div key={b} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${b}`}
                checked={selectedBrands.includes(b)}
                onCheckedChange={() => toggleBrand(b)}
              />
              <Label htmlFor={`brand-${b}`} className="text-sm font-medium cursor-pointer">{b}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground">Financing</h4>
        <div className="flex items-center space-x-2">
          <Switch id="financing" checked={isFinancingAvailable} onCheckedChange={setIsFinancingAvailable} />
          <Label htmlFor="financing" className="text-sm font-medium">Available for 0% BNPL</Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 overflow-x-hidden">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* SLIDING CATEGORY SECTION */}
      <ShopCategorySlider
        selectedCategories={selectedCategories}
        onSelect={handleCategorySelect}
      />

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border/50 py-8 px-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-bold">Filters</h3>
            {activeFilters.length > 0 && (
              <button
                onClick={() => { setSelectedCategories([]); setSelectedBrands([]); }}
                className="ml-auto text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <FilterContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-8 px-4 md:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                {selectedCategories.length === 1
                  ? `${CATEGORY_EMOJI[selectedCategories[0]] || ""} ${selectedCategories[0]}`
                  : "All Products"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Showing {filteredProducts.length} results
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full h-10 bg-muted border-none focus-visible:ring-1"
              />
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map(f => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full cursor-pointer hover:bg-primary/20"
                    onClick={() => {
                      toggleCategory(f);
                      toggleBrand(f);
                    }}
                  >
                    {f}
                    <X className="h-3 w-3" />
                  </span>
                ))}
                <button
                  onClick={() => { setSelectedCategories([]); setSelectedBrands([]); }}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Brand quick-filter pills */}
          <div className="mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Filter by Brand</p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
              <button
                onClick={() => setSelectedBrands([])}
                className={cn(
                  "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
                  selectedBrands.length === 0
                    ? "gradient-hero text-white border-transparent shadow-brand"
                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                )}
              >
                All Brands
              </button>
              {BRANDS.map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBrands(prev =>
                    prev.includes(b) ? prev.filter(x => x !== b) : [b]
                  )}
                  className={cn(
                    "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border whitespace-nowrap",
                    selectedBrands.includes(b)
                      ? "gradient-hero text-white border-transparent shadow-brand"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or search query.</p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setSearchQuery(""); }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div
              className="gap-3"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
            >
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
      <FloatingActions />
      <BottomNav />
    </div>
  );
}
