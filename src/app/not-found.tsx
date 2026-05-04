import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="font-mono text-xs text-mid mb-2">404</p>
      <h1 className="text-4xl font-sans font-medium text-ink mb-4">Page not found</h1>
      <Link href="/" className="font-mono text-xs text-mid hover:text-ink underline">
        ← Back to map
      </Link>
    </div>
  );
}
