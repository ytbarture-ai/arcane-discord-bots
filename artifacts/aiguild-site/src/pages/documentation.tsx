import { AppLayout } from "@/components/layout/app-layout";
import { Command, HelpCircle, User, Settings, Link as LinkIcon, Network, MessageSquarePlus, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function Documentation() {
  const commands = [
    { id: "setup", icon: Command, label: "/setup" },
    { id: "help", icon: HelpCircle, label: "/help" },
    { id: "credits", icon: User, label: "/credits" },
    { id: "config", icon: Settings, label: "/config" },
    { id: "invites", icon: LinkIcon, label: "/invites" },
    { id: "invites-tree", icon: Network, label: "/invites-tree" },
    { id: "setup-bienvenue", icon: MessageSquarePlus, label: "/setup-bienvenue" },
    { id: "setup-statsvoc", icon: BarChart3, label: "/setup-statsvoc" },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-32">
            <h3 className="font-semibold text-sm tracking-widest text-muted-foreground uppercase mb-6">Commands</h3>
            <div className="flex flex-col gap-2">
              {commands.map((cmd) => (
                <a 
                  key={cmd.id}
                  href={`#${cmd.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                >
                  <cmd.icon className="w-4 h-4" />
                  {cmd.label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              AiGuild <span className="font-serif italic text-primary">Documentation</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AiGuild Bot is an AI-powered Discord assistant that generates and manages complete servers. 
              Invite the bot, use slash commands, and let the AI structure your community.
            </p>
          </div>

          <div className="space-y-16">
            <div id="setup" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Command className="w-4 h-4" />
                </div>
                /setup
              </h2>
              <div className="bg-card border border-white/10 rounded-2xl p-6">
                <p className="text-muted-foreground mb-4">
                  The core generation command. Use this to describe your desired server layout and let AiGuild build it.
                </p>
                <div className="bg-background rounded-lg p-4 font-mono text-sm border border-white/5 mb-4">
                  /setup prompt:"A gaming community for Valorant with rank roles"
                </div>
                <h4 className="font-semibold mb-2">Options</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">prompt</code> (required) - Description of your server</li>
                  <li><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">theme</code> (optional) - specific color theme or vibe</li>
                </ul>
              </div>
            </div>

            <div id="help" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                /help
              </h2>
              <div className="bg-card border border-white/10 rounded-2xl p-6">
                <p className="text-muted-foreground">
                  Displays a help menu with all available commands, support links, and basic troubleshooting information.
                </p>
              </div>
            </div>
            
            {/* Omitted other commands for brevity, just a couple more as examples */}
            <div id="config" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                /config
              </h2>
              <div className="bg-card border border-white/10 rounded-2xl p-6">
                <p className="text-muted-foreground">
                  Opens the interactive configuration panel to customize bot behavior, default roles, and module toggles for your specific server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
