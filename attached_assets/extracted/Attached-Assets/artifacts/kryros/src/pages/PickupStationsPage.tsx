import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, MapPin, Phone, Clock, X, ChevronDown, ChevronUp, Store } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { PICKUP_STATIONS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type Station = typeof PICKUP_STATIONS[0];

export default function PickupStationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({ Nigeria: true, Zambia: true });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PICKUP_STATIONS;
    return PICKUP_STATIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        (s.landmark ?? "").toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, Record<string, Station[]>> = {};
    for (const station of filtered) {
      if (!map[station.country]) map[station.country] = {};
      if (!map[station.country][station.state]) map[station.country][station.state] = [];
      map[station.country][station.state].push(station);
    }
    return map;
  }, [filtered]);

  const toggleCountry = (country: string) => {
    setExpandedCountries((prev) => ({ ...prev, [country]: !prev[country] }));
  };

  const totalCount = filtered.length;

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-screen-md mx-auto w-full px-4 py-6">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Store className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Pickup Stations</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Find a Kryros pickup station near you. Search by country, state, or station name.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search e.g. "Nigeria", "Lagos", "Abuja"...'
            className="w-full h-12 rounded-full border border-border bg-muted/40 pl-11 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wide">
          {totalCount} station{totalCount !== 1 ? "s" : ""} found
          {query && ` for "${query}"`}
        </p>

        {/* No results */}
        {totalCount === 0 && (
          <div className="text-center py-16">
            <Store className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-semibold text-foreground">No stations found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try searching for a different country or state.
            </p>
            <button
              onClick={() => setQuery("")}
              className="mt-4 text-sm text-primary font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Grouped results */}
        <div className="space-y-4">
          {Object.entries(grouped).map(([country, states]) => {
            const isOpen = expandedCountries[country] !== false;
            const countryTotal = Object.values(states).flat().length;

            return (
              <div key={country} className="border border-border rounded-2xl overflow-hidden">

                {/* Country header */}
                <button
                  onClick={() => toggleCountry(country)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {country === "Nigeria" ? "🇳🇬" : country === "Zambia" ? "🇿🇲" : "🌍"}
                    </span>
                    <span className="font-bold text-base">{country}</span>
                    <span className="text-xs text-muted-foreground font-medium">
                      ({countryTotal} station{countryTotal !== 1 ? "s" : ""})
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {isOpen && (
                  <div className="divide-y divide-border/50">
                    {Object.entries(states).map(([state, stations]) => (
                      <div key={state}>

                        {/* State label */}
                        <div className="px-5 pt-4 pb-2">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            {state}
                          </span>
                        </div>

                        {/* Station cards */}
                        <div className="px-4 pb-4 space-y-3">
                          {stations.map((station) => (
                            <StationCard key={station.id} station={station} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
          <p className="font-semibold text-sm mb-1">Ready to order?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Select a pickup station at checkout to collect your order at your convenience.
          </p>
          <Link href="/shop">
            <button className="h-10 px-6 rounded-full gradient-hero text-white text-sm font-bold shadow-brand transition-all active:scale-[0.98]">
              Browse Products
            </button>
          </Link>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}

function StationCard({ station }: { station: Station }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm">{station.name}</p>
          {station.landmark && (
            <p className="text-xs text-primary mt-0.5">{station.landmark}</p>
          )}
        </div>
        <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
          Open
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-primary/70" />
          <span>{station.address}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
          <span>{station.hours}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Phone className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
          <a href={`tel:${station.phone}`} className="hover:text-primary transition-colors">
            {station.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
