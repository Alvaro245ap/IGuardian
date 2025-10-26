"use client";
import { Person } from "@/lib/types";
import { useState } from "react";
import { api } from "@/lib/api";

export default function SickDialog({ person, teamId, onClose }: { person: Person; teamId: string; onClose: ()=>void }) {
  const [start, setStart] = useState<string>(new Date().toISOString().slice(0,16));
  const [end, setEnd] = useState<string>(new Date(Date.now()+24*3600*1000).toISOString().slice(0,16));
  const [note, setNote] = useState("");

  const submit = async () => {
    await api(`/api/teams/${teamId}/people/${person.id}/sick`, {
      method: 'POST',
      body: JSON.stringify({ start, end, note })
    });
    await api(`/api/teams/${teamId}/scheduling/rebalance`, { method: 'POST', body: JSON.stringify({}) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white p-4 space-y-3">
        <div className="text-lg font-semibold">Mark sick — {person.displayName}</div>
        <label className="block text-sm">From
          <input className="w-full rounded border p-2" type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} />
        </label>
        <label className="block text-sm">To
          <input className="w-full rounded border p-2" type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} />
        </label>
        <label className="block text-sm">Note
          <input className="w-full rounded border p-2" value={note} onChange={e=>setNote(e.target.value)} />
        </label>
        <div className="flex justify-end gap-2">
          <button className="rounded border px-3 py-1" onClick={onClose}>Cancel</button>
          <button className="rounded border px-3 py-1" onClick={submit}>Save & Reassign</button>
        </div>
      </div>
    </div>
  );
}
