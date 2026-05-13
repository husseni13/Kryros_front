import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  CheckCircle2, CreditCard, Smartphone, Building2,
  MapPin, Lock, Shield, RotateCcw, Package, ChevronRight, ChevronDown,
  MessageCircle, User, MessageSquare, Send, Store, Search, X, Clock, Phone,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { PICKUP_STATIONS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const STEPS = ["Address", "Payment", "Confirm"];

const SAVED_ADDRESSES = [
  { id: 1, name: "Alex Johnson", line1: "14 Victoria Street", line2: "City Centre", city: "Lagos", country: "Nigeria", phone: "+234 801 234 5678", default: true },
  { id: 2, name: "Alex Johnson", line1: "Plot 5, Parkview Close", line2: "Parkview", city: "Lagos", country: "Nigeria", phone: "+234 801 234 5678", default: false },
];

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "mobile", label: "Mobile Money", icon: Smartphone },
  { id: "whatsapp", label: "Pay on WhatsApp", icon: MessageCircle },
  { id: "bank", label: "Bank Transfer", icon: Building2 },
];

const MOBILE_MONEY = [
  {
    id: "airtel",  label: "Airtel Money",  logo: "/airtel-logo.png",  fallbackBg: "bg-red-600",    fallbackText: "AIR",
  },
  {
    id: "mtn",     label: "MTN MoMo",      logo: "/mtn-logo.png",     fallbackBg: "bg-yellow-400", fallbackText: "MTN",
  },
  {
    id: "zamtel",  label: "Zamtel Money",  logo: "/zamtel-logo.jpeg", fallbackBg: "bg-green-600",  fallbackText: "ZAM",
  },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [deliveryType, setDeliveryType] = useState<"home" | "pickup">("home");
  const [pickupSearch, setPickupSearch] = useState("");
  const [selectedPickupId, setSelectedPickupId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [mobileMoney, setMobileMoney] = useState("airtel");
  const [mobileMoneyOpen, setMobileMoneyOpen] = useState(false);
  const mobileMoneyRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const { items } = useCart();
  const { formatPrice } = useCurrency();

  const filteredPickupStations = useMemo(() => {
    const q = pickupSearch.trim().toLowerCase();
    if (!q) return PICKUP_STATIONS;
    return PICKUP_STATIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }, [pickupSearch]);

  const selectedPickup = PICKUP_STATIONS.find((s) => s.id === selectedPickupId);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = Math.round(subtotal * 0.16);
  const total = subtotal + vat;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (mobileMoneyRef.current && !mobileMoneyRef.current.contains(e.target as Node)) {
        setMobileMoneyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const currentProvider = MOBILE_MONEY.find(m => m.id === mobileMoney) ?? MOBILE_MONEY[0];

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-screen-xl mx-auto w-full px-4 md:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

        {/* Step Progress */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <button
                className="flex items-center gap-2 group"
                onClick={() => i < step && setStep(i)}
                data-testid={`step-${s.toLowerCase()}`}
              >
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm transition-all",
                  i < step ? "gradient-hero text-white shadow-brand" :
                  i === step ? "gradient-hero text-white shadow-brand ring-4 ring-primary/20" :
                  "bg-muted text-muted-foreground"
                )}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn("text-sm font-medium hidden md:block", i === step ? "text-foreground" : "text-muted-foreground")}>
                  {s}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-px mx-3", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Step Content */}
          <div className="flex-1">
            {/* STEP 1 — ADDRESS */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Delivery Method</h2>

                {/* Delivery type toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryType("home")}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                      deliveryType === "home"
                        ? "border-primary bg-primary/5 shadow-brand"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <MapPin className={cn("h-6 w-6", deliveryType === "home" ? "text-primary" : "text-muted-foreground")} />
                    <div className="text-center">
                      <p className={cn("text-sm font-semibold", deliveryType === "home" ? "text-foreground" : "text-muted-foreground")}>Home Delivery</p>
                      <p className="text-[11px] text-muted-foreground">Delivered to your door</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setDeliveryType("pickup")}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                      deliveryType === "pickup"
                        ? "border-primary bg-primary/5 shadow-brand"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <Store className={cn("h-6 w-6", deliveryType === "pickup" ? "text-primary" : "text-muted-foreground")} />
                    <div className="text-center">
                      <p className={cn("text-sm font-semibold", deliveryType === "pickup" ? "text-foreground" : "text-muted-foreground")}>Pickup Station</p>
                      <p className="text-[11px] text-muted-foreground">Collect at our station</p>
                    </div>
                  </button>
                </div>

                {/* HOME DELIVERY — saved addresses */}
                {deliveryType === "home" && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Select a delivery address</p>
                    {SAVED_ADDRESSES.map((addr) => (
                  <div
                    key={addr.id}
                    className={cn(
                      "border-2 rounded-2xl p-5 cursor-pointer transition-all",
                      selectedAddress === addr.id ? "border-primary bg-primary/5 shadow-brand" : "border-border bg-card hover:border-primary/40"
                    )}
                    onClick={() => setSelectedAddress(addr.id)}
                    data-testid={`address-${addr.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{addr.name}</span>
                          {addr.default && <Badge>Default</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.line1}, {addr.line2}</p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.country}</p>
                        <p className="text-sm text-muted-foreground">{addr.phone}</p>
                      </div>
                      <div className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                        selectedAddress === addr.id ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {selectedAddress === addr.id && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                ))}

                    <Button variant="outline" className="w-full h-12 rounded-xl border-dashed gap-2" onClick={() => setShowNewAddress(!showNewAddress)} data-testid="button-add-address">
                      + Add New Address
                    </Button>

                    {showNewAddress && (
                      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                        <p className="text-xs text-muted-foreground font-medium">We deliver internationally — enter any address worldwide.</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label className="text-xs text-muted-foreground mb-1.5 block">Full Name</Label><Input placeholder="Full name" className="h-11 rounded-xl" /></div>
                          <div><Label className="text-xs text-muted-foreground mb-1.5 block">Phone Number</Label><Input placeholder="+234 80..." className="h-11 rounded-xl" /></div>
                        </div>
                        <div><Label className="text-xs text-muted-foreground mb-1.5 block">Country</Label>
                          <Input placeholder="e.g. Nigeria, Ghana, Kenya, UK..." className="h-11 rounded-xl" />
                        </div>
                        <div><Label className="text-xs text-muted-foreground mb-1.5 block">State / Region</Label><Input placeholder="State or region" className="h-11 rounded-xl" /></div>
                        <div><Label className="text-xs text-muted-foreground mb-1.5 block">Street Address</Label><Input placeholder="House number, street name" className="h-11 rounded-xl" /></div>
                        <div><Label className="text-xs text-muted-foreground mb-1.5 block">Address Line 2 (optional)</Label><Input placeholder="Apartment, suite, landmark..." className="h-11 rounded-xl" /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label className="text-xs text-muted-foreground mb-1.5 block">City / Town</Label><Input placeholder="City or town" className="h-11 rounded-xl" /></div>
                          <div><Label className="text-xs text-muted-foreground mb-1.5 block">Postal Code</Label><Input placeholder="Postal code (if any)" className="h-11 rounded-xl" /></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PICKUP STATION — search & select */}
                {deliveryType === "pickup" && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Search and select a pickup station</p>

                    {/* Search input */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={pickupSearch}
                        onChange={(e) => setPickupSearch(e.target.value)}
                        placeholder='e.g. "Nigeria", "Lagos", "Abuja"...'
                        className="w-full h-11 rounded-xl border border-border bg-muted/40 pl-10 pr-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      {pickupSearch && (
                        <button onClick={() => setPickupSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Station list */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {filteredPickupStations.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">No stations found. Try a different search.</p>
                      )}
                      {filteredPickupStations.map((station) => (
                        <div
                          key={station.id}
                          onClick={() => setSelectedPickupId(station.id)}
                          className={cn(
                            "border-2 rounded-xl p-4 cursor-pointer transition-all",
                            selectedPickupId === station.id
                              ? "border-primary bg-primary/5 shadow-brand"
                              : "border-border bg-card hover:border-primary/40"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{station.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{station.address}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] font-semibold text-primary">{station.state}, {station.country}</span>
                                <span className="text-[10px] text-muted-foreground">{station.hours}</span>
                              </div>
                            </div>
                            <div className={cn(
                              "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                              selectedPickupId === station.id ? "border-primary bg-primary" : "border-muted-foreground"
                            )}>
                              {selectedPickupId === station.id && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Selected station — collection details card */}
                    {selectedPickup && (
                      <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <p className="text-sm font-bold text-primary">Your Collection Details</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Present your order confirmation at this station to collect your item(s).
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <Store className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="font-semibold">{selectedPickup.name}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-muted-foreground">{selectedPickup.address}</p>
                              {selectedPickup.landmark && (
                                <p className="text-xs text-primary/80 mt-0.5">{selectedPickup.landmark}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">{selectedPickup.hours}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <a href={`tel:${selectedPickup.phone}`} className="text-primary font-medium hover:underline">
                              {selectedPickup.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <Link href="/pickup-stations" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                      <Store className="h-3.5 w-3.5" /> Browse all pickup stations
                    </Link>
                  </div>
                )}

                <Button
                  className="w-full h-12 rounded-xl gradient-hero text-white font-bold mt-4 gap-2"
                  onClick={() => setStep(1)}
                  disabled={deliveryType === "pickup" && !selectedPickupId}
                  data-testid="button-continue-payment"
                >
                  Continue to Payment <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* STEP 2 — PAYMENT */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Payment Method</h2>

                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      className={cn(
                        "border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3",
                        paymentMethod === method.id ? "border-primary bg-primary/5 shadow-brand" : "border-border bg-card hover:border-primary/40"
                      )}
                      onClick={() => setPaymentMethod(method.id)}
                      data-testid={`payment-${method.id}`}
                    >
                      <method.icon className={cn("h-5 w-5 flex-shrink-0", paymentMethod === method.id ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm font-medium">{method.label}</span>
                    </div>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Card Number</Label>
                      <Input placeholder="1234  5678  9012  3456" className="h-11 rounded-xl font-mono tracking-widest" data-testid="input-card-number" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-xs text-muted-foreground mb-1.5 block">Expiry Date</Label><Input placeholder="MM / YY" className="h-11 rounded-xl font-mono" /></div>
                      <div><Label className="text-xs text-muted-foreground mb-1.5 block">CVV</Label><Input placeholder="•••" className="h-11 rounded-xl font-mono" /></div>
                    </div>
                    <div><Label className="text-xs text-muted-foreground mb-1.5 block">Cardholder Name</Label><Input placeholder="Name on card" className="h-11 rounded-xl" /></div>
                  </div>
                )}

                {paymentMethod === "mobile" && (
                  <div className="space-y-3">
                    {/* Provider dropdown */}
                    <div ref={mobileMoneyRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setMobileMoneyOpen(p => !p)}
                        className="w-full flex items-center gap-3 h-12 px-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors text-left"
                      >
                        <div className="flex-shrink-0 text-muted-foreground/50">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="3" y="3" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/>
                            <rect x="3" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="17" y="10" width="4" height="4" rx="1"/>
                            <rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1"/><rect x="17" y="17" width="4" height="4" rx="1"/>
                          </svg>
                        </div>
                        <ProviderLogo provider={currentProvider} size="md" />
                        <span className="flex-1 font-semibold text-sm">{currentProvider.label}</span>
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0", mobileMoneyOpen && "rotate-180")} />
                      </button>

                      {mobileMoneyOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-150 max-h-64 overflow-y-auto">
                          {MOBILE_MONEY.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => { setMobileMoney(m.id); setMobileMoneyOpen(false); }}
                              className={cn("w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-b border-border/40 last:border-0", mobileMoney === m.id && "bg-primary/5")}
                              data-testid={`mobile-money-${m.id}`}
                            >
                              <ProviderLogo provider={m} size="sm" />
                              <span className="text-sm font-medium flex-1 text-left">{m.label}</span>
                              {mobileMoney === m.id && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Account Number */}
                    <div className="flex items-center gap-3 h-12 px-4 bg-card border border-border rounded-xl">
                      <User className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
                      <input
                        type="tel"
                        placeholder="Account Number"
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      />
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-3 h-12 px-4 bg-card border border-border rounded-xl">
                      <svg className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/>
                      </svg>
                      <input
                        type="number"
                        placeholder="Amount"
                        defaultValue={total}
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    {/* Their Reference */}
                    <div className="flex items-center gap-3 h-12 px-4 bg-card border border-border rounded-xl">
                      <MessageSquare className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Their Reference"
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      />
                    </div>

                    {/* Pay button */}
                    <button
                      type="button"
                      className="w-full h-12 rounded-full gradient-hero text-white font-bold text-sm flex items-center justify-center gap-2 shadow-brand hover:opacity-90 transition-opacity mt-1"
                    >
                      <Send className="h-4 w-4" /> Pay
                    </button>
                  </div>
                )}

                {paymentMethod === "whatsapp" && (
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Pay via WhatsApp</p>
                        <p className="text-xs text-muted-foreground">You'll be redirected to WhatsApp with your order details</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Order total</span>
                        <span className="font-sans font-bold">{formatPrice(total)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">Once you click <strong>Review Order</strong>, your order summary will be sent to our WhatsApp number. Our team will confirm and process your payment.</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep(0)} data-testid="button-back-address">Back</Button>
                  <Button className="flex-1 h-12 rounded-xl gradient-hero text-white font-bold gap-2" onClick={() => setStep(2)} data-testid="button-review-order">
                    Review Order <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 — CONFIRM */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Review Your Order</h2>

                <div className="bg-card border border-border rounded-2xl p-5">
                  {deliveryType === "home" ? (
                    <>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Delivery Address</h3>
                      <div className="text-sm">
                        <p className="font-semibold">{SAVED_ADDRESSES[selectedAddress - 1].name}</p>
                        <p className="text-muted-foreground">{SAVED_ADDRESSES[selectedAddress - 1].line1}</p>
                        <p className="text-muted-foreground">{SAVED_ADDRESSES[selectedAddress - 1].city}, {SAVED_ADDRESSES[selectedAddress - 1].country}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"><Store className="h-4 w-4" /> Pickup Station</h3>
                      {selectedPickup && (
                        <div className="text-sm">
                          <p className="font-semibold">{selectedPickup.name}</p>
                          <p className="text-muted-foreground">{selectedPickup.address}</p>
                          <p className="text-muted-foreground">{selectedPickup.state}, {selectedPickup.country}</p>
                          <p className="text-muted-foreground mt-1">{selectedPickup.hours}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</h3>
                  <p className="text-sm font-semibold capitalize flex items-center gap-2">
                    {paymentMethod === "whatsapp" && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#25D366] flex-shrink-0">
                        <MessageCircle className="h-3 w-3 text-white" />
                      </span>
                    )}
                    {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
                  </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"><Package className="h-4 w-4" /> Order Items</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm" data-testid={`confirm-item-${item.id}`}>
                        <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                        <span className="font-sans font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="font-sans">{formatPrice(total)}</span>
                  </div>
                </div>

                {paymentMethod === "whatsapp" ? (
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "260966423719"}?text=${encodeURIComponent(`Hi Kryros! I'd like to place an order.\n\nOrder Total: ${formatPrice(total)}\nDelivery: ${SAVED_ADDRESSES[selectedAddress - 1].line1}, ${SAVED_ADDRESSES[selectedAddress - 1].city}\n\nPlease confirm my order and payment details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-14 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base gap-2 shadow-lg flex items-center justify-center transition-colors"
                    data-testid="button-place-order-whatsapp"
                  >
                    <MessageCircle className="h-5 w-5" /> Pay on WhatsApp — {formatPrice(total)}
                  </a>
                ) : (
                  <Button className="w-full h-14 rounded-xl gradient-hero text-white font-bold text-base gap-2 shadow-brand" data-testid="button-place-order">
                    <Lock className="h-5 w-5" /> Place Order — {formatPrice(total)}
                  </Button>
                )}

                <div className="flex items-center justify-center gap-6 pt-2">
                  {[
                    { icon: Shield, text: "Secure Payment" },
                    { icon: Lock, text: "256-bit SSL" },
                    { icon: RotateCcw, text: "30-day Returns" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-brand-teal" /> {text}
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="w-full text-sm text-muted-foreground" onClick={() => setStep(1)} data-testid="button-back-payment">
                  Back to Payment
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card-float sticky top-24">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground truncate flex-1 mr-2">{item.name} ×{item.quantity}</span>
                    <span className="font-sans flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-sans">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VAT (16%)</span><span className="font-sans">{formatPrice(vat)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-brand-teal font-semibold">FREE</span></div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="font-sans">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 font-medium">{children}</span>;
}

type MobileMoneyProvider = { id: string; label: string; logo: string; fallbackBg: string; fallbackText: string };

function ProviderLogo({ provider, size }: { provider: MobileMoneyProvider; size: "sm" | "md" }) {
  const [error, setError] = useState(false);
  const dim = size === "md" ? "h-9 w-9" : "h-8 w-8";
  const textSize = size === "md" ? "text-[10px]" : "text-[9px]";

  if (error) {
    return (
      <div className={cn("rounded-full flex items-center justify-center font-extrabold text-white flex-shrink-0", dim, textSize, provider.fallbackBg)}>
        {provider.fallbackText}
      </div>
    );
  }

  return (
    <img
      src={provider.logo}
      alt={provider.label}
      className={cn("rounded-full object-contain flex-shrink-0 bg-white", dim)}
      onError={() => setError(true)}
    />
  );
}
