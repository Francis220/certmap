import Link from "next/link";

const NAV_LINKS = [
  { href: "/#map", label: "MAP" },
  { href: "/system", label: "SYSTEMS" },
  { href: "/data", label: "DATA" },
  { href: "/about", label: "ABOUT" },
];

export function Nav() {
  return (
    <header className="border-b border-line bg-bone">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono font-semibold text-sm tracking-label text-ink">
          CERTMAP
        </Link>
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-xs tracking-label text-mid hover:text-ink focus:text-ink focus:outline-none focus:underline transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
