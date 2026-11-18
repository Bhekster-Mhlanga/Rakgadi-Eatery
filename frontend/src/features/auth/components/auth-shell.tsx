import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
};

function LogoBadge({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Rakgadi Eatery home" className={className}>
      <Image
        src="/images/logo.jpg"
        alt="Rakgadi Eatery"
        width={96}
        height={96}
        className="size-full rounded-full object-cover"
        priority
      />
    </Link>
  );
}

/** Photo on the left, form card on the right (stacked on phones). */
export function AuthShell({ title, imageSrc, imageAlt, children }: AuthShellProps) {
  return (
    <div className="min-h-svh md:grid md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <LogoBadge className="absolute top-6 left-6 size-24 rounded-full shadow-lg" />
      </div>

      <main className="flex items-center justify-center bg-accent/40 px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-sm sm:p-8">
          <LogoBadge className="mx-auto mb-4 block size-16 md:hidden" />
          <h1 className="mb-6 text-center text-3xl font-semibold">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
