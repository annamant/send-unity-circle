"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/login/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, { error: "" });

  return (
    <form action={formAction} className="grid gap-4">
      <label className="grid gap-1.5 text-sm font-bold">
        Admin password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="min-h-12 rounded-2xl border border-mist bg-cream px-4 text-base font-normal"
        />
      </label>
      {state.error ? (
        <p className="text-coral font-bold" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
