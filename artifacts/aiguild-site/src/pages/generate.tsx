import { Bot, LogOut, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface User {
  id: string;
  username: string;
  avatar: string | null;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Generate() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  function handleLogin() {
    window.location.href = `${BASE}/api/auth/discord`;
  }

  async function handleLogout() {
    await fetch(`${BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className="hero-glow opacity-50" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {loading ? (
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : user ? (
          /* Logged in state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="mb-6 flex flex-col items-center gap-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-20 h-20 rounded-full border-2 border-primary/40 shadow-xl" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/40">
                  <Bot className="w-10 h-10 text-primary" />
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Connecté en tant que</p>
                <p className="text-xl font-bold text-white">{user.username}</p>
              </div>
            </div>

            <div className="bg-card border border-white/10 rounded-2xl p-6 mb-6 text-left">
              <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Génère ton serveur
              </h2>
              <p className="text-sm text-muted-foreground">
                Utilise la commande <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary font-mono">/setup</code> directement dans Discord sur ton serveur pour lancer la génération IA.
              </p>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full h-12 rounded-2xl border-white/10 text-muted-foreground hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </motion.div>
        ) : (
          /* Logged out state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
              <div className="bg-card border border-white/10 w-24 h-24 rounded-3xl flex items-center justify-center relative shadow-2xl">
                <Bot className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Sign in to <span className="font-serif italic text-primary">generate</span>
            </h1>
            <p className="text-muted-foreground mb-10">
              Connecte ton compte Discord pour générer des serveurs instantanément avec l'IA.
            </p>

            <Button
              onClick={handleLogin}
              className="w-full h-14 text-lg rounded-2xl bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-xl shadow-[#5865F2]/30 transition-all hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.004.048.026.093.061.12a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Sign in with Discord
            </Button>

            <p className="mt-8 text-sm text-muted-foreground">
              En vous connectant, vous acceptez nos CGU et Politique de Confidentialité.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
