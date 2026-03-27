"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchForm() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={onSubmit} className="search-form">
      <input
        type="text"
        placeholder="Leita..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="button">
        Leita
      </button>
    </form>
  );
}