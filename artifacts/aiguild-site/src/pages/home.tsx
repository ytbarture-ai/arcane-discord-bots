import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  Terminal, 
  MessageSquare, 
  ShieldCheck, 
  Gamepad2, 
  GraduationCap,
  Users,
  Palette,
  Briefcase,
  Star,
  Zap,
  LayoutTemplate,
  Bot
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}

function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const fullText = "I want a gaming community server with ranked roles, a VIP lounge, and strict moderation channels.";
  const [typingIndex, setTypedIndex] = useState(0);

  useEffect(() => {
    if (typingIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + fullText[typingIndex]);
        setTypedIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [typingIndex, fullText]);

  const pills = [
    { icon: Gamepad2, label: "Gaming", active: true },
    { icon: Users, label: "Roleplay", active: false },
    { icon: GraduationCap, label: "School", active: false },
    { icon: MessageSquare, label: "Friends", active: false },
    { icon: Palette, label: "Creative", active: false },
    { icon: Briefcase, label: "Business", active: false },
  ];

  return (
    <section className="relative pt-24 pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        <div className="flex items-center gap-1 mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>AiGuild Version 2.0 is now live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          Generate your Discord <br className="hidden md:block" />
          <span className="font-serif italic font-normal text-gradient">server with</span>{" "}
          <span className="text-primary">AiGuild</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
          Skip the tedious manual setup. Our AI generates complete categories, channels, roles, and precise permissions in seconds from a simple prompt.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <Button size="lg" className="rounded-full px-8 text-base h-14 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/generate">
              <Sparkles className="mr-2 w-5 h-5" />
              Generate Server
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-14 bg-white/5 border-white/10 hover:bg-white/10" asChild>
            <a href="#">
              + Add AiGuild to Discord
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-16">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=transparent`} alt="avatar" />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start ml-2">
            <div className="flex gap-0.5 text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs text-muted-foreground">4.8/5 · 200+ reviews</span>
          </div>
        </div>

        {/* Demo Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-3xl bg-card border border-white/10 rounded-2xl p-2 shadow-2xl relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 blur opacity-30 rounded-2xl"></div>
          
          <div className="bg-background rounded-xl p-6 relative z-10 text-left border border-white/5">
            <div className="flex flex-wrap gap-2 mb-6">
              {pills.map((pill, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                    pill.active 
                      ? "bg-primary/20 text-primary border-primary/30" 
                      : "bg-white/5 text-muted-foreground border-white/5"
                  )}
                >
                  <pill.icon className="w-4 h-4" />
                  {pill.label}
                </div>
              ))}
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <Terminal className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-h-[60px]">
                <p className="text-lg text-white font-mono leading-relaxed">
                  {typedText}
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-5 bg-primary ml-1 align-middle"
                  />
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30" onClick={() => {
                setTypedText("");
                setTypedIndex(0);
              }}>
                <Zap className="w-4 h-4 mr-1.5" />
                Generate
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function TrustedBySection() {
  return (
    <section className="py-12 border-y border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <h3 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">THEY TRUST US</h3>
      </div>
      
      <div className="flex whitespace-nowrap relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex items-center gap-16 md:gap-32 px-8"
        >
          {/* Double the logos to make it loop smoothly */}
          {[1, 2].map((group) => (
            <div key={group} className="flex items-center gap-16 md:gap-32">
              <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <Bot className="w-8 h-8" />
                <span className="text-2xl font-bold font-serif italic">Discord</span>
              </div>
              <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <Sparkles className="w-8 h-8" />
                <span className="text-2xl font-bold">Quasar</span>
              </div>
              <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <ShieldCheck className="w-8 h-8" />
                <span className="text-2xl font-bold font-serif italic">YorkHost</span>
              </div>
              <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <LayoutTemplate className="w-8 h-8" />
                <span className="text-2xl font-bold">DiscordI</span>
              </div>
              <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <Zap className="w-8 h-8" />
                <span className="text-2xl font-bold font-serif italic">Nexus</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Intelligent Categories",
      description: "Our AI understands community structures and groups channels logically into intuitive categories.",
      icon: LayoutTemplate,
    },
    {
      title: "Granular Permissions",
      description: "Roles and permissions are automatically configured so your moderators and members have the right access instantly.",
      icon: ShieldCheck,
    },
    {
      title: "Instant Setup",
      description: "What used to take hours of clicking and configuring now takes seconds. Just describe it, and it's done.",
      icon: Zap,
    }
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for <span className="font-serif italic text-primary">perfectionists</span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AiGuild doesn't just create empty rooms. It builds functional, secure, and ready-to-launch communities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card/50 border border-white/5 rounded-3xl p-8 hover:bg-card hover:border-white/10 transition-all group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Invite the Bot", desc: "Add AiGuild to your server with one click. It requires standard management permissions to build your layout." },
    { num: "02", title: "Describe your vibe", desc: "Use the /generate command and describe what kind of community you want in natural language." },
    { num: "03", title: "Watch it build", desc: "Sit back for 5 seconds as the AI constructs categories, channels, and roles right before your eyes." }
  ];

  return (
    <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How it <span className="font-serif italic text-primary">works</span></h2>
            <p className="text-lg text-muted-foreground mb-12">
              Three simple steps to a professional Discord server. No coding, no templates, just pure AI generation.
            </p>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 relative">
                  {i !== steps.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-[-2rem] w-px bg-white/10" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl opacity-50" />
            <div className="bg-card border border-white/10 rounded-2xl p-6 relative shadow-2xl">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 text-xs font-mono text-muted-foreground"># discord-server</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-white/5 rounded-xl rounded-tl-none p-4 text-sm border border-white/5">
                    Generating your "Cyberpunk RPG" server...<br/><br/>
                    ✅ Creating category: 🌆 NIGHT CITY<br/>
                    ✅ Creating channel: #announcements<br/>
                    ✅ Creating channel: #general-chat<br/>
                    ✅ Creating roles: @Netrunner, @Corpo<br/>
                    <br/>
                    ✨ Setup complete!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const reviews = [
    { name: "Alex K.", role: "Community Manager", text: "I used to spend 4 hours setting up permissions for new clan servers. AiGuild did it in 10 seconds perfectly." },
    { name: "Sarah M.", role: "Streamer", text: "The categories it came up with for my streaming community were better than what I had planned." },
    { name: "David T.", role: "Web3 Founder", text: "Security is everything for us. The way AiGuild structured our read-only and verified roles was flawless." },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Loved by <span className="font-serif italic text-primary">thousands</span></h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-card border border-white/10 rounded-2xl p-6 relative">
              <div className="flex gap-1 text-primary mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-white mb-6 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary border border-white/10 flex items-center justify-center overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.name}&backgroundColor=transparent`} alt="avatar" />
                </div>
                <div>
                  <div className="font-bold text-sm">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to <span className="font-serif italic text-primary">upgrade?</span></h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of server owners who build better communities faster with AiGuild.
        </p>
        <Button size="lg" className="rounded-full px-10 text-lg h-16 bg-white text-black hover:bg-white/90" asChild>
          <Link href="/pricing">View Pricing Plans &rarr;</Link>
        </Button>
      </div>
    </section>
  );
}
