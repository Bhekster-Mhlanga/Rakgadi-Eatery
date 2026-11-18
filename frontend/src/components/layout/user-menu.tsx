import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { signOut } from "@/features/auth/actions/sign-out";
import { createClient } from "@/lib/supabase/server";

const iconButton =
  "rounded-md p-2 transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

function LoginLink() {
  return (
    <Link href="/login" aria-label="Log in" className={iconButton}>
      <User className="size-5" />
    </Link>
  );
}

/** Shows a Login icon, or the customer's first name with a Log out button. */
export async function UserMenu() {
  // Without Supabase settings there is no session to look up.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return <LoginLink />;
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (!userId) return <LoginLink />;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  const firstName = profile?.full_name?.trim().split(/\s+/)[0];

  return (
    <div className="flex items-center gap-1">
      {firstName && (
        <span className="hidden max-w-28 truncate px-2 text-sm font-medium sm:inline">
          Hi, {firstName}
        </span>
      )}
      <form action={signOut}>
        <button type="submit" aria-label="Log out" title="Log out" className={iconButton}>
          <LogOut className="size-5" />
        </button>
      </form>
    </div>
  );
}
