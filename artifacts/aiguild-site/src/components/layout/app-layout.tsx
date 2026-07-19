import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <div className="hero-glow" />
      <Navbar />
      <main className="flex-1 w-full pt-24 pb-0 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
