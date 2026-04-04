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
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
      
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username.trim().toLowerCase(),
              password,
            }),
          });
      
          const data: LoginResponse | { error?: string } = await res.json();
      
          if (!res.ok) {
            const message = "error" in data ? data.error : undefined;
            throw new Error(message || "Röng innskráning");
          }
      
          if (!("token" in data)) {
            throw new Error("Token vantar í svari");
          }
      
          saveToken(data.token);
          setSuccess("Innskráning tókst. Fer á admin svæði...");
          router.push("/admin");
          router.refresh();
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
        {success ? <p className="success">{success}</p> : null}

        <button type="submit" className="button" disabled={loading}>
            {loading ? "Skrái inn..." : "Innskrá"}
        </button>
        </form>
    );
}