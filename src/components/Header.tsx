"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";
import { useSyncExternalStore } from "react";

const links = [
  { href: "/", label: "Forsíða" },
  { href: "/events", label: "Viðburðir" },
  { href: "/search", label: "Leit" },
  { href: "/admin", label: "Admin" },
];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return !!getToken();
}

function getServerSnapshot() {
  return false;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const loggedIn = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function handleLogout() {
    removeToken();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          Tixi.is
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