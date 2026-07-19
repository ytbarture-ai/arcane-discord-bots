import { AppLayout } from "@/components/layout/app-layout";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for testing and small personal servers.",
      features: [
        "Up to 3 server generations",
        "Basic channel layouts",
        "Standard roles",
        "Community support"
      ],
      buttonText: "Start for free",
      popular: false
    },
    {
      name: "Pro",
      price: "$9",
      period: "/month",
      description: "For active community managers and content creators.",
      features: [
        "Unlimited generations",
        "Advanced permission mapping",
        "Custom role colors & icons",
        "Priority queue",
        "Email support"
      ],
      buttonText: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "/month",
      description: "For large scale DAOs, brands, and networks.",
      features: [
        "Everything in Pro",
        "Multiple bot instances",
        "Custom branding",
        "Webhooks API access",
        "24/7 dedicated support"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <AppLayout>
      <div className="pt-24 pb-32 px-6 relative">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Simple, <span className="font-serif italic text-primary">transparent</span> pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your community needs. No hidden fees.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative bg-card border rounded-3xl p-8 flex flex-col h-full ${
                plan.popular 
                  ? "border-primary shadow-2xl shadow-primary/20 md:-translate-y-4" 
                  : "border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm h-10">{plan.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.popular ? "default" : "outline"} 
                className={`w-full h-12 rounded-xl text-base ${
                  !plan.popular ? "bg-white/5 border-white/10 hover:bg-white/10" : ""
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
