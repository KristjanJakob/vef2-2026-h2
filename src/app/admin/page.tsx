"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/api";

export default function AdminPage() {
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/forbidden");
      return;
    }

    setAllowed(true);
    setChecked(true);
  }, [router]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file) {
      setMessage("Veldu mynd fyrst.");
      return;
    }

    const token = getToken() ?? undefined;
    setLoading(true);
    setMessage("");

    try {
      await uploadImage("/images", file, token);
      setMessage("Mynd var hlaðin upp.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Villa við upload.");
    } finally {
      setLoading(false);
    }
  }

  if (!checked) {
    return <p>Hleð...</p>;
  }

  if (!allowed) {
    return null;
  }

  return (
    <section>
      <h1>Admin svæði</h1>
      <p>Þessi síða er aðeins fyrir innskráða notendur.</p>

      <div className="form">
        <label htmlFor="image">Setja inn mynd</label>
        <input id="image" type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} className="button" disabled={loading}>
          {loading ? "Hleð upp..." : "Hlaða upp mynd"}
        </button>
        {message ? <p>{message}</p> : null}
      </div>
    </section>
  );
}