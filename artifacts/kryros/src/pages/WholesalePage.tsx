import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, CheckCircle2, Package, TrendingDown, ShieldCheck } from "lucide-react";

const PERKS = [
  { icon: TrendingDown, title: "Bulk Discounts", desc: "Up to 40% off on orders over 50 units" },
  { icon: Package, title: "Dedicated Stock", desc: "Priority access to new inventory" },
  { icon: ShieldCheck, title: "Business Credit", desc: "Flexible payment terms for registered businesses" },
  { icon: Users, title: "Account Manager", desc: "A dedicated rep just for your business" },
];

export default function WholesalePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ business: "", email: "", phone: "", city: "" });

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-screen-md mx-auto w-full px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Wholesale & Business</h1>
          <p className="text-muted-foreground text-sm mt-1">Buy in bulk at the best prices. Perfect for shops, resellers & corporates.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {PERKS.map((perk) => (
            <div key={perk.title} className="bg-card border border-border rounded-2xl p-4">
              <perk.icon className="h-6 w-6 text-primary mb-2" />
              <p className="font-semibold text-sm">{perk.title}</p>
              <p className="text-muted-foreground text-xs mt-1">{perk.desc}</p>
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="text-center py-12">
            <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground text-sm">Our wholesale team will contact you within 24 hours.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-lg">Apply for Wholesale Account</h2>
            <div className="space-y-3">
              <Input placeholder="Business Name" value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} className="h-11 rounded-xl" />
              <Input placeholder="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="h-11 rounded-xl" />
              <Input placeholder="Phone Number" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="h-11 rounded-xl" />
              <Input placeholder="City / Town" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="h-11 rounded-xl" />
            </div>
            <Button
              className="w-full h-12 rounded-xl font-bold"
              onClick={() => setSubmitted(true)}
              disabled={!form.business || !form.email}
            >
              Submit Application
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
