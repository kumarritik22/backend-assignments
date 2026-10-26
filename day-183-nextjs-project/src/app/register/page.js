import Link from "next/link";
import {
  ArrowRight,
  Check,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] bg-background lg:grid-cols-2">
      {/* Premium Brand Panel */}
      <section className="relative hidden min-h-180 overflow-hidden bg-linear-to-br from-violet-600 via-fuchsia-600 to-orange-400 p-12 text-white dark:from-violet-950 dark:via-purple-950 dark:to-zinc-950 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute -right-10 top-40 h-64 w-64 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-20 top-1/3 h-3 w-3 rounded-full bg-orange-200 shadow-[0_0_40px_12px_rgba(255,255,255,0.25)]" />

        <Link href="/" className="relative z-10 flex w-fit items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-md">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <span className="text-2xl font-bold tracking-tight">Winden.</span>
        </Link>

        <div className="relative z-10 max-w-lg py-12">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            SOMETHING GOOD STARTS HERE
          </div>

          <h1 className="text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
            Find your
            <br />
            next favourite.
            <br />
            <span className="text-orange-200 dark:text-fuchsia-300">
              Make it yours.
            </span>
          </h1>

          <p className="mt-6 max-w-sm text-base leading-7 text-white/80">
            Create your account and discover products that bring a little
            more joy to your everyday.
          </p>

          <div className="mt-12 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <div className="mb-3 flex items-center gap-1 text-orange-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm leading-6 text-white/90">
              Your personal space for discovering great finds, keeping
              favourites close, and making shopping feel effortless.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
              <Check className="h-4 w-4" />
              A fresh start to better shopping
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-white/60">
          <span>© {new Date().getFullYear()} Winden</span>
          <span>Thoughtfully curated. Made for you.</span>
        </div>
      </section>

      {/* Register Form */}
      <section className="relative flex items-center justify-center overflow-hidden bg-linear-to-br from-orange-50/70 via-background to-violet-50/70 px-5 py-12 dark:from-zinc-950 dark:via-background dark:to-violet-950/20 sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-xl font-bold tracking-tight lg:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-500 text-white">
              <ShoppingBag className="h-5 w-5" />
            </span>
            Winden.
          </Link>

          <div className="mb-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600/15 to-fuchsia-500/15 text-violet-600 ring-1 ring-violet-500/15 dark:text-violet-300">
              <Sparkles className="h-6 w-6" />
            </div>

            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-violet-600 dark:text-violet-300">
              JOIN WINDEN
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Let's make it yours.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Create your account and find something you'll love.
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                required
                className="h-12 rounded-xl border-border/80 bg-background/80 px-4 shadow-sm transition-shadow focus-visible:ring-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="h-12 rounded-xl border-border/80 bg-background/80 px-4 shadow-sm transition-shadow focus-visible:ring-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
                className="h-12 rounded-xl border-border/80 bg-background/80 px-4 shadow-sm transition-shadow focus-visible:ring-violet-500"
              />
              <p className="text-xs text-muted-foreground">
                Use at least 8 characters for your password.
              </p>
            </div>

            <Button
              type="submit"
              className="group h-12 w-full rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-500 font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 hover:shadow-violet-500/30 dark:from-violet-500 dark:to-fuchsia-500"
            >
              Create account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs font-medium tracking-wider text-muted-foreground">
              ALREADY A MEMBER?
            </span>
            <Separator className="flex-1" />
          </div>

          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-xl border-violet-500/20 bg-background/50 transition-colors hover:border-violet-500/50 hover:bg-violet-500/5"
          >
            <Link href="/login">Sign in to your account</Link>
          </Button>

          <p className="mt-7 text-center text-xs leading-6 text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </section>
    </main>
  );
}