import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Bot, ChevronDown, Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrent = (path: string) => location === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <nav className="glass-nav rounded-full px-4 py-2.5 flex items-center justify-between w-full max-w-5xl pointer-events-auto shadow-2xl shadow-black/50">
        
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/20 p-1.5 rounded-lg group-hover:bg-primary/30 transition-colors">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">AiGuild</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            <Link href="/generate" className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", isCurrent('/generate') ? "bg-white/10 text-white" : "text-primary hover:bg-white/5")}>
              Generate
            </Link>
            <Link href="/documentation" className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", isCurrent('/documentation') ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white hover:bg-white/5")}>
              Documentation
            </Link>
            <Link href="/pricing" className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", isCurrent('/pricing') ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white hover:bg-white/5")}>
              Pricing
            </Link>
            <a href="#" className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
              Status
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white px-2 py-2 transition-colors">
            <Globe className="w-4 h-4" />
            <span>EN</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <Button asChild className="rounded-full px-6 font-semibold" variant="default">
            <Link href="/generate">Get Started &rarr;</Link>
          </Button>
        </div>

        <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile menu (simple implementation) */}
      {mobileMenuOpen && (
        <div className="absolute top-24 left-4 right-4 bg-background border border-white/10 rounded-2xl p-4 flex flex-col gap-2 pointer-events-auto md:hidden shadow-xl">
          <Link href="/generate" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-primary font-medium hover:bg-white/5">Generate</Link>
          <Link href="/documentation" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-white font-medium hover:bg-white/5">Documentation</Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-white font-medium hover:bg-white/5">Pricing</Link>
          <Button asChild className="rounded-full mt-2 w-full">
            <Link href="/generate">Get Started</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
