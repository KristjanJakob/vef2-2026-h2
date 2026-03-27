import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>Vefforritun 2, 2026 - Hópverkefni 2</p>
        <Link href="/admin">Admin</Link>
      </div>
    </footer>
  );
}