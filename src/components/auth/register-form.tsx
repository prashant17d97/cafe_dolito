"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { registerSchema } from "@/lib/validation/auth";
import { useAuthStore } from "@/store/auth.store";
import { AuthError } from "@/services/auth";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { AuthField } from "./login-form";

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  function set(key: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const { firstName, lastName, email, password } = parsed.data;
      await register({ firstName, lastName, email, password });
      toast.success("Account created — welcome to the table.");
      router.push("/account");
    } catch (err) {
      setPending(false);
      toast.error(err instanceof AuthError ? err.message : "Could not create your account. Please try again.");
    }
  }

  return (
    <Container className="flex flex-col items-center py-16 sm:py-24">
      <div className="w-full max-w-sm">
        <header className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Join us</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">Create an account</h1>
        </header>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <AuthField label="First name" name="firstName" autoComplete="given-name" value={form.firstName} error={errors.firstName} onChange={(v) => set("firstName", v)} />
            <AuthField label="Last name" name="lastName" autoComplete="family-name" value={form.lastName} error={errors.lastName} onChange={(v) => set("lastName", v)} />
          </div>
          <AuthField label="Email" name="email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(v) => set("email", v)} />
          <AuthField label="Password" name="password" type="password" autoComplete="new-password" value={form.password} error={errors.password} onChange={(v) => set("password", v)} />
          <AuthField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} error={errors.confirmPassword} onChange={(v) => set("confirmPassword", v)} />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>{pending ? "Creating…" : "Create account"}</Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-brand hover:underline">Sign in</Link>
        </p>
      </div>
    </Container>
  );
}
