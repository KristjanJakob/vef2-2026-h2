"use client";

import { FormEvent, useState } from "react";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Röng innskráning");
      }

      const data = (await res.json()) as LoginResponse;
      saveToken(data.token);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Villa kom upp");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="form">
      <div>
        <label htmlFor="username">Notendanafn</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Lykilorð</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? <p className="error">{error}</p> : null}

      <button type="submit" className="button" disabled={loading}>
        {loading ? "Skrái inn..." : "Innskrá"}
      </button>
    </form>
  );
}