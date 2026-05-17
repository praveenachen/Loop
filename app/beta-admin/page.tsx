"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function BetaAdminPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function resetDatabase() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      if (!res.ok) throw new Error("Reset failed");
      setStatus("Database reset + reseed complete.");
    } catch {
      setStatus("Reset failed. Ensure you are logged in as an allowed beta user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-stroke bg-white p-6 shadow-card">
      <h1 className="font-display text-3xl font-semibold text-ink">Beta Admin</h1>
      <p className="text-sm text-ink-soft">
        One-click reset for QA: clears all records and reseeds baseline users, listings, rides, groups, messages, and reviews.
      </p>
      <Button onClick={resetDatabase} disabled={loading}>
        {loading ? "Resetting..." : "Reset + Reseed Database"}
      </Button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </div>
  );
}
