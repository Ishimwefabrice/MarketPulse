"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RunIntelButton({ businessId }: { businessId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/businesses/${businessId}/run`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Intel run failed");
      }
      router.push(`/brief/${data.brief.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Intel run failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={run}
        disabled={loading}
      >
        {loading ? "Scanning the market…" : "Run weekly intel"}
      </button>
      {loading ? (
        <p className="status" style={{ marginTop: "0.75rem" }}>
          Planning queries → Tavily search → Nemotron extract → brief
        </p>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
