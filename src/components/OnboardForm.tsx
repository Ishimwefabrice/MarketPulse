"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { BusinessGoal } from "@/lib/types";

const GOAL_OPTIONS: { id: BusinessGoal; label: string }[] = [
  { id: "traffic", label: "More traffic" },
  { id: "pricing", label: "Smarter pricing" },
  { id: "content", label: "Content ideas" },
];

export function OnboardForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("Kigali");
  const [competitors, setCompetitors] = useState("");
  const [goals, setGoals] = useState<BusinessGoal[]>(["traffic", "content"]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleGoal(goal: BusinessGoal) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (goals.length === 0) {
      setError("Pick at least one goal.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, niche, city, competitors, goals }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not create business");
      }
      router.push(`/business/${data.business.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form className="panel form-grid" onSubmit={onSubmit}>
      <label>
        Business name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ikawa House"
        />
      </label>
      <label>
        Niche
        <input
          required
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="specialty coffee café"
        />
      </label>
      <label>
        City / region
        <input
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Kigali"
        />
      </label>
      <label>
        Known competitors (optional)
        <textarea
          rows={2}
          value={competitors}
          onChange={(e) => setCompetitors(e.target.value)}
          placeholder="Question Coffee, Neo Coffeehouse"
        />
      </label>
      <div>
        <div style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
          Goals
        </div>
        <div className="goals">
          {GOAL_OPTIONS.map((g) => (
            <label className="goal" key={g.id}>
              <input
                type="checkbox"
                checked={goals.includes(g.id)}
                onChange={() => toggleGoal(g.id)}
              />
              {g.label}
            </label>
          ))}
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create business"}
        </button>
      </div>
    </form>
  );
}
