"use client";
import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Subiendo...");

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setStatus(`Subido: ${data.url}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Probar subida</h1>
      <input type="file" onChange={handleChange} />
      <p>{status}</p>
    </div>
  );
}
