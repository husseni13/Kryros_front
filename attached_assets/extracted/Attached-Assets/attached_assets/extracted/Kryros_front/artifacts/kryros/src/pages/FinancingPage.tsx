import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, ShieldCheck, Zap, Globe, Clock, Shield } from "lucide-react";

export default function FinancingPage() {
  const [price, setPrice] = useState("699");
  const [tenure, setTenure] = useState("3mo");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const numPrice = parseFloat(price) || 0;
  const numMonths = parseInt(tenure.replace("mo", ""));
  const interestRate = tenure === "3mo" ? 0 : tenure === "6mo" ? 0.05 : tenure === "12mo" ? 0.1 : 0.15;
  const interestAmount = numPrice * interestRate;
  const totalAmount = numPrice + interestAmount;
  const monthlyPayment = totalAmount / numMonths;

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Hero */}
      <section className="gradient-gold py-20 px-4 md:px-8 text-white relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto relative z-10 text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-brand-navy drop-shadow-md">
            Own It Today.<br />Pay Tomorrow.
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto text-brand-navy/80">
            Zero-interest plans up to $5,500 across 20+ countries.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Apply in 2 Minutes", desc: "Fill out a quick form with basic details. No paperwork needed." },
            { step: "2", title: "Instant Approval", desc: "Get approved instantly using our AI-driven credit assessment." },
            { step: "3", title: "Shop Freely", desc: "Use your credit limit to buy any product on Kryros." }
          ].map((item) => (
            <div key={item.step} className="bg-card border border-border p-8 rounded-3xl text-center relative overflow-hidden group hover:border-brand-gold transition-colors">
              <div className="text-6xl font-bold text-muted/30 absolute -top-4 -right-4 transition-transform group-hover:scale-110">{item.step}</div>
              <h3 className="text-xl font-bold mb-3 relative z-10">{item.title}</h3>
              <p className="text-muted-foreground relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Financing Plans */}
      <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto w-full bg-muted/20 border-y border-border">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-card border border-border p-8 rounded-3xl flex flex-col">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <div className="text-3xl font-bold mb-6">up to $200</div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> 0% interest</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> 3 months tenure</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Basic ID required</li>
            </ul>
            <Button variant="outline" className="w-full rounded-full h-12">Apply for Starter</Button>
          </div>
          
          {/* Standard */}
          <div className="bg-card border-2 border-brand-gold p-8 rounded-3xl flex flex-col relative transform md:-translate-y-4 shadow-gold">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-gold text-brand-navy font-bold text-xs px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2">Standard</h3>
            <div className="text-3xl font-bold mb-6 text-brand-gold">up to $1,000</div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-brand-gold" /> 4.5% p.a. interest</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-brand-gold" /> Up to 12 months</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-brand-gold" /> Income verification</li>
            </ul>
            <Button className="w-full rounded-full h-12 gradient-gold text-brand-navy font-bold">Apply for Standard</Button>
          </div>

          {/* Premium */}
          <div className="bg-card border border-border p-8 rounded-3xl flex flex-col">
            <h3 className="text-xl font-bold mb-2">Premium</h3>
            <div className="text-3xl font-bold mb-6">up to $5,500</div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-brand-violet" /> 3.5% p.a. interest</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-brand-violet" /> Up to 36 months</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-brand-violet" /> Full credit check</li>
            </ul>
            <Button variant="outline" className="w-full rounded-full h-12">Apply for Premium</Button>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 px-4 md:px-8 max-w-screen-md mx-auto w-full">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">BNPL Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product Price (USD)</label>
              <Input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                className="h-14 text-lg font-sans"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tenure</label>
              <div className="flex gap-2">
                {["3mo", "6mo", "12mo", "24mo"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTenure(t)}
                    className={`flex-1 py-3 rounded-xl border transition-all font-medium ${
                      tenure === t 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Payment:</span>
                <span className="text-2xl font-bold font-sans text-primary">${monthlyPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-sans font-bold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Interest:</span>
                <span className="font-sans font-bold text-destructive">${interestAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility & FAQ */}
      <section className="py-16 px-4 md:px-8 max-w-screen-xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">Eligibility Requirements</h2>
          <ul className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Valid National ID or Passport" },
              { icon: Globe, text: "Resident of a supported country or valid Work Permit" },
              { icon: Zap, text: "18 years or older" },
              { icon: CheckCircle2, text: "Active mobile money or bank account" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl">
                <item.icon className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How fast is approval?</AccordionTrigger>
              <AccordionContent>For Starter plans, approval is instant. For Standard and Premium, it typically takes under 2 hours during business days.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Are there hidden fees?</AccordionTrigger>
              <AccordionContent>No. We believe in absolute transparency. The total amount shown in the calculator is exactly what you pay.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can I pay off early?</AccordionTrigger>
              <AccordionContent>Yes, you can settle your balance at any time without any early repayment penalties.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What happens if I miss a payment?</AccordionTrigger>
              <AccordionContent>A late fee of 5% applies to the missed installment. Please contact support if you foresee difficulties.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-t border-border bg-muted/20">
        <div className="max-w-screen-2xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
          <div className="flex items-center gap-2"><Shield className="h-5 w-5" /><span className="font-medium text-sm">256-bit Encryption</span></div>
          <div className="flex items-center gap-2"><Zap className="h-5 w-5" /><span className="font-medium text-sm">Instant Approval</span></div>
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /><span className="font-medium text-sm">FCA Regulated</span></div>
          <div className="flex items-center gap-2"><Globe className="h-5 w-5" /><span className="font-medium text-sm">20+ Countries</span></div>
          <div className="flex items-center gap-2"><Clock className="h-5 w-5" /><span className="font-medium text-sm">24/7 Support</span></div>
        </div>
      </section>
      <BottomNav />
    </div>
  );
}
