"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

const links = [
  { href: "/", label: "Forsíða" },
  { href: "/events", label: "Viðburðir" },
  { href: "/search", label: "Leit" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const loggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  function handleLogout() {
    removeToken();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          H2
        </Link>

        <nav>
          <ul className="nav-list">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={active ? "nav-link active" : "nav-link"}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          {loggedIn ? (
            <button onClick={handleLogout} className="button secondary">
              Útskrá
            </button>
          ) : (
            <Link href="/login" className="button">
              Innskrá
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}