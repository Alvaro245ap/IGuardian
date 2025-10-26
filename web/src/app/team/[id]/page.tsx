"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Person, Shift } from "@/lib/types";
import WeekCalendar from "@/components/WeekCalendar";
import SickDialog from "@/components/SickDialog";

export default function TeamPage({ params }: { params: { id: string }}) {
  const teamId = params.id;
  const [people, setPeople] = useState<Person[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [sickFor, setSickFor] = useState<Person|null>(null);

  const range = useMemo(() => {
    const now = new Date(); const day = (now.getDay()+6)%7;
    const monday = new Date(now); monday.setDate(now.getDate()-day); monday.setHours(0,0,0,0);
    const sunday = new Date(monday); sunday.setDate(monday.getDate()+7); sunday.setHours(23,59,59,999);
    return { from: monday.toISOString(), to: sunday.toISOString() };
  }, []);

  const refresh = () => {
    api<Person[]>(`/api/teams/${teamId}/people`).then(setPeople);
    api<Shift[]>(`/api/teams/${teamId}/shifts?from=${range.from}&to=${range.to}`).then(setShifts);
  };

  useEffect(() => { refresh(); }, [teamId, range.from, range.to]);

  const runScheduler = async () => {
    await api(`/api/teams/${teamId}/scheduling/run`, { method: "POST" });
    refresh();
  };

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Weekly Calendar</h2>
        <div className="flex gap-2">
          <button onClick={runScheduler} className="rounded-lg border px-3 py-1">Auto-assign</button>
        </div>
      </div>

      <WeekCalendar shifts={shifts} people={people} />

      <div>
        <h3 className="font-medium mb-2">People</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {people.map(p => (
            <li key={p.id} className="rounded-lg border bg-white p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.displayName}</div>
                <div className="text-sm text-slate-500">{p.role}</div>
              </div>
              <button className="rounded-md border px-2 py-1" onClick={()=>setSickFor(p)}>Mark sick</button>
            </li>
          ))}
        </ul>
      </div>

      {sickFor && <SickDialog person={sickFor} teamId={teamId} onClose={()=>{ setSickFor(null); refresh(); }} />}
    </main>
  );
}
