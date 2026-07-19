import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex w-full flex-1 items-center justify-center pt-20">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <AlertCircle className="mb-4 h-16 w-16 text-primary" />
          <h1 className="mb-2 text-4xl font-bold tracking-tight">404</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
