import { LoginForm } from "@/components/login-form";
import { isAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 grid gap-6">
      <h1 className="font-display text-4xl">Admin sign in</h1>
      <p className="text-ink-muted leading-relaxed">
        This area is for SEND Unity Circle admin — the pending queue, going live
        after joining a group, and schools that still need a group.
      </p>
      <div className="rounded-3xl bg-paper border border-mist p-5">
        <LoginForm />
      </div>
    </div>
  );
}
