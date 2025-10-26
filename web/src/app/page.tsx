"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Team } from "@/lib/types";
import Link from "next/link";

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => { api<Team[]>("/api/teams").then(setTeams).catch(console.error); }, []);
  return (
    <main>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Teams</h2>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map(t => (
          <li key={t.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{t.name}</div>
                <div className="text-sm text-slate-500">{t.timezone}</div>
              </div>
              <Link href={`/team/${t.id}`} className="rounded-lg border px-3 py-1">Open</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
