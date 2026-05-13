import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [, navigate] = useLocation();
  const { usePost } = useApi();
  const { toast } = useToast();

  const loginMutation = usePost("/auth/login", {
    onSuccess: (data: any) => {
      localStorage.setItem("token", data.token);
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Login failed", description: err.message });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ 
      email: tab === "email" ? email : undefined,
      phone: tab === "phone" ? phone : undefined,
      password 
    });
  };

  const inputClass =
    "w-full h-12 rounded-full border border-border bg-background text-foreground text-sm px-6 placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Card — matches newsletter card exactly */}
        <div className="rounded-3xl border border-border bg-card shadow-lg px-6 py-8">

          {/* Icon + Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background mb-4">
              <Mail className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
            <Link href="/">
              <span className="block text-2xl font-black tracking-tight text-foreground cursor-pointer">
                <span className="text-primary">K</span>RYROS
              </span>
            </Link>
            <p className="mt-1 text-muted-foreground text-sm">Welcome back — sign in to continue</p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-muted rounded-full p-1 mb-5">
            {(["email", "phone"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all capitalize ${
                  tab === t
                    ? "gradient-hero text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "email" ? "Email" : "Phone"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {tab === "email" ? (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                  Phone Number
                </label>
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
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                  Password
                </label>
                <Link href="#" className="text-[10px] text-primary hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 mt-5 rounded-full gradient-hero text-white text-sm font-bold tracking-widest transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loginMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> LOGGING IN...</> : "LOGIN"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => navigate("/dashboard")} className="flex items-center justify-center gap-2 h-10 rounded-full border border-border bg-background text-foreground hover:bg-muted text-xs font-semibold transition-all">
              <SiGoogle className="h-3.5 w-3.5" /> Google
            </button>
            <button onClick={() => navigate("/dashboard")} className="flex items-center justify-center gap-2 h-10 rounded-full border border-border bg-background text-foreground hover:bg-muted text-xs font-semibold transition-all">
              <SiApple className="h-3.5 w-3.5" /> Apple
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-bold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
