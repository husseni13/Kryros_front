import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Smartphones", "Gadgets", "Accessories", "Fashion", "Software", "Electronics"];

export function CategoryPill({ active = "All", onSelect }: { active?: string, onSelect?: (c: string) => void }) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-1">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={active === category ? "default" : "outline"}
            className={cn(
              "rounded-full px-6",
              active === category ? "gradient-hero text-white border-0 shadow-brand" : "bg-background"
            )}
            onClick={() => onSelect?.(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  );
}
