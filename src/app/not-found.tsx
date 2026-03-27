import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section>
      <h1>404 - Síða fannst ekki</h1>
      <p>Síðan sem þú ert að leita að er ekki til.</p>
      <Link href="/" className="button">
        Fara á forsíðu
      </Link>
    </section>
  );
}