"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeedDemoButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function seed() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Seed failed");
      }
      if (data.brief?.id) {
        router.push(`/brief/${data.brief.id}`);
      } else {
        router.push(`/business/${data.business.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Seed failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="btn btn-ghost"
        type="button"
        onClick={seed}
        disabled={loading}
      >
        {loading ? "Loading demo…" : "Open Kigali café demo"}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
