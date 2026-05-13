import { useState, useEffect, useRef } from "react";
import { Globe, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "AR", label: "العربية" },
  { code: "FR", label: "Français" },
  { code: "PT", label: "Português" },
  { code: "SW", label: "Kiswahili" },
];

const WHATSAPP_NUMBER = "18000000123";

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setShowScrollTop(window.scrollY > 120);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const btnBase =
    "h-11 w-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95 select-none cursor-pointer";

  const orangeBtn =
    "bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_44%)] text-white font-bold shadow-[0_4px_20px_rgba(245,158,11,0.45)] border border-[hsl(38_92%_60%)/30]";

  return (
    <div ref={containerRef} className="fixed top-1/2 -translate-y-1/2 right-3 z-40 flex flex-col items-center gap-2.5">

      {/* Language picker popup — anchored below the language button */}
      {langOpen && (
        <div className="absolute top-full mt-2 right-0 w-40 rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-[hsl(180_40%_7%)] animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Language</span>
            <button
              onClick={() => setLangOpen(false)}
              className="h-5 w-5 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Language options */}
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang); setLangOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-white/10",
                language.code === lang.code
                  ? "text-[hsl(38_92%_60%)] bg-white/5"
                  : "text-white/75"
              )}
            >
              <Globe className="h-3.5 w-3.5 flex-shrink-0 opacity-50" />
              <span className="flex-1 text-left">{lang.label}</span>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                language.code === lang.code
                  ? "bg-[hsl(38_92%_50%)] text-white"
                  : "opacity-40 text-white"
              )}>{lang.code}</span>
            </button>
          ))}
        </div>
      )}

      {/* Language button — always visible */}
      <button
        onClick={() => setLangOpen((o) => !o)}
        className={cn(btnBase, orangeBtn, "text-[13px] tracking-wide")}
        title="Change Language"
      >
        {language.code}
      </button>

      {/* WhatsApp button — always visible, keeps WhatsApp green */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          btnBase,
          "bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)]"
        )}
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Scroll-to-top — orange, only visible when scrolled down */}
      <button
        onClick={scrollToTop}
        className={cn(
          btnBase,
          orangeBtn,
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ transition: "opacity 0.25s ease, transform 0.25s ease" }}
        title="Back to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
}
