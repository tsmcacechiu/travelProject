import Link from "next/link";
import AuthStatus from "@/components/auth/AuthStatus";

const navLinks = [
  { label: "旅遊文章", href: "/articles" },
  { label: "旅遊攻略", href: "/guides" },
  { label: "生命倒數", href: "/countdown" },
  { label: "代購", href: "/shop" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-widest text-white uppercase">
          Travel
        </Link>
        <div className="flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium tracking-wide text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <AuthStatus />
        </div>
      </nav>
    </header>
  );
}
