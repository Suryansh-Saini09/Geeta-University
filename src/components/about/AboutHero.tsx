import Link from "next/link";
import Image from "next/image";

const sections = [
  { label: "Recognitions", href: "#recognitions" },
  { label: "Vision & Mission", href: "#vision-mission" },
  { label: "Awards & Rankings", href: "#awards-ranking" },
  { label: "Our Legacy", href: "#legacy" },
  { label: "Leadership", href: "#leadership" },
  { label: "Governance", href: "#governance" },
  { label: "Policies", href: "#policies" },
];

export default function AboutHero() {
  return (
    <>
      <section className="w-full">
        <Image
          src="/about/1-1.webp"
          alt="Geeta University Campus"
          width={1400}
          height={570}
          sizes="100vw"
          preload
          className="h-auto w-full object-cover"
        />
      </section>

      <nav className="sticky top-0 z-40 hidden border-b border-slate-200 bg-[#E3E7EF]/95 shadow-sm backdrop-blur lg:block">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between gap-6 py-4">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="text-sm font-medium text-slate-700 transition-colors hover:text-[#0B2A4A]"
              >
                {section.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}