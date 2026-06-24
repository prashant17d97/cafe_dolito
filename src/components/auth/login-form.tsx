"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validation/auth";
import { useAuthStore } from "@/store/auth.store";
import { AuthError } from "@/services/auth";
import { DEMO_CREDENTIALS } from "@/mocks/users";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/account";
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back.");
      router.push(redirect);
    } catch (err) {
      setPending(false);
      toast.error(err instanceof AuthError ? err.message : "Could not sign in. Please try again.");
    }
  }

  function fillDemo() {
    setForm({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
  }

  return (
    <Container className="flex flex-col items-center py-16 sm:py-24">
      <div className="w-full max-w-sm">
        <header className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Welcome back</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">Sign in</h1>
        </header>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <AuthField label="Email" name="email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
          <AuthField label="Password" name="password" type="password" autoComplete="current-password" value={form.password} error={errors.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
        </form>

        <button type="button" onClick={fillDemo} className="mt-4 w-full rounded-lg border border-dashed border-border bg-card/50 px-4 py-3 text-left text-xs text-muted-foreground transition-colors hover:border-brand/40">
          <span className="font-mono uppercase tracking-wider text-brand">Demo account</span> — tap to fill {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? <Link href="/register" className="text-brand hover:underline">Create an account</Link>
        </p>
      </div>
    </Container>
  );
}

export function AuthField({
  label, name, value, onChange, error, type = "text", autoComplete,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; autoComplete?: string;
}) {
  return (
    <div className={cn("space-y-1.5")}>
      <label htmlFor={name} className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <Input id={name} name={name} type={type} value={value} autoComplete={autoComplete} inputMode={type === "email" ? "email" : type === "tel" ? "tel" : undefined} aria-invalid={!!error} onChange={(e) => onChange(e.target.value)} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
