import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/admin/auth";
import { login } from "../actions";

export const metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { err } = await searchParams;
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-3xl font-extrabold">Admin</h1>
      {!adminConfigured() ? (
        <p className="mt-4 rounded-xl bg-card p-4 text-sm text-black/70">
          Admin is locked. Add an <strong>ADMIN_PASSWORD</strong> (at least 12 characters) in Vercel, then redeploy.
        </p>
      ) : (
        <form action={login} className="mt-6 space-y-4">
          <label className="block">
            <span className="label">Password</span>
            <input className="field" type="password" name="password" autoComplete="current-password" required autoFocus />
          </label>
          {err && <p className="text-sm text-red-600">Wrong password.</p>}
          <button className="btn-primary w-full">Log in</button>
        </form>
      )}
    </div>
  );
}
