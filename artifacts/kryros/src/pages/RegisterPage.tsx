import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, CheckCircle2, UserPlus, Loader2 } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, navigate] = useLocation();
  const { usePost } = useApi();
  const { toast } = useToast();

  const registerMutation = usePost("/auth/register", {
    onSuccess: (data: any) => {
      localStorage.setItem("token", data.token);
      toast({ title: "Account created!", description: "Welcome to Kryros." });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Registration failed", description: err.message });
    }
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ variant: "destructive", title: "Wait!", description: "You must agree to the Terms of Service." });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords don't match", description: "Please ensure your passwords are identical." });
      return;
    }
    registerMutation.mutate({ 
      firstName, 
      lastName, 
      email: email || undefined, 
      phone: phone || undefined, 
      password 
    });
  };

  const inputClass =
    "w-full h-12 rounded-full border border-border bg-background text-foreground text-sm px-6 placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  const label = (text: string) => (
    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">{text}</span>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Card — matches newsletter card exactly */}
        <div className="rounded-3xl border border-border bg-card shadow-lg px-6 py-8">

          {/* Icon + Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background mb-4">
              <UserPlus className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
            <Link href="/">
              <span className="block text-2xl font-black tracking-tight text-foreground cursor-pointer">
                <span className="text-primary">K</span>RYROS
              </span>
            </Link>
            <p className="mt-1 text-muted-foreground text-sm">Create your account and start shopping</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1.5">
                {label("First Name")}
                <input 
                  type="text" 
                  placeholder="John" 
                  className={inputClass}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                {label("Last Name")}
                <input 
                  type="text" 
                  placeholder="Doe" 
                  className={inputClass}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              {label("Email (Optional)")}
              <input 
                type="email" 
                placeholder="your@email.com" 
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              {label("Phone Number (Optional)")}
              <div className="flex gap-2">
                <div className="flex h-12 items-center px-4 rounded-full border border-border bg-background text-foreground text-sm font-medium whitespace-nowrap">
                  🌍 +
                </div>
                <input 
                  type="tel" 
                  placeholder="Phone number" 
                  className={`${inputClass} flex-1`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              {label("Password")}
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={`${inputClass} pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              {label("Confirm Password")}
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={`${inputClass} pr-12`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
              <div
                onClick={() => setAgreed(a => !a)}
                className={`mt-0.5 h-4 w-4 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
                  agreed ? "bg-primary border-primary" : "border-border bg-background"
                }`}
              >
                {agreed && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <span className="text-muted-foreground text-[11px] leading-relaxed">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline font-semibold">Terms of Service</Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline font-semibold">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-12 mt-5 rounded-full gradient-hero text-white text-sm font-bold tracking-widest transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {registerMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> CREATING...</> : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">or sign up with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-2.5">
            <button className="flex items-center justify-center gap-2 h-10 rounded-full border border-border bg-background text-foreground hover:bg-muted text-xs font-semibold transition-all">
              <SiGoogle className="h-3.5 w-3.5" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 h-10 rounded-full border border-border bg-background text-foreground hover:bg-muted text-xs font-semibold transition-all">
              <SiApple className="h-3.5 w-3.5" /> Apple
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-5 p-4 rounded-2xl bg-muted border border-border space-y-2">
            {[
              "Instant BNPL up to $5,500",
              "50,000+ products across 20+ countries",
              "Zero-interest financing options",
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
