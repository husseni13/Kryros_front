import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating CSS particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-white/20 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-brand-teal/10 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <div className="text-[10rem] font-bold leading-none text-gradient-brand select-none mb-4">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Lost in the cosmos
        </h1>
        <p className="text-lg text-white/70 mb-10">
          The page you're looking for has drifted into deep space.
        </p>
        <Link href="/">
          <Button
            size="lg"
            className="h-14 px-10 rounded-full gradient-hero border border-white/20 text-white font-semibold text-base shadow-brand"
            data-testid="button-home"
          >
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
