import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Freshly made kotas from Rakgadi Eatery"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

      <div className="mx-auto w-full max-w-6xl px-4 py-16">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
          YOU HUNGRY?
        </h1>
        <p className="mt-4 max-w-md font-heading text-xl font-medium text-white sm:text-2xl">
          We sell the best Kotas in Kasi
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="h-11 px-6 text-base">
            <Link href="/menu">Browse Menu</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 border-white bg-transparent px-6 text-base text-white hover:bg-white hover:text-black"
          >
            <Link href="/promos">View Promos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
