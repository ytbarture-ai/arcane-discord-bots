import { Bot, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Generate() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className="hero-glow opacity-50" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
          <div className="bg-card border border-white/10 w-24 h-24 rounded-3xl flex items-center justify-center relative shadow-2xl">
            <Bot className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-4">Sign in to <span className="font-serif italic text-primary">generate</span></h1>
        <p className="text-muted-foreground mb-10">
          Connect your Discord account to start generating servers instantly with AI.
        </p>

        <Button 
          className="w-full h-14 text-lg rounded-2xl bg-[hsl(var(--discord))] hover:bg-[hsl(var(--discord))/0.9] text-white shadow-xl shadow-[hsl(var(--discord))]/20 transition-all hover:-translate-y-1"
        >
          <LogIn className="w-5 h-5 mr-3" />
          Sign in with Discord
        </Button>
        
        <p className="mt-8 text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
